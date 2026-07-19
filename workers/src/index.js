// Saju Reading Worker
// Endpoints:
//   POST /reading           — LLM Saju reading (Claude Haiku)
//   POST /fulfillment/reading — internal paid-fulfillment reading generation
//   POST /track             — 측정 이벤트 수집 (KV: METRICS)
//   POST /feedback          — 사용자 피드백 (KV: FEEDBACK, 텔레그램 ad-hoc 알림)
//   GET  /health            — health check
//   GET  /metrics?date=...  — 일자별 집계 조회 (ADMIN_TOKEN 필요)
//   GET  /feedback/recent   — 최근 피드백 조회 (ADMIN_TOKEN 필요)

import { birthInfoToFourPillars } from '../../src/saju.js';
import { buildClaudeRequest } from '../../src/reading-prompt.js';
import { ATTRIBUTION_KEYS, ATTRIBUTION_REGISTRY } from '../../src/attribution.js';

const ANTHROPIC_API = 'https://api.anthropic.com/v1/messages';
const MAX_BODY_SIZE = 4096;
const TRACK_EVENT_TTL_SECONDS = 60 * 60 * 24 * 7;
const FEEDBACK_TTL_SECONDS = 60 * 60 * 24 * 30;
const TRACK_METRICS_READ_CAP = 1000;
const TRACK_METRICS_PAGE_SIZE = 250;
const TRACK_BODY_FIELDS = new Set(['event', 'lang', 'page', 'sessionId', 'extra']);
const FEEDBACK_BODY_FIELDS = new Set(['rating', 'text', 'lang', 'page', 'sessionId']);
const TRACK_ATTRIBUTION_FIELDS = new Set(ATTRIBUTION_KEYS);
const TRACK_SOURCE_REGISTRY = ATTRIBUTION_REGISTRY;
const TRACK_LANGUAGES = new Set([
  'en', 'ko', 'ja', 'zh', 'es', 'pt', 'fr', 'de', 'it', 'ru',
  'tr', 'nl', 'pl', 'sv', 'id', 'fil', 'vi', 'th', 'hi', 'ar',
]);
const TRACK_PAGES = new Set(['index']);
const TRACK_DAY_MASTERS = new Set('甲乙丙丁戊己庚辛壬癸');
const TRACK_EVENT_FIELDS = Object.freeze({
  page_view: new Set(['lang']),
  saju_lang_change: new Set(['lang']),
  saju_reading_generated: new Set(['dayMaster', 'readingType', 'lang']),
  saju_paid_block_no_gender: new Set(['product']),
  saju_paid_click: new Set(['product', 'hasBirth']),
  saju_feedback_submitted: new Set(['rating', 'hasText']),
  saju_paid_return: new Set(['hasBirth']),
  saju_daily_cta_click: new Set(['lang']),
  saju_card_download: new Set(['dayMaster', 'method', 'lang']),
  saju_card_story_download: new Set(['dayMaster', 'method', 'lang']),
  saju_share: new Set(['method', 'lang']),
});
const ZERO_WIDTH = /[\u200B-\u200D\u2060\uFEFF]/g;

function corsHeaders(env) {
  const origin = env.ALLOWED_ORIGIN || '*';
  return {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, X-Saju-Analytics-Mode',
    'Access-Control-Max-Age': '86400',
  };
}

function json(body, status, env) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', ...corsHeaders(env) },
  });
}

function configuredSecret(value) {
  const normalized = typeof value === 'string' ? value.normalize('NFKC').trim() : '';
  if (
    normalized.length < 32
    || /^(?:replace|set)[-_]/i.test(normalized)
    || /placeholder/i.test(normalized)
  ) {
    return '';
  }
  return normalized;
}

function trackNow(env) {
  const testNow = Number(env?.__TEST_NOW_MS);
  return Number.isFinite(testNow) && testNow >= 0 ? testNow : Date.now();
}

