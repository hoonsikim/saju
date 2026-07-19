const GUMROAD_API_BASE = 'https://api.gumroad.com/v2';
const RESEND_API = 'https://api.resend.com/emails';

const EXPECTED_PERMALINK = 'reading';
const EXPECTED_PRICE_CENTS = 700;
const EXPECTED_CURRENCY = 'usd';
const EXPECTED_QUANTITY = 1;
const MAX_ATTEMPTS = 3;
const MAX_RESEND_ATTEMPTS = 1;
const GENERATION_CANARY_BIRTH = Object.freeze({
  year: 1990,
  month: 1,
  day: 1,
  hour: 12,
  minute: 0,
  gender: 'female',
  language: 'en',
  readingType: 'general',
});

const REGISTERED_SOURCES = new Set([
  'indexnow_saju_vs_bazi_001',
  'reddit_chinesezodiac_001',
  'reddit_chineseastrology_001',
  'fivearts_001',
  'gumroad_discover_001',
]);
const LANGUAGES = new Set(['en', 'ko', 'ja', 'zh', 'es', 'pt', 'fr', 'de', 'it', 'ru', 'tr', 'nl', 'pl', 'sv', 'id', 'fil', 'vi', 'th', 'hi', 'ar']);
const READING_TYPES = new Set(['general', 'career', 'love', 'wealth']);
const GENDERS = new Set(['male', 'female']);

function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

function nowIso() {
  return new Date().toISOString();
}

