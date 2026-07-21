import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

import worker from '../workers/src/index.js';

const KST_DAY_1_MS = Date.parse('2026-07-15T14:59:59.000Z');
const KST_DAY_2_MS = Date.parse('2026-07-15T15:00:00.000Z');
const REGISTERED_SOURCES = Object.freeze([
  'indexnow_saju_vs_bazi_001',
  'reddit_chinesezodiac_001',
  'reddit_chineseastrology_001',
  'fivearts_001',
  'gumroad_discover_001',
  'threads_saju_ko_001',
  'threads_saju_ja_001',
  'threads_saju_en_001',
]);
const LONG_READING = Array.from({ length: 190 }, (_, index) => `Reading sentence ${index} explains a concrete Saju pattern with careful detail.`).join(' ');

class MemoryKV {
  constructor({ failPuts = 0 } = {}) {
    this.values = new Map();
    this.options = new Map();
    this.failPuts = failPuts;
    this.getCalls = 0;
    this.listCalls = 0;
  }

  async get(key) {
    this.getCalls += 1;
    return this.values.has(key) ? this.values.get(key) : null;
  }

  async put(key, value, options = {}) {
    if (this.failPuts > 0) {
      this.failPuts -= 1;
      throw new Error('injected put failure');
    }
    // Yield once so Promise.all duplicate deliveries actually interleave.
    await Promise.resolve();
    this.values.set(key, String(value));
    this.options.set(key, options);
  }

  async list({ prefix = '', limit = 1000, cursor } = {}) {
    this.listCalls += 1;
    const names = [...this.values.keys()].filter(key => key.startsWith(prefix)).sort();
    const offset = cursor ? Number(cursor) : 0;
    const page = names.slice(offset, offset + limit);
    const nextOffset = offset + page.length;
    const listComplete = nextOffset >= names.length;
    return {
      keys: page.map(name => ({ name })),
      list_complete: listComplete,
      ...(listComplete ? {} : { cursor: String(nextOffset) }),
    };
  }
}

function trackRequest(body, headers = {}) {
  return new Request('https://worker.test/track', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...headers },
    body: JSON.stringify(body),
  });
}

async function postTrack(env, body, headers = {}) {
  const response = await worker.fetch(trackRequest(body, headers), env);
  return { response, body: await response.json() };
}

function validPayload(overrides = {}) {
  const { extra, ...rest } = overrides;
  return {
    event: 'saju_reading_generated',
    lang: 'en',
    page: 'index',
    sessionId: 'sess_0123456789abcdef0123456789abcdef',
    extra: extra || {
      dayMaster: '甲',
      readingType: 'general',
      lang: 'en',
      source: 'reddit_chinesezodiac_001',
    },
    ...rest,
  };
}

async function readMetrics(env, date) {
  const response = await worker.fetch(new Request(`https://worker.test/metrics?date=${date}`, {
    headers: { 'x-admin-token': env.ADMIN_TOKEN },
  }), env);
  return { response, body: await response.json() };
}

function fulfillmentReadingRequest(body, headers = {}) {
  return new Request('https://worker.test/fulfillment/reading', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...headers },
    body: JSON.stringify(body),
  });
}

function validReadingInput(overrides = {}) {
  return {
    year: 1990,
    month: 12,
    day: 20,
    hour: 16,
    minute: 30,
    gender: 'female',
    language: 'en',
    readingType: 'career',
    ...overrides,
  };
}

async function withMockAnthropic(status, body, fn) {
  const originalFetch = globalThis.fetch;
  const calls = [];
  globalThis.fetch = async (url, options) => {
    calls.push({ url: String(url), options });
    return Response.json(body, { status });
  };
  try {
    return await fn(calls);
  } finally {
    globalThis.fetch = originalFetch;
  }
}

test('internal fulfillment reading endpoint requires bearer auth', async () => {
  const env = {
    ANTHROPIC_API_KEY: 'test-key',
    FULFILLMENT_READING_TOKEN: 'fulfillment-token-0123456789abcdef0123456789abcdef',
  };

  const missing = await worker.fetch(fulfillmentReadingRequest(validReadingInput()), env);
  assert.equal(missing.status, 401);
  assert.deepEqual(await missing.json(), { error: { code: 'unauthorized', retryable: false } });

  const wrong = await worker.fetch(fulfillmentReadingRequest(validReadingInput(), {
    Authorization: 'Bearer wrong-token',
  }), env);
  assert.equal(wrong.status, 401);
});

