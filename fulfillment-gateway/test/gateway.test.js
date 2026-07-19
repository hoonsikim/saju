import test from 'node:test';
import assert from 'node:assert/strict';

import worker, { internals } from '../src/index.js';

const VALID_SALE_ID = 'sale_123';
const LONG_READING = Array.from({ length: 190 }, (_, index) => `Reading sentence ${index} explains a concrete Saju pattern with careful detail.`).join(' ');

function validSale(overrides = {}) {
  return {
    id: VALID_SALE_ID,
    seller_id: 'fj-2-s19frzPz_yWhLMEoQ==',
    product_id: 'rVcTCMwSjj3looPJR-caoQ==',
    price_cents: 700,
    currency: 'usd',
    quantity: 1,
    paid: true,
    test: false,
    refunded: false,
    partially_refunded: false,
    chargedback: false,
    disputed: false,
    email: 'buyer@example.com',
    url_params: {
      birth: '199012201630',
      gender: 'female',
      lang: 'en',
      readingType: 'career',
      source: 'reddit_chineseastrology_001',
    },
    ...overrides,
  };
}

class MockStatement {
  constructor(db, sql) {
    this.db = db;
    this.sql = sql.replace(/\s+/g, ' ').trim();
    this.args = [];
  }

  bind(...args) {
    this.args = args;
    return this;
  }

  async run() {
    const sql = this.sql;
    if (sql.startsWith('INSERT OR IGNORE INTO orders')) {
      const [saleId, source, createdAt, updatedAt] = this.args;
      if (this.db.rows.has(saleId)) return { meta: { changes: 0 } };
      this.db.rows.set(saleId, {
        sale_id: saleId,
        status: 'queue_pending',
        source,
        attempt_count: 0,
        resend_count: 0,
        created_at: createdAt,
        updated_at: updatedAt,
        queued_at: null,
      });
      return { meta: { changes: 1 } };
    }

    if (sql.startsWith("UPDATE orders SET status = 'processing',")) {
      const [processingStartedAt, updatedAt, saleId, maxAttempts] = this.args;
      const row = this.db.rows.get(saleId);
      if (!row || !['queued', 'retryable'].includes(row.status) || row.delivered_at || row.attempt_count >= maxAttempts) {
        return { meta: { changes: 0 } };
      }
      row.status = 'processing';
      row.attempt_count += 1;
      row.processing_started_at = processingStartedAt;
      row.updated_at = updatedAt;
      return { meta: { changes: 1 } };
    }

    if (sql.startsWith('UPDATE orders SET resend_count = resend_count + 1')) {
      const [resendAt, updatedAt, saleId, maxResend] = this.args;
      const row = this.db.rows.get(saleId);
      if (!row || row.resend_count >= maxResend) return { meta: { changes: 0 } };
      row.resend_count += 1;
      row.resend_at = resendAt;
      row.updated_at = updatedAt;
      return { meta: { changes: 1 } };
    }

    if (sql.startsWith('UPDATE orders SET status = ?')) {
      const assignmentText = sql.match(/SET (.*) WHERE sale_id = \?/)[1];
      const assignments = assignmentText.split(',').map((part) => part.trim().split(' = ')[0]);
      const saleId = this.args[assignments.length];
      const row = this.db.rows.get(saleId);
      if (!row) return { meta: { changes: 0 } };
      if (sql.includes('AND status IN')) {
        const fromStatuses = this.args.slice(assignments.length + 1);
        if (!fromStatuses.includes(row.status)) return { meta: { changes: 0 } };
      }
      assignments.forEach((field, index) => {
        row[field] = this.args[index];
      });
      return { meta: { changes: 1 } };
    }

    throw new Error(`Unhandled run SQL: ${sql}`);
  }

  async first() {
    if (this.sql.startsWith('SELECT sale_id, status, attempt_count, resend_count FROM orders')) {
      return this.db.rows.get(this.args[0]) || null;
    }
    throw new Error(`Unhandled first SQL: ${this.sql}`);
  }