function isRecord(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function asString(value) {
  return typeof value === 'string' ? value.normalize('NFKC').trim() : '';
}

function errorCode(error) {
  return error?.code || 'internal_error';
}

function configuredValue(value) {
  const normalized = asString(value);
  if (!normalized || /^(?:replace|set)[-_]/i.test(normalized)) return '';
  return normalized;
}

function configuredSecret(value) {
  const normalized = configuredValue(value);
  if (normalized.length < 32 || /placeholder/i.test(normalized)) return '';
  return normalized;
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

async function requirePingToken(url, env) {
  const expected = configuredValue(env.PING_TOKEN);
  const match = url.pathname.match(/^\/gumroad\/ping\/([A-Za-z0-9_-]{32,128})$/);
  if (!expected || !match || !(await tokenEquals(match[1], expected))) {
    throw Object.assign(new Error('not found'), { code: 'not_found', status: 404 });
  }
}

function saleIdFromBody(body) {
  return asString(body.get('sale_id') || body.get('id') || body.get('sale[id]'));
}

async function parsePing(request) {
  const contentType = request.headers.get('content-type') || '';
  if (!contentType.toLowerCase().includes('application/x-www-form-urlencoded')) {
    throw Object.assign(new Error('form-urlencoded body required'), { code: 'bad_content_type', status: 415 });
  }
  const text = await request.text();
  if (text.length > 8192) {
    throw Object.assign(new Error('body too large'), { code: 'body_too_large', status: 413 });
  }
  const body = new URLSearchParams(text);
  const saleId = saleIdFromBody(body);
  if (!saleId || saleId.length > 128 || !/^[A-Za-z0-9._=-]+$/.test(saleId)) {
    throw Object.assign(new Error('sale_id required'), { code: 'missing_sale_id', status: 400 });
  }
  return { saleId };
}

async function fetchVerifiedSale(env, saleId) {
  if (!env.GUMROAD_ACCESS_TOKEN) {
    throw Object.assign(new Error('Gumroad token missing'), { code: 'gumroad_token_missing', status: 500, retryable: false });
  }
  const response = await fetch(`${GUMROAD_API_BASE}/sales/${encodeURIComponent(saleId)}`, {
    method: 'GET',
    headers: { Authorization: `Bearer ${env.GUMROAD_ACCESS_TOKEN}` },
  });
  if (!response.ok) {
    throw Object.assign(new Error('Gumroad sale fetch failed'), {
      code: `gumroad_${response.status}`,
      status: response.status >= 500 ? 503 : 400,
      retryable: response.status >= 500,
    });
  }
  const data = await response.json();
  const sale = isRecord(data?.sale) ? data.sale : isRecord(data) && data.success !== false ? data : null;
  if (!sale) {
    throw Object.assign(new Error('Gumroad sale missing'), { code: 'gumroad_sale_missing', status: 400, retryable: false });
  }
  verifySaleShape(sale, env, saleId);
  return sale;
}

function numericCents(...values) {
  for (const value of values) {
    if (Number.isInteger(value)) return value;
    if (typeof value === 'number' && Number.isFinite(value)) return Math.round(value);
    if (typeof value === 'string' && /^\d+$/.test(value.trim())) return Number(value);
  }
  return null;
}

function booleanValue(value) {
  if (value === true || value === false) return value;
  if (typeof value === 'string') {
    const lowered = value.toLowerCase();
    if (lowered === 'true') return true;
    if (lowered === 'false') return false;
  }
  return null;
}

function verifySaleShape(sale, env = {}, requestedSaleId = '') {
  const expectedSellerId = configuredValue(env.EXPECTED_GUMROAD_SELLER_ID);
  const expectedProductId = configuredValue(env.EXPECTED_GUMROAD_PRODUCT_ID);
  if (!expectedSellerId || !expectedProductId) {
    throw Object.assign(new Error('Gumroad identifiers missing'), { code: 'gumroad_identifiers_missing', status: 500, retryable: false });
  }

  if (asString(sale.id) !== requestedSaleId) throw Object.assign(new Error('sale id mismatch'), { code: 'sale_id_mismatch' });

  if (sale.seller_id !== expectedSellerId) throw Object.assign(new Error('seller mismatch'), { code: 'seller_mismatch' });

  const productId = asString(sale.product_id);
  const permalink = asString(sale.product_permalink || sale.permalink || sale.product?.permalink);
  if (productId) {
    if (productId !== expectedProductId) throw Object.assign(new Error('product mismatch'), { code: 'product_mismatch' });
  } else if (permalink !== EXPECTED_PERMALINK) {
    throw Object.assign(new Error('product missing'), { code: 'product_missing' });
  }

  const cents = numericCents(sale.price_cents, sale.price, sale.paid_cents, sale.amount_cents);
  if (cents !== EXPECTED_PRICE_CENTS) throw Object.assign(new Error('price mismatch'), { code: 'price_mismatch' });

  const currency = asString(sale.currency || sale.currency_code).toLowerCase();
  if (currency !== EXPECTED_CURRENCY) throw Object.assign(new Error('currency mismatch'), { code: 'currency_mismatch' });

  const quantity = Number(sale.quantity);
  if (quantity !== EXPECTED_QUANTITY) throw Object.assign(new Error('quantity mismatch'), { code: 'quantity_mismatch' });

  if (booleanValue(sale.paid) !== true) throw Object.assign(new Error('sale not paid'), { code: 'sale_not_paid' });
  if (booleanValue(sale.test) !== false) throw Object.assign(new Error('test sale'), { code: 'test_sale' });

  for (const key of ['refunded', 'partially_refunded', 'chargedback', 'disputed']) {
    if (booleanValue(sale[key]) !== false) throw Object.assign(new Error(`${key} sale or unknown state`), { code: key });
  }
}

function fieldEntries(container) {
  if (!container) return [];
  if (isRecord(container)) return Object.entries(container);
  if (Array.isArray(container)) {
    return container.flatMap((item) => {
      if (!isRecord(item)) return [];
      const key = item.key ?? item.name ?? item.field;
      if (typeof key !== 'string') return [];
      return [[key, item.value ?? item.answer ?? item.content ?? '']];
    });
  }
  return [];
}

function authenticatedFieldMap(sale) {
  const map = new Map();
  const containers = [
    sale.url_params,
    sale.url_parameters,
    sale.custom_fields,
    sale.custom_fields_info,
    sale.custom_fields_details,
  ];
  for (const container of containers) {
    for (const [key, value] of fieldEntries(container)) {
      if (typeof value === 'string' || typeof value === 'number') {
        map.set(String(key), String(value));
      }
    }
  }
  return map;
}

function readField(map, name) {
  return asString(map.get(name) ?? map.get(name.toLowerCase()) ?? map.get(name.toUpperCase()));
}

function parseBirthFields(sale) {
  const fields = authenticatedFieldMap(sale);
  const birth = readField(fields, 'birth');
  if (!/^\d{12}$/.test(birth)) throw Object.assign(new Error('birth missing'), { code: 'birth_missing' });

  const year = Number(birth.slice(0, 4));
  const month = Number(birth.slice(4, 6));
  const day = Number(birth.slice(6, 8));
  const hour = Number(birth.slice(8, 10));
  const minute = Number(birth.slice(10, 12));
  if (year < 1900 || year > 2100 || month < 1 || month > 12 || day < 1 || day > 31 || hour < 0 || hour > 23 || minute < 0 || minute > 59) {
    throw Object.assign(new Error('birth invalid'), { code: 'birth_invalid' });
  }

  const gender = readField(fields, 'gender').toLowerCase();
  if (!GENDERS.has(gender)) throw Object.assign(new Error('gender missing'), { code: 'gender_missing' });

  const language = (readField(fields, 'lang') || 'en').toLowerCase();
  if (!LANGUAGES.has(language)) throw Object.assign(new Error('language invalid'), { code: 'language_invalid' });

  const readingType = (readField(fields, 'readingType') || 'general').toLowerCase();
  if (!READING_TYPES.has(readingType)) throw Object.assign(new Error('readingType invalid'), { code: 'reading_type_invalid' });

  return { year, month, day, hour, minute, gender, language, readingType };
}

function sourceFromSale(sale) {
  const source = readField(authenticatedFieldMap(sale), 'source').toLowerCase();
  return REGISTERED_SOURCES.has(source) ? source : null;
}

function buyerEmailFromSale(sale) {
  const email = asString(sale.email || sale.purchase_email || sale.buyer_email);
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254) {
    throw Object.assign(new Error('buyer email missing'), { code: 'buyer_email_missing' });
  }
  return email;
}

async function execRun(statement) {
  return statement.run();
}

async function execFirst(statement) {
  return statement.first();
}

async function insertOrder(env, saleId, source) {
  const ts = nowIso();
  const result = await execRun(env.DB.prepare(
    `INSERT OR IGNORE INTO orders
      (sale_id, status, source, created_at, updated_at, queued_at)
      VALUES (?, 'queue_pending', ?, ?, ?, NULL)`
  ).bind(saleId, source, ts, ts));
  return (result?.meta?.changes ?? result?.changes ?? 0) === 1;
}

async function markState(env, saleId, status, fields = {}, options = {}) {
  const ts = nowIso();
  const allowed = {
    queued_at: fields.queued_at,
    processing_started_at: fields.processing_started_at,
    prompted_at: fields.prompted_at,
    anthropic_at: fields.anthropic_at,
    resend_at: fields.resend_at,
    delivered_at: fields.delivered_at,
    failed_at: fields.failed_at,
    last_error_code: fields.last_error_code,
    last_error_at: fields.last_error_at,
  };
  const assignments = ['status = ?', 'updated_at = ?'];
  const values = [status, ts];
  for (const [key, value] of Object.entries(allowed)) {
    if (value === undefined) continue;
    assignments.push(`${key} = ?`);
    values.push(value);
  }
  values.push(saleId);
  let condition = 'sale_id = ?';
  if (Array.isArray(options.from) && options.from.length > 0) {
    condition += ` AND status IN (${options.from.map(() => '?').join(', ')})`;
    values.push(...options.from);
  }
  return execRun(env.DB.prepare(`UPDATE orders SET ${assignments.join(', ')} WHERE ${condition}`).bind(...values));
}

async function claimForProcessing(env, saleId) {
  const ts = nowIso();
  const result = await execRun(env.DB.prepare(
    `UPDATE orders
      SET status = 'processing',
          attempt_count = attempt_count + 1,
          processing_started_at = ?,
          updated_at = ?
      WHERE sale_id = ?
        AND status IN ('queued', 'retryable')
        AND delivered_at IS NULL
        AND attempt_count < ?`
  ).bind(ts, ts, saleId, MAX_ATTEMPTS));
  return (result?.meta?.changes ?? result?.changes ?? 0) === 1;
}

async function currentOrder(env, saleId) {
  return execFirst(env.DB.prepare('SELECT sale_id, status, attempt_count, resend_count FROM orders WHERE sale_id = ?').bind(saleId));
}

async function enqueueFulfillment(env, saleId, fromStatuses = ['queue_pending']) {
  try {
    await env.FULFILLMENT_QUEUE.send({ sale_id: saleId });
    await markState(env, saleId, 'queued', { queued_at: nowIso(), last_error_code: null, last_error_at: null }, { from: fromStatuses });
    return true;
  } catch {
    await markState(env, saleId, 'enqueue_failed', { last_error_code: 'queue_send_failed', last_error_at: nowIso(), failed_at: nowIso() }, { from: fromStatuses });
    return false;
  }
}

async function incrementResend(env, saleId) {
  const ts = nowIso();
  const result = await execRun(env.DB.prepare(
    `UPDATE orders
      SET resend_count = resend_count + 1,
          resend_at = ?,
          updated_at = ?
      WHERE sale_id = ?
        AND resend_count < ?`
  ).bind(ts, ts, saleId, MAX_RESEND_ATTEMPTS));
  return (result?.meta?.changes ?? result?.changes ?? 0) === 1;
}

async function handleGumroadPing(request, env, url) {
  if (!env.DB || !env.FULFILLMENT_QUEUE) return json({ error: 'gateway misconfigured' }, 500);
  let saleId;
  try {
    await requirePingToken(url, env);
    ({ saleId } = await parsePing(request));
    const sale = await fetchVerifiedSale(env, saleId);
    const source = sourceFromSale(sale);
    const inserted = await insertOrder(env, saleId, source);
    if (!inserted) {
      const order = await currentOrder(env, saleId);
      if (['queue_pending', 'enqueue_failed'].includes(order?.status)) {
        const requeued = await enqueueFulfillment(env, saleId, ['queue_pending', 'enqueue_failed']);
        return requeued
          ? json({ ok: true, duplicate: true, requeued: true }, 202)
          : json({ error: 'queue unavailable', retryable: true }, 503);
      }
      return json({ ok: true, duplicate: true, status: order?.status || 'unknown' }, 200);
    }
    const queued = await enqueueFulfillment(env, saleId, ['queue_pending']);
    if (queued) return json({ ok: true, queued: true }, 202);
    return json({ error: 'queue unavailable', retryable: true }, 503);
  } catch (error) {
    if (saleId && env.DB) {
      await markState(env, saleId, 'rejected', { last_error_code: errorCode(error), last_error_at: nowIso(), failed_at: nowIso() }).catch(() => {});
    }
    return json({ error: errorCode(error) }, error.status || 400);
  }
}

async function generateReading(env, birth) {
  if (!env.SAJU_READING_WORKER?.fetch) {
    throw Object.assign(new Error('reading worker binding missing'), { code: 'reading_worker_missing', retryable: false });
  }
  const fulfillmentToken = configuredSecret(env.FULFILLMENT_READING_TOKEN);
  if (!fulfillmentToken) {
    throw Object.assign(new Error('fulfillment reading token missing'), { code: 'fulfillment_reading_token_missing', retryable: false });
  }

  const response = await env.SAJU_READING_WORKER.fetch(new Request('https://saju-reading.internal/fulfillment/reading', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${fulfillmentToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(birth),
  }));
  let data = null;
  try {
    data = await response.json();
  } catch {
    throw Object.assign(new Error('reading worker invalid response'), {
      code: 'reading_worker_invalid_json',
      retryable: response.status >= 500,
    });
  }
  if (!response.ok) {
    const upstreamError = isRecord(data?.error) ? data.error : {};
    throw Object.assign(new Error('reading worker failed'), {
      code: asString(upstreamError.code) || `reading_worker_${response.status}`,
      retryable: upstreamError.retryable === true || response.status >= 500 || response.status === 429,
    });
  }
  const reading = asString(data?.reading);
  validateReading(reading);
  return reading;
}

function validateReading(reading) {
  const words = reading.split(/\s+/).filter(Boolean).length;
  if (reading.length < 1200 || words < 160) throw Object.assign(new Error('reading too short'), { code: 'reading_too_short', retryable: false });
  if (/\b(?:lorem ipsum|placeholder|todo|insert reading|as an ai language model)\b/i.test(reading)) {
    throw Object.assign(new Error('reading placeholder'), { code: 'reading_placeholder', retryable: false });
  }
}

async function sendReadingEmail(env, saleId, to, reading) {
  if (!env.RESEND_API_KEY || !env.RESEND_FROM) throw Object.assign(new Error('Resend config missing'), { code: 'resend_config_missing', retryable: false });
  let response;
  try {
    response = await fetch(RESEND_API, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
        'Idempotency-Key': `saju-reading/${saleId}`,
      },
      body: JSON.stringify({
        from: env.RESEND_FROM,
        to,
        subject: 'Your Saju Deep Reading',
        text: `Thank you for your order.\n\n${reading}`,
      }),
    });
  } catch {
    throw Object.assign(new Error('Resend ambiguous'), { code: 'resend_ambiguous', ambiguousEmail: true });
  }
  if (response.ok) return;
  if (response.status === 409) return;
  if (response.status >= 500 || response.status === 429) {
    throw Object.assign(new Error('Resend ambiguous'), { code: `resend_${response.status}`, ambiguousEmail: true });
  }
  throw Object.assign(new Error('Resend rejected'), { code: `resend_${response.status}`, retryable: false });
}