test('internal fulfillment reading endpoint fails closed for missing, short, or placeholder configured token', async () => {
  for (const token of [undefined, 'short-token', 'SET_AFTER_DEPLOY_PLACEHOLDER_1234567890']) {
    const env = {
      ANTHROPIC_API_KEY: 'test-key',
      ...(token === undefined ? {} : { FULFILLMENT_READING_TOKEN: token }),
    };
    const response = await worker.fetch(fulfillmentReadingRequest(validReadingInput(), {
      Authorization: `Bearer ${token || 'anything-long-enough-0123456789abcdef'}`,
    }), env);
    assert.equal(response.status, 503);
    assert.deepEqual(await response.json(), {
      error: { code: 'fulfillment_auth_unavailable', retryable: false },
    });
  }
});

test('internal fulfillment reading endpoint returns generated text without prompt or raw input', async () => {
  const env = {
    ANTHROPIC_API_KEY: 'test-key',
    FULFILLMENT_READING_TOKEN: 'fulfillment-token-0123456789abcdef0123456789abcdef',
  };

  await withMockAnthropic(200, { content: [{ text: LONG_READING }], usage: { input_tokens: 10, output_tokens: 1000 } }, async (calls) => {
    const response = await worker.fetch(fulfillmentReadingRequest(validReadingInput(), {
      Authorization: 'Bearer fulfillment-token-0123456789abcdef0123456789abcdef',
    }), env);
    assert.equal(response.status, 200);
    const body = await response.json();
    assert.equal(body.ok, true);
    assert.equal(body.reading, LONG_READING);
    assert.equal(body.language, 'en');
    assert.equal('saju' in body, false);
    assert.equal('prompt' in body, false);
    assert.equal(JSON.stringify(body).includes('199012201630'), false);
    assert.equal(calls[0].options.headers['x-api-key'], 'test-key');
  });
});