  async all() {
    if (!this.sql.startsWith('SELECT status, source, COUNT(*) AS count FROM orders')) {
      throw new Error(`Unhandled all SQL: ${this.sql}`);
    }
    const grouped = new Map();
    for (const row of this.db.rows.values()) {
      const key = `${row.status}\u0000${row.source || ''}`;
      grouped.set(key, (grouped.get(key) || 0) + 1);
    }
    return {
      results: [...grouped.entries()].map(([key, count]) => {
        const [status, source] = key.split('\u0000');
        return { status, source: source || null, count };
      }),
    };
  }
}

class MockDB {
  constructor() {
    this.rows = new Map();
  }

  prepare(sql) {
    return new MockStatement(this, sql);
  }
}

class MockQueue {
  constructor({ failOnce = false } = {}) {
    this.messages = [];
    this.failOnce = failOnce;
  }

  async send(message) {
    if (this.failOnce) {
      this.failOnce = false;
      throw new Error('queue unavailable');
    }
    this.messages.push(message);
  }
}

class MockReadingWorker {
  constructor({ response = Response.json({ ok: true, reading: LONG_READING }), assertRequest } = {}) {
    this.response = response;
    this.assertRequest = assertRequest;
    this.calls = [];
  }

  async fetch(request) {
    this.calls.push(request);
    await this.assertRequest?.(request);
    return this.response;
  }
}

function makeEnv({ sale = validSale(), fetchImpl, queue = new MockQueue(), db = new MockDB(), readingWorker = new MockReadingWorker() } = {}) {
  const calls = [];
  globalThis.fetch = async (url, init = {}) => {
    calls.push({ url: String(url), init });
    if (fetchImpl) return fetchImpl(String(url), init, calls);
    if (String(url).includes('/v2/sales/')) return Response.json({ success: true, sale });
    if (String(url) === 'https://api.resend.com/emails') {
      return Response.json({ id: 'email_123' });
    }
    throw new Error(`Unhandled fetch: ${url}`);
  };
  return {
    env: {
      DB: db,
      FULFILLMENT_QUEUE: queue,
      GUMROAD_ACCESS_TOKEN: 'gumroad-token',
      SAJU_READING_WORKER: readingWorker,
      FULFILLMENT_READING_TOKEN: 'fulfillment-token-0123456789abcdef0123456789abcdef',
      RESEND_API_KEY: 'resend-key',
      RESEND_FROM: 'Saju <readings@example.com>',
      ADMIN_TOKEN: 'admin-token-0123456789abcdef0123456789abcdef',
      PING_TOKEN: 'ping-token-0123456789abcdef0123456789abcdef',
      EXPECTED_GUMROAD_SELLER_ID: 'fj-2-s19frzPz_yWhLMEoQ==',
      EXPECTED_GUMROAD_PRODUCT_ID: 'rVcTCMwSjj3looPJR-caoQ==',
    },
    db,
    queue,
    readingWorker,
    calls,
  };
}

async function postPing(env, body = 'sale_id=sale_123&email=attacker@example.com&birth=190001010000') {
  return worker.fetch(new Request('https://gateway.test/gumroad/ping/ping-token-0123456789abcdef0123456789abcdef', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
  }), env);
}

test('genuine Gumroad ping verifies sale, stores non-PII state, and queues sale_id only', async () => {
  const { env, db, queue, calls } = makeEnv();
  const response = await postPing(env);
  assert.equal(response.status, 202);
  assert.deepEqual(queue.messages, [{ sale_id: VALID_SALE_ID }]);
  assert.equal(calls[0].init.headers.Authorization, 'Bearer gumroad-token');

  const row = db.rows.get(VALID_SALE_ID);
  assert.equal(row.status, 'queued');
  assert.equal(row.source, 'reddit_chineseastrology_001');
  assert(!JSON.stringify(row).includes('buyer@example.com'));
  assert(!JSON.stringify(row).includes('199012201630'));
  assert(!JSON.stringify(row).includes('attacker@example.com'));
});