async function processSale(env, saleId) {
  const claimed = await claimForProcessing(env, saleId);
  if (!claimed) return { skipped: true };

  try {
    const sale = await fetchVerifiedSale(env, saleId);
    const birth = parseBirthFields(sale);
    const email = buyerEmailFromSale(sale);
    await markState(env, saleId, 'processing', { prompted_at: nowIso() }, { from: ['processing'] });
    const reading = await generateReading(env, birth);
    await markState(env, saleId, 'processing', { anthropic_at: nowIso() }, { from: ['processing'] });
    const canSend = await incrementResend(env, saleId);
    if (!canSend) {
      await markState(env, saleId, 'email_blocked', { last_error_code: 'resend_bound_exceeded', last_error_at: nowIso(), failed_at: nowIso() }, { from: ['processing'] });
      return { blocked: true };
    }
    await sendReadingEmail(env, saleId, email, reading);
    await markState(env, saleId, 'delivered', { delivered_at: nowIso() }, { from: ['processing'] });
    return { delivered: true };
  } catch (error) {
    const code = errorCode(error);
    const order = await currentOrder(env, saleId);
    if (error.ambiguousEmail) {
      await markState(env, saleId, 'email_ambiguous', { last_error_code: code, last_error_at: nowIso(), failed_at: nowIso() }, { from: ['processing'] });
      return { ambiguousEmail: true };
    }
    const retryable = error.retryable !== false && (error.retryable === true || Number(order?.attempt_count || 0) < MAX_ATTEMPTS);
    await markState(env, saleId, retryable ? 'retryable' : 'failed', {
      last_error_code: code,
      last_error_at: nowIso(),
      failed_at: retryable ? undefined : nowIso(),
    }, { from: ['processing'] });
    if (retryable) throw error;
    return { failed: true };
  }
}