function dateKey(nowMs = Date.now()) {
  // Korea has a fixed UTC+09:00 offset and no daylight-saving transition.
  return new Date(nowMs + (9 * 60 * 60 * 1000)).toISOString().slice(0, 10);
}

function nanoid(n = 10) {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let s = '';
  for (let i = 0; i < n; i++) s += chars[(Math.random() * chars.length) | 0];
  return s;
}

async function safeJson(request) {
  const raw = await request.text();
  if (raw.length > MAX_BODY_SIZE) return { error: `body too large (max ${MAX_BODY_SIZE} bytes)` };
  try {
    return { value: JSON.parse(raw) };
  } catch {
    return { error: 'invalid JSON body' };
  }
}

function normalizeTrackString(value) {
  if (typeof value !== 'string') return null;
  return value.normalize('NFKC').replace(ZERO_WIDTH, '').trim();
}

function decodedTrackString(value) {
  let result = normalizeTrackString(value);
  if (result === null) return null;
  for (let i = 0; i < 2 && result.includes('%'); i += 1) {
    try {
      const decoded = decodeURIComponent(result);
      if (decoded === result) break;
      result = normalizeTrackString(decoded);
    } catch {
      break;
    }
  }
  return result;
}

function looksLikeTrackPii(value) {
  const normalized = decodedTrackString(value);
  if (!normalized) return false;
  const compact = normalized.replace(/\s+/g, ' ');

  if (/[^\s@]+@[^\s@]+\.[^\s@]+/u.test(compact)) return true;
  if (/\b(?:19|20)\d{2}[-/.](?:0?[1-9]|1[0-2])[-/.](?:0?[1-9]|[12]\d|3[01])\b/u.test(compact)) return true;
  if (/\b(?:0?[1-9]|[12]\d|3[01])[-/.](?:0?[1-9]|1[0-2])[-/.](?:19|20)\d{2}\b/u.test(compact)) return true;
  if (/\b(?:19|20)\d{6}(?:\d{4})?\b/u.test(compact)) return true;

  if (/^\+?[\d\s().-]+$/u.test(compact) && (compact.match(/\d/g) || []).length >= 7) return true;
  return false;
}

function looksLikeFeedbackPii(value) {
  if (looksLikeTrackPii(value)) return true;
  const normalized = decodedTrackString(value) || '';
  const phoneLikeParts = normalized.match(/\+?\d[\d\s().-]{5,}\d/g) || [];
  return phoneLikeParts.some(part => (part.match(/\d/g) || []).length >= 7);
}

function trackIdentifier(value, { maxLength, pattern }) {
  const normalized = normalizeTrackString(value);
  if (!normalized || normalized.length > maxLength || looksLikeTrackPii(normalized)) return null;
  const lowered = normalized.toLowerCase();
  return pattern.test(lowered) ? lowered : null;
}

function sanitizeTrackAttribution(extra) {
  const supplied = [...TRACK_ATTRIBUTION_FIELDS]
    .filter(key => Object.prototype.hasOwnProperty.call(extra, key));
  if (supplied.length === 0) {
    return { value: { source: 'direct', campaign: 'direct', stored: {} } };
  }
  if (!supplied.includes('source')) return { error: 'registered source is required for attribution' };
  const unsupported = supplied.find(key => key !== 'source');
  if (unsupported) return { error: `unsupported attribution field: ${unsupported}` };

  const source = trackIdentifier(extra.source, {
    maxLength: 48,
    pattern: /^[a-z0-9][a-z0-9_-]{0,47}$/,
  });
  const registration = source ? TRACK_SOURCE_REGISTRY[source] : null;
  if (!registration) return { error: 'unknown attribution source' };
  return {
    value: {
      source,
      campaign: registration.campaign,
      stored: { source },
    },
  };
}