test('sale verification rejects refund, test, wrong price, and wrong product without queueing', async () => {
  const cases = [
    ['refund', { refunded: true }, 'refunded'],
    ['test', { test: true }, 'test_sale'],
    ['unpaid', { paid: false }, 'sale_not_paid'],
    ['sale-id', { id: 'other_sale' }, 'sale_id_mismatch'],
    ['price', { price_cents: 600 }, 'price_mismatch'],
    ['product', { product_id: 'wrong' }, 'product_mismatch'],
  ];

  for (const [name, overrides, code] of cases) {
    const { env, queue } = makeEnv({ sale: validSale({ id: `sale_${name}`, ...overrides }) });
    const response = await postPing(env, `sale_id=sale_${name}`);
    assert.equal(response.status, 400, name);
    assert.match(await response.text(), new RegExp(code), name);
    assert.equal(queue.messages.length, 0, name);
  }
});

test('unknown source is accepted as unattributed null', async () => {
  const sale = validSale({ url_params: { ...validSale().url_params, source: 'unknown_source' } });
  const { env, db } = makeEnv({ sale });
  const response = await postPing(env);
  assert.equal(response.status, 202);
  assert.equal(db.rows.get(VALID_SALE_ID).source, null);
});

test('duplicate and concurrent pings claim once and enqueue once', async () => {
  const { env, queue } = makeEnv();
  const [first, second, third] = await Promise.all([postPing(env), postPing(env), postPing(env)]);
  assert.equal([first.status, second.status, third.status].filter((status) => status === 202).length, 1);
  assert.equal(queue.messages.length, 1);
});

test('queue send failure is recoverable by a later duplicate Gumroad ping', async () => {
  const queue = new MockQueue({ failOnce: true });
  const { env, db } = makeEnv({ queue });

  const failed = await postPing(env);
  assert.equal(failed.status, 503);
  assert.equal(db.rows.get(VALID_SALE_ID).status, 'enqueue_failed');
  assert.equal(queue.messages.length, 0);

  const recovered = await postPing(env);
  assert.equal(recovered.status, 202);
  assert.deepEqual(await recovered.json(), { ok: true, duplicate: true, requeued: true });
  assert.equal(db.rows.get(VALID_SALE_ID).status, 'queued');
  assert.deepEqual(queue.messages, [{ sale_id: VALID_SALE_ID }]);
});

test('consumer refetches sale, calls bound reading worker, then sends Resend idempotently', async () => {
  const readingWorker = new MockReadingWorker({
    assertRequest: async (request) => {
      assert.equal(request.url, 'https://saju-reading.internal/fulfillment/reading');
      assert.equal(request.headers.get('Authorization'), 'Bearer fulfillment-token-0123456789abcdef0123456789abcdef');
    },
  });
  const { env, db, calls } = makeEnv({ readingWorker });
  await postPing(env);
  await worker.queue({ messages: [{ body: { sale_id: VALID_SALE_ID }, ack() {} }] }, env);

  const row = db.rows.get(VALID_SALE_ID);
  assert.equal(row.status, 'delivered');
  assert.equal(row.attempt_count, 1);
  assert.equal(row.resend_count, 1);
  assert(row.prompted_at);
  assert(row.anthropic_at);
  assert(row.delivered_at);

  assert.equal(readingWorker.calls.length, 1);
  assert.deepEqual(await readingWorker.calls[0].json(), {
    year: 1990,
    month: 12,
    day: 20,
    hour: 16,
    minute: 30,
    gender: 'female',
    language: 'en',
    readingType: 'career',
  });

  const resendCall = calls.find((call) => call.url === 'https://api.resend.com/emails');
  assert.equal(resendCall.init.headers['Idempotency-Key'], 'saju-reading/sale_123');
  assert.equal(JSON.parse(resendCall.init.body).to, 'buyer@example.com');
});

test('concurrent processing claim permits one delivery attempt', async () => {
  const { env, db, calls } = makeEnv();
  await postPing(env);
  await Promise.allSettled([
    internals.processSale(env, VALID_SALE_ID),
    internals.processSale(env, VALID_SALE_ID),
  ]);

  assert.equal(db.rows.get(VALID_SALE_ID).status, 'delivered');
  assert.equal(calls.filter((call) => call.url === 'https://api.resend.com/emails').length, 1);
});