test('public health and generic 404 reveal no binding readiness or route inventory', async () => {
  const env = {
    ANTHROPIC_API_KEY: 'test-key',
    FULFILLMENT_READING_TOKEN: 'fulfillment-token-0123456789abcdef0123456789abcdef',
    ADMIN_TOKEN: 'admin',
  };

  const health = await worker.fetch(new Request('https://worker.test/health'), env);
  assert.equal(health.status, 200);
  assert.deepEqual(await health.json(), { ok: true });

  const missing = await worker.fetch(new Request('https://worker.test/missing'), env);
  assert.equal(missing.status, 404);
  assert.deepEqual(await missing.json(), { error: 'not found' });

  const source = readFileSync(new URL('../workers/src/index.js', import.meta.url), 'utf8');
  assert.doesNotMatch(source, /bindings:\s*\{/);
  assert.doesNotMatch(source, /routes:\s*\[/);
});

test('internal fulfillment reading endpoint reports Anthropic 429 and 500 as retryable machine errors', async () => {
  for (const status of [429, 500]) {
    const env = {
      ANTHROPIC_API_KEY: 'test-key',
      FULFILLMENT_READING_TOKEN: 'fulfillment-token-0123456789abcdef0123456789abcdef',
    };
    await withMockAnthropic(status, { error: { message: 'upstream' } }, async () => {
      const response = await worker.fetch(fulfillmentReadingRequest(validReadingInput(), {
        Authorization: 'Bearer fulfillment-token-0123456789abcdef0123456789abcdef',
      }), env);
      assert.equal(response.status, 502);
      assert.deepEqual(await response.json(), { error: { code: `anthropic_${status}`, retryable: true } });
    });
  }
});

test('concurrent duplicate deliveries converge to one deterministic TTL event key', async () => {
  const METRICS = new MemoryKV();
  const env = { METRICS, ADMIN_TOKEN: 'admin', __TEST_NOW_MS: KST_DAY_1_MS };
  const sessionId = validPayload().sessionId;
  const results = await Promise.all(
    Array.from({ length: 50 }, () => postTrack(env, validPayload())),
  );

  assert(results.every(result => result.response.status === 200));
  assert(results.every(result => result.body.dedupe === 'deterministic_key_convergence'));
  assert.equal(METRICS.getCalls, 0, 'ingestion must not do get-before-put');
  assert.equal(METRICS.values.size, 1);

  const [[key, value]] = METRICS.values.entries();
  assert.match(
    key,
    /^evt:v2:2026-07-15:reddit_chinesezodiac_001:reddit_chinesezodiac_001:saju_reading_generated:[a-f0-9]{64}$/,
  );
  assert.equal(METRICS.options.get(key).expirationTtl, 604800);
  assert.equal(key.includes(sessionId), false);
  assert.equal(value.includes(sessionId), false);
  assert.equal([...METRICS.values.keys()].some(name => /^(?:ct|raw|dedupe|uniq):/.test(name)), false);

  const record = JSON.parse(value);
  assert.equal(record.source, 'reddit_chinesezodiac_001');
  assert.equal(record.campaign, 'reddit_chinesezodiac_001');
  assert.equal('ip' in record, false);
  assert.equal('ua' in record, false);
  assert.equal('sessionId' in record, false);
});

test('a failed single write is retryable without leaving a dedupe poison marker', async () => {
  const METRICS = new MemoryKV({ failPuts: 1 });
  const env = { METRICS, __TEST_NOW_MS: KST_DAY_1_MS };

  const failed = await postTrack(env, validPayload());
  assert.equal(failed.response.status, 503);
  assert.deepEqual(failed.body, { error: 'metrics write failed', retryable: true });
  assert.equal(METRICS.values.size, 0);

  const retried = await postTrack(env, validPayload());
  assert.equal(retried.response.status, 200);
  assert.equal(METRICS.values.size, 1);
});

test('unknown events, fields, dimensions, PII-like values, and unregistered slugs fail closed', async () => {
  const cases = [
    validPayload({ event: 'mission_success' }),
    { ...validPayload(), email: 'owner@example.com' },
    validPayload({ extra: { ...validPayload().extra, arbitrary: 'anything' } }),
    validPayload({ extra: { ...validPayload().extra, source: 'alice_smith' } }),
    validPayload({ extra: { ...validPayload().extra, source: 'alice@example.com' } }),
    validPayload({ extra: { ...validPayload().extra, utm_campaign: 'reddit_chinesezodiac_001' } }),
    validPayload({ extra: { ...validPayload().extra, utm_term: 'alice%2540example.com' } }),
    validPayload({ sessionId: 'sess_19901220' }),
    validPayload({ page: 'profile/alice' }),
  ];

  for (const payload of cases) {
    const METRICS = new MemoryKV();
    const result = await postTrack({ METRICS }, payload);
    assert.equal(result.response.status, 400, JSON.stringify(result.body));
    assert.equal(METRICS.values.size, 0);
  }
});

test('direct events remain allowed while campaign is always derived server-side', async () => {
  const METRICS = new MemoryKV();
  const env = { METRICS, ADMIN_TOKEN: 'admin', __TEST_NOW_MS: KST_DAY_1_MS };
  const direct = validPayload({
    event: 'page_view',
    sessionId: `sess_${'a'.repeat(32)}`,
    extra: { lang: 'en' },
  });
  const registered = validPayload({
    sessionId: `sess_${'b'.repeat(32)}`,
  });

  assert.equal((await postTrack(env, direct)).response.status, 200);
  assert.equal((await postTrack(env, registered)).response.status, 200);
  const records = [...METRICS.values.values()].map(value => JSON.parse(value));
  assert(records.some(record => record.source === 'direct' && record.campaign === 'direct'));
  assert(records.some(record => record.source === 'reddit_chinesezodiac_001'
    && record.campaign === 'reddit_chinesezodiac_001'));
});

test('all registered campaign sources are accepted and bucketed server-side by exact source', async () => {
  const METRICS = new MemoryKV();
  const env = { METRICS, ADMIN_TOKEN: 'admin', __TEST_NOW_MS: KST_DAY_1_MS };

  for (const [index, source] of REGISTERED_SOURCES.entries()) {
    const sessionId = `sess_${'a'.repeat(31)}${index.toString(16)}`;
    const result = await postTrack(env, validPayload({ sessionId, extra: { source } }));
    assert.equal(result.response.status, 200, `${source}: ${JSON.stringify(result.body)}`);
  }

  const records = [...METRICS.values.values()].map(value => JSON.parse(value));
  for (const source of REGISTERED_SOURCES) {
    assert(records.some(record => record.source === source && record.campaign === source), source);
  }

  const { body } = await readMetrics(env, '2026-07-15');
  for (const source of REGISTERED_SOURCES) {
    assert.equal(body.counts[`saju_reading_generated:source:${source}`], 1, source);
    assert.equal(body.distinct[`saju_reading_generated:source:${source}:campaign:${source}`], 1, source);
  }
});

test('registered campaign sources reject spoofed variants and extra attribution fields', async () => {
  const cases = [
    { source: 'indexnow_saju_vs_bazi_001x' },
    { source: 'reddit_chineseastrology_001_copy' },
    { source: 'fivearts' },
    { source: 'gumroad-discover-001' },
    { source: 'threads_saju_en_001_copy' },
    { source: 'gumroad_discover_001', utm_campaign: 'gumroad_discover_001' },
    { source: 'fivearts_001', utm_source: 'fivearts' },
    { source: 'threads_saju_ja_001', utm_source: 'x' },
  ];

  for (const extra of cases) {
    const METRICS = new MemoryKV();
    const result = await postTrack({ METRICS }, validPayload({ extra }));
    assert.equal(result.response.status, 400, `${JSON.stringify(extra)} accepted`);
    assert.equal(METRICS.values.size, 0);
  }
});

test('event day keys switch exactly at the Asia/Seoul midnight boundary', async () => {
  const METRICS = new MemoryKV();
  await postTrack(
    { METRICS, __TEST_NOW_MS: KST_DAY_1_MS },
    validPayload({ sessionId: 'sess_3333333333333333cccccccccccccccc' }),
  );
  await postTrack(
    { METRICS, __TEST_NOW_MS: KST_DAY_2_MS },
    validPayload({ sessionId: 'sess_4444444444444444dddddddddddddddd' }),
  );

  const keys = [...METRICS.values.keys()].sort();
  assert.equal(keys.filter(key => key.startsWith('evt:v2:2026-07-15:')).length, 1);
  assert.equal(keys.filter(key => key.startsWith('evt:v2:2026-07-16:')).length, 1);
});

test('explicit local and automation exclusions write nothing; owner headers are not detection', async () => {
  const METRICS = new MemoryKV();
  const env = { METRICS, ADMIN_TOKEN: 'admin', __TEST_NOW_MS: KST_DAY_1_MS };

  const signaled = await postTrack(
    env,
    validPayload({ sessionId: 'sess_5555555555555555eeeeeeeeeeeeeeee' }),
    { 'x-saju-analytics-mode': 'exclude' },
  );
  assert.deepEqual(signaled.body, {
    ok: true,
    accepted: false,
    excluded: true,
    reason: 'signaled_exclusion',
    writes: 0,
  });

  const automated = await postTrack(
    env,
    validPayload({ sessionId: 'sess_6666666666666666ffffffffffffffff' }),
    { 'user-agent': 'Playwright/1.0' },
  );
  assert.equal(automated.body.reason, 'automation');
  assert.equal(METRICS.values.size, 0);

  const ownerHeaderOnly = await postTrack(
    env,
    validPayload({ sessionId: 'sess_7777777777777777aaaaaaaaaaaaaaaa' }),
    { 'x-saju-owner-token': 'admin' },
  );
  assert.equal(ownerHeaderOnly.body.accepted, true);
  assert.equal(METRICS.values.size, 1);
});

test('metrics follows KV pagination and aggregates only bounded dimensions', async () => {
  const METRICS = new MemoryKV();
  const env = {
    METRICS,
    ADMIN_TOKEN: 'admin',
    __TEST_NOW_MS: KST_DAY_1_MS,
    __TEST_METRICS_PAGE_SIZE: 2,
  };
  for (let index = 0; index < 5; index += 1) {
    const sessionId = `sess_page_${index.toString(16).padStart(32, '0')}`;
    const result = await postTrack(env, validPayload({ sessionId }));
    assert.equal(result.response.status, 200);
  }

  const { response, body } = await readMetrics(env, '2026-07-15');
  assert.equal(response.status, 200);
  assert.equal(METRICS.listCalls, 3);
  assert.equal(body.keysRead, 5);
  assert.equal(body.counts.saju_reading_generated, 5);
  assert.equal(body.counts['saju_reading_generated:source:reddit_chinesezodiac_001'], 5);
  assert.equal(
    body.distinct['saju_reading_generated:source:reddit_chinesezodiac_001:campaign:reddit_chinesezodiac_001'],
    5,
  );
  assert.equal(body.saturated, false);
  assert.equal(body.decisionQuality, 'directional-only');
  assert.equal(body.publicForgeryResistant, false);
});

test('1,001 forged sessions saturate the hard read cap and are not decision-quality', async () => {
  const METRICS = new MemoryKV();
  const env = { METRICS, ADMIN_TOKEN: 'admin', __TEST_NOW_MS: KST_DAY_1_MS };
  const deliveries = Array.from({ length: 1001 }, (_, index) => {
    const sessionId = `sess_forged_${index.toString(36).padStart(20, '0')}`;
    return postTrack(env, validPayload({ sessionId }));
  });
  const results = await Promise.all(deliveries);
  assert(results.every(result => result.response.status === 200));
  assert.equal(METRICS.values.size, 1001);

  const { body } = await readMetrics(env, '2026-07-15');
  assert.equal(body.keysRead, 1000);
  assert.equal(body.counts.saju_reading_generated, 1000);
  assert.equal(body.saturated, true);
  assert.equal(body.truncated, true);
  assert.equal(body.decisionQuality, 'not-decision-quality');
  assert.match(body.caveat, /partial and not decision-quality/i);
});

test('feedback stores no raw request/session metadata and expires after 30 days', async () => {
  const FEEDBACK = new MemoryKV();
  const env = {
    FEEDBACK,
    __TEST_NOW_MS: KST_DAY_1_MS,
    TELEGRAM_BOT_TOKEN: 'test-bot-token',
    TELEGRAM_CHAT_ID: 'test-chat-id',
  };
  const sessionId = 'sess_8888888888888888bbbbbbbbbbbbbbbb';
  let telegramRequest = null;
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async (url, options) => {
    telegramRequest = { url: String(url), options };
    return new Response(JSON.stringify({ ok: true }), { status: 200 });
  };
  let response;
  try {
    response = await worker.fetch(new Request('https://worker.test/feedback', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'cf-connecting-ip': '203.0.113.10',
        'cf-ipcountry': 'KR',
        'user-agent': 'Personal Browser/1.0',
      },
      body: JSON.stringify({
        rating: 5,
        text: 'Useful explanation',
        lang: 'en',
        page: 'index',
        sessionId,
      }),
    }), env);
  } finally {
    globalThis.fetch = originalFetch;
  }
  assert.equal(response.status, 200);
  assert.equal(FEEDBACK.values.size, 1);

  const [[key, raw]] = FEEDBACK.values.entries();
  assert.match(key, /^fb:2026-07-15:/);
  assert.equal(FEEDBACK.options.get(key).expirationTtl, 2592000);
  assert.equal(raw.includes(sessionId), false);
  assert.equal(raw.includes('203.0.113.10'), false);
  assert.equal(raw.includes('Personal Browser'), false);
  const record = JSON.parse(raw);
  assert.match(record.sessionHash, /^sha256:[a-f0-9]{64}$/);
  assert.equal('sessionId' in record, false);
  assert.equal('ip' in record, false);
  assert.equal('ua' in record, false);
  assert.equal('country' in record, false);

  assert(telegramRequest);
  const telegramBody = JSON.parse(telegramRequest.options.body);
  assert.deepEqual(Object.keys(telegramBody).sort(), ['chat_id', 'text']);
  assert.equal(telegramBody.text.includes(sessionId), false);
  assert.equal(telegramBody.text.includes('203.0.113.10'), false);
  assert.equal(telegramBody.text.includes('Personal Browser'), false);
});