function sanitizeTrackExtra(event, extra) {
  if (extra === undefined || extra === null) extra = {};
  if (typeof extra !== 'object' || Array.isArray(extra)) return { error: 'extra must be an object' };

  const eventFields = TRACK_EVENT_FIELDS[event];
  const allowed = new Set([...eventFields, 'source']);
  const unexpected = Object.keys(extra).filter(key => !allowed.has(key));
  if (unexpected.length > 0) return { error: `unsupported extra field: ${unexpected[0]}` };

  for (const [key, value] of Object.entries(extra)) {
    if (typeof value === 'string' && looksLikeTrackPii(value)) {
      return { error: `PII-like value rejected: ${key}` };
    }
  }

  const attributionResult = sanitizeTrackAttribution(extra);
  if (attributionResult.error) return attributionResult;
  const safe = { ...attributionResult.value.stored };

  for (const key of eventFields) {
    if (!Object.prototype.hasOwnProperty.call(extra, key)) continue;
    const value = extra[key];
    if (key === 'lang') {
      const lang = normalizeTrackString(value)?.toLowerCase();
      if (!TRACK_LANGUAGES.has(lang)) return { error: 'invalid extra field: lang' };
      safe.lang = lang;
    } else if (key === 'product') {
      if (normalizeTrackString(value)?.toLowerCase() !== 'deep') return { error: 'invalid extra field: product' };
      safe.product = 'deep';
    } else if (key === 'hasBirth' || key === 'hasText') {
      if (typeof value !== 'boolean') return { error: `invalid extra field: ${key}` };
      safe[key] = value;
    } else if (key === 'rating') {
      if (!Number.isInteger(value) || value < 1 || value > 5) return { error: 'invalid extra field: rating' };
      safe.rating = value;
    } else if (key === 'dayMaster') {
      const dayMaster = normalizeTrackString(value);
      if (!dayMaster || !TRACK_DAY_MASTERS.has(dayMaster)) return { error: 'invalid extra field: dayMaster' };
      safe.dayMaster = dayMaster;
    } else if (key === 'readingType') {
      const readingType = normalizeTrackString(value)?.toLowerCase();
      if (!['general', 'career', 'love', 'wealth'].includes(readingType)) return { error: 'invalid extra field: readingType' };
      safe.readingType = readingType;
    } else if (key === 'method') {
      const method = normalizeTrackString(value)?.toLowerCase();
      if (!['native', 'clipboard', 'download'].includes(method)) return { error: 'invalid extra field: method' };
      safe.method = method;
    }
  }

  return {
    value: safe,
    attribution: {
      source: attributionResult.value.source,
      campaign: attributionResult.value.campaign,
    },
  };
}

function classifyExcludedTraffic(request, env) {
  const analyticsMode = normalizeTrackString(request.headers.get('x-saju-analytics-mode'))?.toLowerCase();
  if (analyticsMode === 'exclude') return 'signaled_exclusion';

  const ua = request.headers.get('user-agent') || '';
  if (/\b(?:bot|crawler|spider|headlesschrome|playwright|puppeteer|selenium|miniflare|wrangler)\b/i.test(ua)) {
    return 'automation';
  }
  return null;
}

async function sha256Hex(value) {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(value));
  return [...new Uint8Array(digest)].map(byte => byte.toString(16).padStart(2, '0')).join('');
}