async function requireAdmin(request, env) {
  const expected = configuredValue(env.ADMIN_TOKEN);
  const authorization = request.headers.get('authorization') || '';
  const token = authorization.match(/^Bearer\s+(.+)$/i)?.[1] || '';
  if (!expected || expected.length < 32) throw Object.assign(new Error('admin disabled'), { status: 503, code: 'admin_disabled' });
  if (!(await tokenEquals(token, expected))) throw Object.assign(new Error('unauthorized'), { status: 401, code: 'unauthorized' });
}

async function handleAdminStatus(request, env) {
  try {
    await requireAdmin(request, env);
  } catch (error) {
    return json({ error: error.message }, error.status || 401);
  }
  if (!env.DB) return json({ error: 'admin unavailable' }, 503);
  const rows = await env.DB.prepare('SELECT status, source, COUNT(*) AS count FROM orders GROUP BY status, source ORDER BY status, source').all();
  const counts = {};
  for (const row of rows?.results || []) {
    const status = row.status || 'unknown';
    const source = row.source || 'unattributed';
    counts[status] = (counts[status] || 0) + Number(row.count || 0);
    counts[`${status}:source:${source}`] = Number(row.count || 0);
  }
  return json({ ok: true, counts });
}

async function handleGenerationCanary(request, env) {
  try {
    await requireAdmin(request, env);
  } catch (error) {
    return json({ error: error.message }, error.status || 401);
  }
  try {
    await generateReading(env, GENERATION_CANARY_BIRTH);
    return json({ ok: true });
  } catch (error) {
    return json({ ok: false, code: errorCode(error), retryable: error.retryable === true }, error.retryable === true ? 502 : 500);
  }
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (request.method === 'GET' && url.pathname === '/health') {
      return json({ ok: true });
    }
    if (request.method === 'POST' && url.pathname.startsWith('/gumroad/ping')) return handleGumroadPing(request, env, url);
    if (request.method === 'GET' && url.pathname === '/admin/status') return handleAdminStatus(request, env);
    if (['GET', 'POST'].includes(request.method) && url.pathname === '/admin/generation-canary') return handleGenerationCanary(request, env);
    return json({ error: 'not found' }, 404);
  },

  async queue(batch, env) {
    for (const message of batch.messages) {
      const saleId = asString(message.body?.sale_id);
      if (!saleId) continue;
      await processSale(env, saleId);
      message.ack?.();
    }
  },
};

export const internals = {
  fetchVerifiedSale,
  parseBirthFields,
  processSale,
  sourceFromSale,
  generateReading,
  validateReading,
};