test('feedback rejects obvious birth/contact identifiers before KV or Telegram', async () => {
  for (const text of ['email alice@example.com', 'born 1990-12-20', 'call +82 10 1234 5678']) {
    const FEEDBACK = new MemoryKV();
    const response = await worker.fetch(new Request('https://worker.test/feedback', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ rating: 4, text, lang: 'en', page: 'index' }),
    }), { FEEDBACK });
    assert.equal(response.status, 400);
    assert.equal(FEEDBACK.values.size, 0);
  }
});

test('browser source exposes the signaled exclusion switch and privacy warning', () => {
  const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
  assert.match(html, /SAJU_ANALYTICS_MODE === 'exclude'/);
  assert.match(html, /localStorage\.getItem\('saju\.analytics\.mode'\) === 'exclude'/);
  assert.match(html, /Do not include birth details, email, phone, or other contact information\./);
  assert.doesNotMatch(html, /Math\.random\(\).*saju\.sess/);
});

test('browser source preserves wealth focus on URL round trip', () => {
  const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
  assert.match(html, /READING_TYPE_CODE = \{ general: 'g', career: 'c', love: 'l', wealth: 'w' \}/);
  assert.match(html, /READING_TYPE_DECODE = \{ g: 'general', c: 'career', l: 'love', w: 'wealth' \}/);
});

test('browser feedback UI only marks submitted after a 2xx response', () => {
  const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
  assert.match(html, /if \(!res\.ok\) throw new Error\(`feedback failed: \$\{res\.status\}`\);/);
  assert.match(html, /localStorage\.setItem\('saju\.fb\.submitted', '1'\)/);
  assert(html.indexOf('if (!res.ok)') < html.indexOf("localStorage.setItem('saju.fb.submitted', '1')"));
  assert.match(html, /thanksEl\.textContent = i\.retry;/);
  assert.match(html, /submitBtn\.disabled = false;/);
});