async function notifyTelegramFeedback(env, fb) {
  if (!env.TELEGRAM_BOT_TOKEN || !env.TELEGRAM_CHAT_ID) return false;
  const ts = new Date().toLocaleTimeString('ko-KR', { timeZone: 'Asia/Seoul', hour: '2-digit', minute: '2-digit', hour12: false });
  const stars = '★'.repeat(fb.rating) + '☆'.repeat(5 - fb.rating);
  const text = `📈 [signal] ${ts} KST\n신규 피드백: ${stars} (${fb.rating}/5)\n언어: ${fb.lang || '?'} · 페이지: ${fb.page || '?'}\n${fb.text ? `\n"${fb.text.slice(0, 200)}"` : ''}`;
  try {
    await fetch(`https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: env.TELEGRAM_CHAT_ID, text }),
    });
    return true;
  } catch {
    return false;
  }
}

function validateReadingInput(input) {
  const required = ['year', 'month', 'day', 'hour'];
  for (const k of required) {
    if (typeof input[k] !== 'number') return `missing or non-numeric: ${k}`;
  }
  const { year, month, day, hour } = input;
  if (year < 1900 || year > 2100) return 'year out of range (1900–2100)';
  if (month < 1 || month > 12) return 'month out of range (1–12)';
  if (day < 1 || day > 31) return 'day out of range (1–31)';
  if (hour < 0 || hour > 23) return 'hour out of range (0–23)';
  return null;
}

async function callClaude(env, request) {
  const body = {
    model: env.ANTHROPIC_MODEL || 'claude-opus-4-8',
    max_tokens: Number(env.MAX_TOKENS) || 8192,
    system: request.system,
    messages: request.messages,
  };
  const res = await fetch(ANTHROPIC_API, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': env.ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const text = await res.text();
    throw Object.assign(new Error(`Anthropic API ${res.status}: ${text}`), {
      code: `anthropic_${res.status}`,
      status: 502,
      retryable: res.status >= 500 || res.status === 429,
    });
  }
  const data = await res.json();
  const text = data.content?.[0]?.text || '';
  return { text, usage: data.usage };
}

// =========================================================================
// /reading
// =========================================================================
async function generateReading(request, env) {
  if (!env.ANTHROPIC_API_KEY) {
    throw Object.assign(new Error('server misconfigured: no API key'), {
      code: 'anthropic_key_missing',
      status: 500,
      retryable: false,
    });
  }

  const parsed = await safeJson(request);
  if (parsed.error) {
    throw Object.assign(new Error(parsed.error), { code: 'invalid_json', status: 400, retryable: false });
  }
  const input = parsed.value;

  const validationError = validateReadingInput(input);
  if (validationError) {
    throw Object.assign(new Error(validationError), { code: 'invalid_birth_input', status: 400, retryable: false });
  }

  const language = input.language || 'en';

  let saju;
  try {
    saju = birthInfoToFourPillars({
      year: input.year,
      month: input.month,
      day: input.day,
      hour: input.hour,
      minute: input.minute || 0,
      gender: input.gender || null,
      city: input.city || null,
    });
  } catch (e) {
    throw Object.assign(new Error(`saju calc failed: ${e.message}`), {
      code: 'saju_calc_failed',
      status: 500,
      retryable: false,
    });
  }

  const claudeReq = buildClaudeRequest(saju, { language, readingType: input.readingType });

  let reading;
  try {
    reading = await callClaude(env, claudeReq);
  } catch (e) {
    if (!e.code) {
      e.code = 'anthropic_failed';
      e.status = 502;
      e.retryable = true;
    }
    throw e;
  }

  return {
    saju: {
      pillars: saju.pillars,
      dayMaster: saju.dayMaster,
      dayMasterElement: saju.dayMasterElement,
      elements: saju.elements,
      tenGods: saju.tenGods,
    },
    reading: reading.text,
    language,
    usage: reading.usage,
  };
}

async function handleReading(request, env) {
  try {
    return json(await generateReading(request, env), 200, env);
  } catch (e) {
    return json({ error: e.message }, e.status || 502, env);
  }
}

async function tokenEquals(candidate, expected) {
  const encoder = new TextEncoder();
  const [candidateHash, expectedHash] = await Promise.all([
    crypto.subtle.digest('SHA-256', encoder.encode(candidate || '')),
    crypto.subtle.digest('SHA-256', encoder.encode(expected || '')),
  ]);
  const left = new Uint8Array(candidateHash);
  const right = new Uint8Array(expectedHash);
  let difference = 0;
  for (let index = 0; index < left.length; index += 1) difference |= left[index] ^ right[index];
  return difference === 0;
}

async function requireFulfillmentReadingToken(request, env) {
  const expected = configuredSecret(env.FULFILLMENT_READING_TOKEN);
  const header = request.headers.get('Authorization') || '';
  const match = header.match(/^Bearer\s+(.+)$/i);
  if (!expected) {
    throw Object.assign(new Error('fulfillment reading token missing'), {
      code: 'fulfillment_auth_unavailable',
      status: 503,
      retryable: false,
    });
  }
  if (!match || !(await tokenEquals(match[1].trim(), expected))) {
    throw Object.assign(new Error('unauthorized'), {
      code: 'unauthorized',
      status: 401,
      retryable: false,
    });
  }
}

async function handleFulfillmentReading(request, env) {
  try {
    await requireFulfillmentReadingToken(request, env);
    const generated = await generateReading(request, env);
    return json({
      ok: true,
      reading: generated.reading,
      language: generated.language,
      usage: generated.usage,
    }, 200, env);
  } catch (e) {
    return json({
      error: {
        code: e.code || 'internal_error',
        retryable: e.retryable === true,
      },
    }, e.status || 500, env);
  }
}

// =========================================================================
// /prompt — saju 계산 + Claude prompt 빌드만 (Anthropic 호출 X)
// n8n이 Anthropic 직접 호출하는 path 지원 (Worker egress Anthropic 403 우회)
// body: 동일 (year/month/day/hour/minute/...). 응답: { saju, prompt, model }
// =========================================================================
async function handlePrompt(request, env) {
  const parsed = await safeJson(request);
  if (parsed.error) return json({ error: parsed.error }, 400, env);
  const input = parsed.value;

  const validationError = validateReadingInput(input);
  if (validationError) return json({ error: validationError }, 400, env);

  const language = input.language || 'en';

  let saju;
  try {
    saju = birthInfoToFourPillars({
      year: input.year,
      month: input.month,
      day: input.day,
      hour: input.hour,
      minute: input.minute || 0,
      gender: input.gender || null,
      city: input.city || null,
    });
  } catch (e) {
    return json({ error: `saju calc failed: ${e.message}` }, 500, env);
  }

  const claudeReq = buildClaudeRequest(saju, { language, readingType: input.readingType });

  return json(
    {
      saju: {
        pillars: saju.pillars,
        dayMaster: saju.dayMaster,
        dayMasterElement: saju.dayMasterElement,
        elements: saju.elements,
        tenGods: saju.tenGods,
      },
      prompt: {
        system: claudeReq.system,
        messages: claudeReq.messages,
      },
      model: env.ANTHROPIC_MODEL || 'claude-opus-4-8',
      max_tokens: Number(env.MAX_TOKENS) || 8192,
      language,
    },
    200,
    env
  );
}

// =========================================================================
// /track — 측정 이벤트 수집
// body: { event: allowlisted string, lang?, page?, sessionId, extra? }
// KV (METRICS):
//   evt:v2:{KST-date}:{source}:{campaign}:{event}:{sha256(session)}
//
// There are no read/modify/write counters and no separate raw/dedupe records.
// Concurrent duplicate deliveries overwrite the same deterministic TTL key,
// so enumeration converges to one event without pretending KV has atomic
// insert-if-absent semantics. Public clients can still forge fresh sessions;
// metrics therefore remain directional until stronger server-side/human proof.
// =========================================================================
async function handleTrack(request, env) {
  if (!env.METRICS) return json({ error: 'metrics KV unbound' }, 500, env);

  const parsed = await safeJson(request);
  if (parsed.error) return json({ error: parsed.error }, 400, env);
  if (parsed.value === null || typeof parsed.value !== 'object' || Array.isArray(parsed.value)) {
    return json({ error: 'JSON object required' }, 400, env);
  }

  const unexpectedBodyField = Object.keys(parsed.value).find(key => !TRACK_BODY_FIELDS.has(key));
  if (unexpectedBodyField) return json({ error: `unsupported body field: ${unexpectedBodyField}` }, 400, env);

  const ev = normalizeTrackString(parsed.value.event);
  if (!ev || !Object.prototype.hasOwnProperty.call(TRACK_EVENT_FIELDS, ev)) {
    return json({ error: 'event is not allowlisted' }, 400, env);
  }

  const sessionId = normalizeTrackString(parsed.value.sessionId);
  if (!sessionId || sessionId.length > 53 || !/^sess_[a-z0-9][a-z0-9_-]{5,47}$/i.test(sessionId) || looksLikeTrackPii(sessionId.slice(5))) {
    return json({ error: 'sessionId must match sess_[A-Za-z0-9_-]{6,48}' }, 400, env);
  }

  const lang = parsed.value.lang === undefined || parsed.value.lang === null || parsed.value.lang === ''
    ? null
    : normalizeTrackString(parsed.value.lang)?.toLowerCase();
  if (lang !== null && !TRACK_LANGUAGES.has(lang)) return json({ error: 'invalid lang' }, 400, env);

  const page = parsed.value.page === undefined || parsed.value.page === null || parsed.value.page === ''
    ? null
    : normalizeTrackString(parsed.value.page)?.toLowerCase();
  if (page !== null && !TRACK_PAGES.has(page)) return json({ error: 'page is not allowlisted' }, 400, env);

  const extraResult = sanitizeTrackExtra(ev, parsed.value.extra);
  if (extraResult.error) return json({ error: extraResult.error }, 400, env);
  const safeExtra = extraResult.value;
  const { source, campaign } = extraResult.attribution;
  const now = trackNow(env);
  const date = dateKey(now);

  const excludedClass = classifyExcludedTraffic(request, env);
  if (excludedClass) {
    return json({
      ok: true,
      accepted: false,
      excluded: true,
      reason: excludedClass,
      writes: 0,
    }, 200, env);
  }

  const sessionHash = await sha256Hex(`saju-track-v1\u0000${sessionId}`);
  const eventKey = `evt:v2:${date}:${source}:${campaign}:${ev}:${sessionHash}`;
  const eventRecord = JSON.stringify({
    version: 2,
    event: ev,
    source,
    campaign,
    lang,
    page,
    properties: safeExtra,
  });

  try {
    await env.METRICS.put(eventKey, eventRecord, { expirationTtl: TRACK_EVENT_TTL_SECONDS });
  } catch {
    return json({ error: 'metrics write failed', retryable: true }, 503, env);
  }

  return json({
    ok: true,
    accepted: true,
    dedupe: 'deterministic_key_convergence',
    writes: 1,
  }, 200, env);
}

// =========================================================================
// /feedback — 사용자 피드백
// body: { rating: 1-5, text?, lang?, page?, sessionId? }
// KV (FEEDBACK):
//   fb:{KST-date}:{ts}-{nano}    → bounded JSON, TTL 30d
// 텔레그램 ad-hoc 알림 (TELEGRAM_BOT_TOKEN 있을 때만)
// =========================================================================
async function handleFeedback(request, env) {
  if (!env.FEEDBACK) return json({ error: 'feedback KV unbound' }, 500, env);

  const parsed = await safeJson(request);
  if (parsed.error) return json({ error: parsed.error }, 400, env);
  if (parsed.value === null || typeof parsed.value !== 'object' || Array.isArray(parsed.value)) {
    return json({ error: 'JSON object required' }, 400, env);
  }
  const unexpectedBodyField = Object.keys(parsed.value).find(key => !FEEDBACK_BODY_FIELDS.has(key));
  if (unexpectedBodyField) return json({ error: `unsupported body field: ${unexpectedBodyField}` }, 400, env);
  const { rating, text, lang, page, sessionId } = parsed.value;

  const r = Number(rating);
  if (!Number.isInteger(r) || r < 1 || r > 5) {
    return json({ error: 'rating required (1-5)' }, 400, env);
  }
  if (text !== undefined && text !== null && typeof text !== 'string') {
    return json({ error: 'text must be a string' }, 400, env);
  }
  const safeText = normalizeTrackString(text || '')?.slice(0, 500) || '';
  if (safeText && looksLikeFeedbackPii(safeText)) {
    return json({ error: 'feedback text must not include birth or contact identifiers' }, 400, env);
  }
  const safeLang = normalizeTrackString(lang || '')?.toLowerCase() || '';
  if (safeLang && !TRACK_LANGUAGES.has(safeLang)) return json({ error: 'invalid lang' }, 400, env);
  const safePage = normalizeTrackString(page || '')?.toLowerCase() || '';
  if (safePage && !TRACK_PAGES.has(safePage)) return json({ error: 'page is not allowlisted' }, 400, env);

  let sessionHash = null;
  if (sessionId !== undefined && sessionId !== null && sessionId !== '') {
    const safeSession = normalizeTrackString(sessionId);
    if (!safeSession || safeSession.length > 53 || !/^sess_[a-z0-9][a-z0-9_-]{5,47}$/i.test(safeSession) || looksLikeTrackPii(safeSession.slice(5))) {
      return json({ error: 'invalid sessionId' }, 400, env);
    }
    sessionHash = `sha256:${await sha256Hex(`saju-feedback-v1\u0000${safeSession}`)}`;
  }

  const now = trackNow(env);
  const date = dateKey(now);
  const key = `fb:${date}:${now}-${nanoid(6)}`;
  const fb = {
    ts: now,
    rating: r,
    text: safeText,
    lang: safeLang || null,
    page: safePage || null,
    sessionHash,
  };

  await Promise.all([
    env.FEEDBACK.put(key, JSON.stringify(fb), { expirationTtl: FEEDBACK_TTL_SECONDS }),
    notifyTelegramFeedback(env, fb),
  ]);

  return json({ ok: true }, 200, env);
}

// =========================================================================
// admin auth
// =========================================================================
function checkAdmin(request, env) {
  if (!env.ADMIN_TOKEN) return { ok: false, status: 503, error: 'admin disabled (no ADMIN_TOKEN)' };
  const got = request.headers.get('x-admin-token') || new URL(request.url).searchParams.get('token');
  if (got !== env.ADMIN_TOKEN) return { ok: false, status: 401, error: 'admin token mismatch' };
  return { ok: true };
}

// =========================================================================
// GET /metrics?date=YYYY-MM-DD (admin)
// =========================================================================
async function handleMetricsRead(request, env) {
  const auth = checkAdmin(request, env);
  if (!auth.ok) return json({ error: auth.error }, auth.status, env);
  if (!env.METRICS) return json({ error: 'metrics KV unbound' }, 500, env);

  const date = new URL(request.url).searchParams.get('date') || dateKey();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return json({ error: 'date must be YYYY-MM-DD' }, 400, env);

  const requestedTestPageSize = Number(env.__TEST_METRICS_PAGE_SIZE);
  const pageSize = Number.isInteger(requestedTestPageSize) && requestedTestPageSize > 0
    ? Math.min(requestedTestPageSize, TRACK_METRICS_PAGE_SIZE)
    : TRACK_METRICS_PAGE_SIZE;
  const prefix = `evt:v2:${date}:`;
  const counts = {};
  const distinct = {};
  let cursor;
  let keysRead = 0;
  let invalidRecords = 0;
  let complete = false;
  let paginationFault = false;

  function increment(target, key) {
    target[key] = (target[key] || 0) + 1;
  }

  while (keysRead < TRACK_METRICS_READ_CAP) {
    const limit = Math.min(pageSize, TRACK_METRICS_READ_CAP - keysRead);
    const options = cursor ? { prefix, limit, cursor } : { prefix, limit };
    const page = await env.METRICS.list(options);
    const keys = Array.isArray(page.keys) ? page.keys : [];
    const records = await Promise.all(keys.map(key => env.METRICS.get(key.name)));
    keysRead += keys.length;

    for (const raw of records) {
      if (!raw) {
        invalidRecords += 1;
        continue;
      }
      let record;
      try {
        record = JSON.parse(raw);
      } catch {
        invalidRecords += 1;
        continue;
      }

      const validEvent = Object.prototype.hasOwnProperty.call(TRACK_EVENT_FIELDS, record.event);
      const registration = TRACK_SOURCE_REGISTRY[record.source];
      const validAttribution = (record.source === 'direct' && record.campaign === 'direct')
        || (registration && registration.campaign === record.campaign);
      const validLang = record.lang === null || TRACK_LANGUAGES.has(record.lang);
      const validPage = record.page === null || TRACK_PAGES.has(record.page);
      if (!validEvent || !validAttribution || !validLang || !validPage) {
        invalidRecords += 1;
        continue;
      }

      increment(counts, record.event);
      if (record.lang) increment(counts, `${record.event}:lang:${record.lang}`);
      if (record.page) increment(counts, `${record.event}:page:${record.page}`);
      if (record.source !== 'direct') increment(counts, `${record.event}:source:${record.source}`);
      increment(distinct, `${record.event}:source:${record.source}:campaign:${record.campaign}`);
    }

    if (page.list_complete !== false) {
      complete = true;
      break;
    }
    if (!page.cursor || page.cursor === cursor || keys.length === 0) {
      paginationFault = true;
      break;
    }
    cursor = page.cursor;
  }

  const saturated = !complete;
  return json({
    date,
    counts,
    distinct,
    excluded: {},
    keysRead,
    hardReadCap: TRACK_METRICS_READ_CAP,
    saturated,
    truncated: saturated,
    paginationFault,
    invalidRecords,
    decisionQuality: saturated ? 'not-decision-quality' : 'directional-only',
    directional: true,
    publicForgeryResistant: false,
    caveat: saturated
      ? 'Hard read cap reached; aggregates are partial and not decision-quality.'
      : 'Public clients can forge fresh sessions; use only as directional evidence until stronger Durable Object and human verification exists.',
  }, 200, env);
}

// =========================================================================
// GET /feedback/recent?limit=N (admin)
// =========================================================================
async function handleFeedbackRead(request, env) {
  const auth = checkAdmin(request, env);
  if (!auth.ok) return json({ error: auth.error }, auth.status, env);
  if (!env.FEEDBACK) return json({ error: 'feedback KV unbound' }, 500, env);

  const limit = Math.min(parseInt(new URL(request.url).searchParams.get('limit') || '20', 10), 100);
  const list = await env.FEEDBACK.list({ prefix: 'fb:', limit });
  const items = [];
  for (const k of list.keys) {
    if (k.name.startsWith('fb:count:')) continue;
    const raw = await env.FEEDBACK.get(k.name);
    if (raw) items.push(JSON.parse(raw));
  }
  // 최신순
  items.sort((a, b) => b.ts - a.ts);
  return json({ count: items.length, items }, 200, env);
}

// =========================================================================
export default {
  async fetch(request, env) {
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: corsHeaders(env) });
    }

    const url = new URL(request.url);
    const path = url.pathname;
    const method = request.method;

    if (path === '/health' && method === 'GET') {
      return json({ ok: true }, 200, env);
    }

    if (path === '/reading' && method === 'POST') return handleReading(request, env);
    if (path === '/fulfillment/reading' && method === 'POST') return handleFulfillmentReading(request, env);
    if (path === '/prompt' && method === 'POST') return handlePrompt(request, env);
    if (path === '/track' && method === 'POST') return handleTrack(request, env);
    if (path === '/feedback' && method === 'POST') return handleFeedback(request, env);
    if (path === '/metrics' && method === 'GET') return handleMetricsRead(request, env);
    if (path === '/feedback/recent' && method === 'GET') return handleFeedbackRead(request, env);

    return json(
      { error: 'not found' },
      404,
      env
    );
  },
};
