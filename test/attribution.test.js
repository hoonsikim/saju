import assert from 'node:assert/strict';
import test from 'node:test';

import {
  ATTRIBUTION_REGISTRY,
  appendAttributionToUrl,
  attributionSource,
  createAnalyticsSessionId,
  createAnalyticsSessionProvider,
  mergeAttribution,
  normalizeAttributionValue,
  sanitizeAttribution,
  validateRegisteredAttribution,
} from '../src/attribution.js';

const REGISTERED_SOURCES = Object.freeze({
  indexnow_saju_vs_bazi_001: {
    utm_source: 'indexnow',
    utm_medium: 'organic-search',
    utm_campaign: 'indexnow_saju_vs_bazi_001',
  },
  reddit_chinesezodiac_001: {
    utm_source: 'reddit',
    utm_medium: 'organic-social',
    utm_campaign: 'reddit_chinesezodiac_001',
  },
  reddit_chineseastrology_001: {
    utm_source: 'reddit',
    utm_medium: 'organic-social',
    utm_campaign: 'reddit_chineseastrology_001',
  },
  fivearts_001: {
    utm_source: 'fivearts',
    utm_medium: 'forum',
    utm_campaign: 'fivearts_001',
  },
  gumroad_discover_001: {
    utm_source: 'gumroad',
    utm_medium: 'marketplace',
    utm_campaign: 'gumroad_discover_001',
  },
});

test('analytics attribution accepts only the exact registered sources and fixed aliases', () => {
  assert.deepEqual(Object.keys(ATTRIBUTION_REGISTRY).sort(), Object.keys(REGISTERED_SOURCES).sort());

  for (const [source, aliases] of Object.entries(REGISTERED_SOURCES)) {
    const safe = sanitizeAttribution(`?source=${source}`);
    assert.deepEqual(safe, { source });
    assert.equal(attributionSource(safe), source);

    const withAliases = sanitizeAttribution(new URLSearchParams({ source, ...aliases }));
    assert.deepEqual(withAliases, { source });
  }

  assert.deepEqual(sanitizeAttribution('?source=unknown_campaign_001'), {});
  assert.deepEqual(sanitizeAttribution('?source=alice_smith'), {});
  assert.deepEqual(sanitizeAttribution('?source=alice%40example.com'), {});
  assert.deepEqual(sanitizeAttribution('?source=reddit_chinesezodiac_001&utm_content=post-a'), {});
  assert.deepEqual(sanitizeAttribution('?source=reddit_chinesezodiac_001&utm_medium=paid'), {});
  assert.deepEqual(sanitizeAttribution('?source=reddit_chineseastrology_001&utm_campaign=reddit_chinesezodiac_001'), {});
  assert.deepEqual(sanitizeAttribution('?source=indexnow_saju_vs_bazi_001&utm_source=reddit'), {});
  assert.equal(
    validateRegisteredAttribution({ utm_campaign: 'reddit_chinesezodiac_001' }).error,
    'registered source is required for attribution',
  );
  assert.equal(normalizeAttributionValue('+82 10 1234 5678'), null);
});

test('event merge deletes caller attribution and reintroduces only registered source', () => {
  const merged = mergeAttribution(
    {
      product: 'deep',
      hasBirth: false,
      source: 'alice@example.com',
      utm_term: '+1 555 123 4567',
    },
    {
      source: 'reddit_chinesezodiac_001',
      utm_campaign: 'reddit_chinesezodiac_001',
    },
  );

  assert.deepEqual(merged, {
    product: 'deep',
    hasBirth: false,
    source: 'reddit_chinesezodiac_001',
  });
});

test('checkout propagation stays bounded and strips direct identifiers', () => {
  const checkout = appendAttributionToUrl(
    'https://hcompany.gumroad.com/l/reading?affiliate=partner#buy',
    {
      source: 'reddit_chineseastrology_001',
      email: 'must-not-cross@example.com',
    },
  );
  const url = new URL(checkout);

  assert.equal(url.searchParams.get('affiliate'), 'partner');
  assert.equal(url.searchParams.get('source'), 'reddit_chineseastrology_001');
  assert.equal(url.searchParams.get('utm_source'), 'reddit');
  assert.equal(url.searchParams.get('utm_medium'), 'organic-social');
  assert.equal(url.searchParams.get('utm_campaign'), 'reddit_chineseastrology_001');
  assert.equal(url.searchParams.has('email'), false);
  assert.equal(url.searchParams.has('utm_term'), false);
  assert.equal(url.hash, '#buy');
});

test('checkout propagation rejects unregistered or spoofed attribution instead of partial propagation', () => {
  for (const attribution of [
    { source: 'reddit' },
    { source: 'reddit_chineseastrology_001', utm_campaign: 'reddit_chinesezodiac_001' },
    { source: 'fivearts_001', utm_medium: 'organic-social' },
    { source: 'gumroad_discover_001', utm_content: 'banner-a' },
  ]) {
    const checkout = new URL(appendAttributionToUrl('https://hcompany.gumroad.com/l/reading?affiliate=partner', attribution));
    assert.equal(checkout.searchParams.get('affiliate'), 'partner');
    for (const key of ['source', 'utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term']) {
      assert.equal(checkout.searchParams.has(key), false, `${key} leaked for ${JSON.stringify(attribution)}`);
    }
  }
});

test('session IDs use crypto randomness and storage failure falls back to stable page memory', () => {
  let calls = 0;
  const cryptoProvider = {
    getRandomValues(bytes) {
      calls += 1;
      for (let index = 0; index < bytes.length; index += 1) bytes[index] = index + calls;
      return bytes;
    },
  };
  const throwingStorage = {
    getItem() { throw new Error('blocked'); },
    setItem() { throw new Error('blocked'); },
  };
  const getSession = createAnalyticsSessionProvider({ storage: throwingStorage, cryptoProvider });

  const first = getSession();
  const second = getSession();
  assert.match(first, /^sess_[a-f0-9]{32}$/);
  assert.equal(second, first);
  assert.equal(calls, 1);
  assert.equal(createAnalyticsSessionId(null), null);
});

test('session provider reuses only valid crypto-format values from sessionStorage', () => {
  const values = new Map([['saju.sess', 'sess_old_math_random']]);
  const storage = {
    getItem(key) { return values.get(key) || null; },
    setItem(key, value) { values.set(key, value); },
  };
  const cryptoProvider = {
    getRandomValues(bytes) {
      bytes.fill(0xab);
      return bytes;
    },
  };
  const getSession = createAnalyticsSessionProvider({ storage, cryptoProvider });
  assert.equal(getSession(), `sess_${'ab'.repeat(16)}`);
  assert.equal(values.get('saju.sess'), `sess_${'ab'.repeat(16)}`);
});