test('retryable reading worker failure marks retryable and does not send email', async () => {
  const readingWorker = new MockReadingWorker({
    response: Response.json({ error: { code: 'anthropic_500', retryable: true } }, { status: 500 }),
  });
  const { env, db, calls } = makeEnv({
    readingWorker,
    fetchImpl: async (url) => {
      if (url.includes('/v2/sales/')) return Response.json({ success: true, sale: validSale() });
      throw new Error(`Unhandled fetch: ${url}`);
    },
  });
  await postPing(env);
  await assert.rejects(() => internals.processSale(env, VALID_SALE_ID), /reading worker failed/);

  const row = db.rows.get(VALID_SALE_ID);
  assert.equal(row.status, 'retryable');
  assert.equal(row.last_error_code, 'anthropic_500');
  assert.equal(calls.filter((call) => call.url === 'https://api.resend.com/emails').length, 0);
});

test('missing, short, or placeholder fulfillment reading token fails closed before service binding and email', async () => {
  for (const token of [undefined, 'short-token', 'SET_AFTER_DEPLOY_PLACEHOLDER_1234567890']) {
    const readingWorker = new MockReadingWorker();
    const { env, db, calls } = makeEnv({ readingWorker });
    if (token === undefined) delete env.FULFILLMENT_READING_TOKEN;
    else env.FULFILLMENT_READING_TOKEN = token;

    await postPing(env);
    const result = await internals.processSale(env, VALID_SALE_ID);
    assert.deepEqual(result, { failed: true });
    assert.equal(db.rows.get(VALID_SALE_ID).status, 'failed');
    assert.equal(db.rows.get(VALID_SALE_ID).last_error_code, 'fulfillment_reading_token_missing');
    assert.equal(readingWorker.calls.length, 0);
    assert.equal(calls.filter((call) => call.url === 'https://api.resend.com/emails').length, 0);
  }
});

test('429 reading worker failure is retryable and sends no email', async () => {
  const readingWorker = new MockReadingWorker({
    response: Response.json({ error: { code: 'anthropic_429', retryable: true } }, { status: 429 }),
  });
  const { env, db, calls } = makeEnv({ readingWorker });
  await postPing(env);
  await assert.rejects(() => internals.processSale(env, VALID_SALE_ID), /reading worker failed/);

  const row = db.rows.get(VALID_SALE_ID);
  assert.equal(row.status, 'retryable');
  assert.equal(row.last_error_code, 'anthropic_429');
  assert.equal(calls.filter((call) => call.url === 'https://api.resend.com/emails').length, 0);
});

test('malformed or short reading worker success fails closed and sends no email', async () => {
  for (const response of [
    Response.json({ ok: true, reading: '' }),
    Response.json({ ok: true, reading: 'placeholder' }),
    new Response('not-json', { status: 200 }),
  ]) {
    const readingWorker = new MockReadingWorker({ response });
    const { env, db, calls } = makeEnv({ readingWorker });
    await postPing(env);
    const result = await internals.processSale(env, VALID_SALE_ID);
    assert.deepEqual(result, { failed: true });
    assert.equal(db.rows.get(VALID_SALE_ID).status, 'failed');
    assert.equal(calls.filter((call) => call.url === 'https://api.resend.com/emails').length, 0);
  }
});

test('ambiguous Resend outcome stops bounded resend loop without throwing for queue retry', async () => {
  const { env, db, calls } = makeEnv({
    fetchImpl: async (url) => {
      if (url.includes('/v2/sales/')) return Response.json({ success: true, sale: validSale() });
      if (url === 'https://api.resend.com/emails') throw new Error('network uncertain');
      throw new Error(`Unhandled fetch: ${url}`);
    },
  });
  await postPing(env);
  const result = await internals.processSale(env, VALID_SALE_ID);
  assert.deepEqual(result, { ambiguousEmail: true });

  const row = db.rows.get(VALID_SALE_ID);
  assert.equal(row.status, 'email_ambiguous');
  assert.equal(row.resend_count, 1);
  assert.equal(row.last_error_code, 'resend_ambiguous');

  const skipped = await internals.processSale(env, VALID_SALE_ID);
  assert.deepEqual(skipped, { skipped: true });
  assert.equal(calls.filter((call) => call.url === 'https://api.resend.com/emails').length, 1);
});

