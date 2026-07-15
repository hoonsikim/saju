// Saju Reading Worker
// Endpoints:
//   POST /reading           — LLM Saju reading (Claude Haiku)
//   POST /track             — 측정 이벤트 수집 (KV: METRICS)
//   POST /feedback          — 사용자 피드백 (KV: FEEDBACK, 텔레그램 ad-hoc 알림)
//   GET  /health            — health check
//   GET  /metrics?date=...  — 일자별 집계 조회 (ADMIN_TOKEN 필요)
//   GET  /feedback/recent   — 최근 피드백 조회 (ADMIN_TOKEN 필요)

import { birthInfoToFourPillars } from '../../src/saju.js';
import { buildClaudeRequest } from '../../src/reading-prompt.js';
import { attributionSource, mergeAttribution, sanitizeAttribution } from '../../src/attribution.js';

const ANTHROPIC_API = 'https://api.anthropic.com/v1/messages';
const MAX_BODY_SIZE = 4096;

function corsHeaders(env) {
  const origin = env.ALLOWED_ORIGIN || '*';
  return {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
  };
}

function json(body, status, env) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', ...corsHeaders(env) },
  });
}

function dateKey(d = new Date()) {
  return d.toISOString().slice(0, 10);
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

// Counter increment (race condition 허용 — traffic 적을 때 OK)
async function kvIncrement(kv, key) {
  const cur = (await kv.get(key)) || '0';
  const next = String(parseInt(cur, 10) + 1);
  await kv.put(key, next);
  return parseInt(next, 10);
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
    throw new Error(`Anthropic API ${res.status}: ${text}`);
  }
  const data = await res.json();
  const text = data.content?.[0]?.text || '';
  return { text, usage: data.usage };
}

// =========================================================================
// /reading
// =========================================================================
async function handleReading(request, env) {
  if (!env.ANTHROPIC_API_KEY) {
    return json({ error: 'server misconfigured: no API key' }, 500, env);
  }

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

  let reading;
  try {
    reading = await callClaude(env, claudeReq);
  } catch (e) {
    return json({ error: e.message }, 502, env);
  }

  return json(
    {
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
    },
    200,
    env
  );
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
// body: { event: string, lang?, page?, sessionId?, extra? }
// KV (METRICS):
//   ct:{date}:{event}                    → total count
//   ct:{date}:{event}:lang:{lang}        → lang-scoped count
//   ct:{date}:{event}:page:{page}        → page-scoped count
//   ct:{date}:{event}:source:{source}    → attribution source-scoped count
//   raw:{date}:{ts}-{nano}               → JSON 원본 (TTL 30d, 최근 forensic용)
// =========================================================================
async function handleTrack(request, env) {
  if (!env.METRICS) return json({ error: 'metrics KV unbound' }, 500, env);

  const parsed = await safeJson(request);
  if (parsed.error) return json({ error: parsed.error }, 400, env);
  const { event, lang, page, sessionId, extra } = parsed.value;

  if (!event || typeof event !== 'string' || event.length > 64) {
    return json({ error: 'event required (string, ≤64 chars)' }, 400, env);
  }
  const ev = event.replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 64);
  const date = dateKey();
  const safeLang = (lang || '').replace(/[^a-zA-Z-]/g, '').slice(0, 8);
  const safePage = (page || '').replace(/[^a-zA-Z0-9_./-]/g, '').slice(0, 32);
  const extraIsRecord = extra !== null && typeof extra === 'object' && !Array.isArray(extra);
  const safeAttribution = sanitizeAttribution(extraIsRecord ? extra : null);
  const safeExtra = extraIsRecord ? mergeAttribution(extra, safeAttribution) : null;
  const safeSource = attributionSource(safeAttribution);

  // counters (race condition 허용 — traffic 적음)
  const ops = [kvIncrement(env.METRICS, `ct:${date}:${ev}`)];
  if (safeLang) ops.push(kvIncrement(env.METRICS, `ct:${date}:${ev}:lang:${safeLang}`));
  if (safePage) ops.push(kvIncrement(env.METRICS, `ct:${date}:${ev}:page:${safePage}`));
  if (safeSource) ops.push(kvIncrement(env.METRICS, `ct:${date}:${ev}:source:${safeSource}`));

  // raw log (TTL 30d) — forensic
  const rawKey = `raw:${date}:${Date.now()}-${nanoid(6)}`;
  ops.push(
    env.METRICS.put(
      rawKey,
      JSON.stringify({
        ts: Date.now(),
        event: ev,
        lang: safeLang || null,
        page: safePage || null,
        sessionId: sessionId ? String(sessionId).slice(0, 64) : null,
        extra: safeExtra,
        ip: request.headers.get('cf-connecting-ip') || null,
        country: request.headers.get('cf-ipcountry') || null,
        ua: (request.headers.get('user-agent') || '').slice(0, 200),
      }),
      { expirationTtl: 60 * 60 * 24 * 30 }
    )
  );

  await Promise.all(ops);
  return json({ ok: true }, 200, env);
}

