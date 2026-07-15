import assert from 'node:assert/strict';
import test from 'node:test';

import {
  appendAttributionToUrl,
  attributionSource,
  mergeAttribution,
  normalizeAttributionValue,
  sanitizeAttribution,
} from '../src/attribution.js';
import worker from '../workers/src/index.js';

class MemoryKV {
  constructor() {
    this.values = new Map();
  }

  async get(key) {
    return this.values.has(key) ? this.values.get(key) : null;
  }

  async put(key, value) {
    this.values.set(key, String(value));
  }

  async list({ prefix = '', limit = 1000 } = {}) {
    const keys = [...this.values.keys()]
      .filter(key => key.startsWith(prefix))
      .sort()
      .slice(0, limit)
      .map(name => ({ name }));
    return { keys, list_complete: true };
  }
}

test('landing attribution is whitelisted, normalized, bounded, and PII-free', () => {
  const safe = sanitizeAttribution(
    '?source=reddit_chinesezodiac_001' +
    '&utm_source=Reddit&utm_medium=Organic+Social&utm_campaign=Korean+Saju+Beta' +
    '&utm_content=Post+A&utm_term=alice%40example.com' +
    '&email=alice%40example.com&gclid=arbitrary-click-id',
  );

  assert.deepEqual(safe, {
    source: 'reddit_chinesezodiac_001',
    utm_source: 'reddit',
    utm_medium: 'organic-social',
    utm_campaign: 'korean-saju-beta',
    utm_content: 'post-a',
  });
  assert.equal('email' in safe, false);
  assert.equal('gclid' in safe, false);
  assert.equal(normalizeAttributionValue('+82 10 1234 5678'), null);
  assert.equal(normalizeAttributionValue('x'.repeat(100), 12), 'xxxxxxxxxxxx');
});

test('event fields persist while attribution fields are revalidated', () => {
  const merged = mergeAttribution(
    { product: 'deep', hasBirth: false, source: 'alice@example.com', utm_term: '+1 555 123 4567' },
    { source: 'reddit_chinesezodiac_001', utm_campaign: 'Saju vs BaZi' },
  );

  assert.deepEqual(merged, {
    product: 'deep',
    hasBirth: false,
    source: 'reddit_chinesezodiac_001',
    utm_campaign: 'saju-vs-bazi',
  });
  assert.equal(attributionSource(merged), 'reddit_chinesezodiac_001');
});

test('checkout propagation preserves existing product parameters and hash', () => {
  const checkout = appendAttributionToUrl(
    'https://hcompany.gumroad.com/l/reading?affiliate=partner&birth=199012201630#buy',
    {
      source: 'reddit_chinesezodiac_001',
      utm_source: 'Reddit',
      utm_medium: 'Organic Social',
      ignored: 'must-not-cross',
    },
  );
  const url = new URL(checkout);

  assert.equal(url.searchParams.get('affiliate'), 'partner');
  assert.equal(url.searchParams.get('birth'), '199012201630');
  assert.equal(url.searchParams.get('source'), 'reddit_chinesezodiac_001');
  assert.equal(url.searchParams.get('utm_source'), 'reddit');
  assert.equal(url.searchParams.get('utm_medium'), 'organic-social');
  assert.equal(url.searchParams.has('ignored'), false);
  assert.equal(url.hash, '#buy');
});

test('Worker persists safe raw extra and exposes source-scoped metrics', async () => {
  const METRICS = new MemoryKV();
  const env = { METRICS, ADMIN_TOKEN: 'test-admin' };
  const date = new Date().toISOString().slice(0, 10);

  const tracked = await worker.fetch(new Request('https://worker.test/track', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      event: 'saju_paid_click',
      lang: 'en',
      page: 'index',
      sessionId: 'sess_test',
      extra: {
        product: 'deep',
        hasBirth: true,
        source: 'reddit_chinesezodiac_001',
        utm_medium: 'Organic Social',
        utm_term: 'alice@example.com',
      },
    }),
  }), env);
  assert.equal(tracked.status, 200);

  const rawKeys = (await METRICS.list({ prefix: `raw:${date}:` })).keys;
  assert.equal(rawKeys.length, 1);
  const raw = JSON.parse(await METRICS.get(rawKeys[0].name));
  assert.deepEqual(raw.extra, {
    product: 'deep',
    hasBirth: true,
    source: 'reddit_chinesezodiac_001',
    utm_medium: 'organic-social',
  });

  const metrics = await worker.fetch(new Request(
    `https://worker.test/metrics?date=${date}`,
    { headers: { 'x-admin-token': 'test-admin' } },
  ), env);
  assert.equal(metrics.status, 200);
  const body = await metrics.json();
  assert.equal(body.counts['saju_paid_click'], 1);
  assert.equal(body.counts['saju_paid_click:source:reddit_chinesezodiac_001'], 1);
});

test('direct and invalid-source events do not create a source bucket', async () => {
  const METRICS = new MemoryKV();
  const env = { METRICS, ADMIN_TOKEN: 'test-admin' };
  const date = new Date().toISOString().slice(0, 10);

  for (const [event, extra] of [
    ['direct_view', { pageKind: 'landing' }],
    ['invalid_source_view', { pageKind: 'landing', source: 'alice@example.com' }],
  ]) {
    const response = await worker.fetch(new Request('https://worker.test/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ event, extra }),
    }), env);
    assert.equal(response.status, 200);
  }

  const metrics = await worker.fetch(new Request(
    `https://worker.test/metrics?date=${date}`,
    { headers: { 'x-admin-token': 'test-admin' } },
  ), env);
  const { counts } = await metrics.json();
  assert.equal(counts.direct_view, 1);
  assert.equal(counts.invalid_source_view, 1);
  assert.equal(Object.keys(counts).some(key => key.includes(':source:')), false);

  const rawKeys = (await METRICS.list({ prefix: `raw:${date}:` })).keys;
  const rawEvents = await Promise.all(rawKeys.map(async ({ name }) => JSON.parse(await METRICS.get(name))));
  const invalid = rawEvents.find(item => item.event === 'invalid_source_view');
  assert.deepEqual(invalid.extra, { pageKind: 'landing' });
});