test('admin status is authenticated and PII-free', async () => {
  const { env } = makeEnv();
  await postPing(env);

  const unauthorized = await worker.fetch(new Request('https://gateway.test/admin/status'), env);
  assert.equal(unauthorized.status, 401);

  const queryToken = await worker.fetch(new Request('https://gateway.test/admin/status?token=admin-token-0123456789abcdef0123456789abcdef'), env);
  assert.equal(queryToken.status, 401);

  const response = await worker.fetch(new Request('https://gateway.test/admin/status', {
    headers: { Authorization: 'Bearer admin-token-0123456789abcdef0123456789abcdef' },
  }), env);
  assert.equal(response.status, 200);
  const body = await response.json();
  assert.equal(body.counts.queued, 1);
  const serialized = JSON.stringify(body);
  assert(!serialized.includes('buyer@example.com'));
  assert(!serialized.includes('199012201630'));
  assert(!serialized.includes(VALID_SALE_ID));
});

test('generation canary is admin-only and returns no reading or raw input', async () => {
  const { env, readingWorker } = makeEnv();

  const unauthorized = await worker.fetch(new Request('https://gateway.test/admin/generation-canary'), env);
  assert.equal(unauthorized.status, 401);

  const response = await worker.fetch(new Request('https://gateway.test/admin/generation-canary', {
    headers: { Authorization: 'Bearer admin-token-0123456789abcdef0123456789abcdef' },
  }), env);
  assert.equal(response.status, 200);
  const body = await response.json();
  assert.deepEqual(body, { ok: true });
  assert.equal(readingWorker.calls.length, 1);

  const serialized = JSON.stringify(await readingWorker.calls[0].json());
  assert(serialized.includes('1990'));
  const responseBody = JSON.stringify(body);
  assert.equal(responseBody.includes(LONG_READING.slice(0, 20)), false);
  assert.equal(responseBody.includes('1990'), false);
});

test('generation canary redacts retryable reading worker errors', async () => {
  const { env } = makeEnv({
    readingWorker: new MockReadingWorker({
      response: Response.json({
        error: {
          code: 'anthropic_500',
          retryable: true,
          rawInput: '199012201630',
          reading: LONG_READING,
        },
      }, { status: 500 }),
    }),
  });
  const response = await worker.fetch(new Request('https://gateway.test/admin/generation-canary', {
    method: 'POST',
    headers: { Authorization: 'Bearer admin-token-0123456789abcdef0123456789abcdef' },
  }), env);
  assert.equal(response.status, 502);
  assert.deepEqual(await response.json(), { ok: false, code: 'anthropic_500', retryable: true });
});

test('ping path token blocks unauthenticated API amplification and health reveals no config', async () => {
  const { env, calls } = makeEnv();
  const missingToken = await worker.fetch(new Request('https://gateway.test/gumroad/ping', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: 'sale_id=sale_123',
  }), env);
  assert.equal(missingToken.status, 404);
  assert.equal(calls.length, 0);

  const wrongToken = await worker.fetch(new Request('https://gateway.test/gumroad/ping/wrong-token-0123456789abcdef0123456789abcdef', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: 'sale_id=sale_123',
  }), env);
  assert.equal(wrongToken.status, 404);
  assert.equal(calls.length, 0);

  const health = await worker.fetch(new Request('https://gateway.test/health'), env);
  assert.deepEqual(await health.json(), { ok: true });
});

test('parser fails closed for missing authenticated checkout field shapes and rejects placeholder readings', () => {
  assert.throws(() => internals.parseBirthFields(validSale({ url_params: undefined, custom_fields: undefined })), /birth missing/);
  assert.throws(() => internals.validateReading('placeholder'), /reading too short|reading placeholder/);
});