// =========================================================================
// /feedback — 사용자 피드백
// body: { rating: 1-5, text?, lang?, page?, sessionId? }
// KV (FEEDBACK):
//   fb:{date}:{ts}-{nano}        → JSON
//   fb:count:{date}              → daily count
// 텔레그램 ad-hoc 알림 (TELEGRAM_BOT_TOKEN 있을 때만)
// =========================================================================
async function handleFeedback(request, env) {
  if (!env.FEEDBACK) return json({ error: 'feedback KV unbound' }, 500, env);

  const parsed = await safeJson(request);
  if (parsed.error) return json({ error: parsed.error }, 400, env);
  const { rating, text, lang, page, sessionId } = parsed.value;

  const r = Number(rating);
  if (!Number.isFinite(r) || r < 1 || r > 5) {
    return json({ error: 'rating required (1-5)' }, 400, env);
  }
  const safeText = (text || '').toString().slice(0, 1000);
  const safeLang = (lang || '').replace(/[^a-zA-Z-]/g, '').slice(0, 8);
  const safePage = (page || '').replace(/[^a-zA-Z0-9_./-]/g, '').slice(0, 32);
  const date = dateKey();
  const key = `fb:${date}:${Date.now()}-${nanoid(6)}`;
  const fb = {
    ts: Date.now(),
    rating: Math.round(r),
    text: safeText,
    lang: safeLang || null,
    page: safePage || null,
    sessionId: sessionId ? String(sessionId).slice(0, 64) : null,
    country: request.headers.get('cf-ipcountry') || null,
    ip: request.headers.get('cf-connecting-ip') || null,
    ua: (request.headers.get('user-agent') || '').slice(0, 200),
  };

  await Promise.all([
    env.FEEDBACK.put(key, JSON.stringify(fb), { expirationTtl: 60 * 60 * 24 * 365 }),
    kvIncrement(env.FEEDBACK, `fb:count:${date}`),
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
  const prefix = `ct:${date}:`;
  const list = await env.METRICS.list({ prefix, limit: 1000 });
  const counts = {};
  for (const k of list.keys) {
    const v = await env.METRICS.get(k.name);
    counts[k.name.slice(prefix.length)] = parseInt(v || '0', 10);
  }
  return json({ date, counts, truncated: list.list_complete === false }, 200, env);
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
      return json(
        {
          ok: true,
          ts: Date.now(),
          bindings: {
            anthropic: !!env.ANTHROPIC_API_KEY,
            metrics: !!env.METRICS,
            feedback: !!env.FEEDBACK,
            telegram: !!(env.TELEGRAM_BOT_TOKEN && env.TELEGRAM_CHAT_ID),
            admin: !!env.ADMIN_TOKEN,
          },
        },
        200,
        env
      );
    }

    if (path === '/reading' && method === 'POST') return handleReading(request, env);
    if (path === '/prompt' && method === 'POST') return handlePrompt(request, env);
    if (path === '/track' && method === 'POST') return handleTrack(request, env);
    if (path === '/feedback' && method === 'POST') return handleFeedback(request, env);
    if (path === '/metrics' && method === 'GET') return handleMetricsRead(request, env);
    if (path === '/feedback/recent' && method === 'GET') return handleFeedbackRead(request, env);

    return json(
      {
        error: 'not found',
        routes: ['GET /health', 'POST /reading', 'POST /prompt', 'POST /track', 'POST /feedback', 'GET /metrics', 'GET /feedback/recent'],
      },
      404,
      env
    );
  },
};
