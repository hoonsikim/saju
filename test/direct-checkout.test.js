import assert from 'node:assert/strict';
import test from 'node:test';

import {
  buildDirectCheckoutUrl,
  DIRECT_CHECKOUT_OMITTED_FIELDS,
  DIRECT_CHECKOUT_QUERY_FIELDS,
} from '../src/direct-checkout.js';

const BASE = 'https://hcompany.gumroad.com/l/reading';
const INPUT = {
  year: 1990,
  month: 12,
  day: 20,
  hour: 16,
  minute: 30,
  gender: 'female',
  city: 'Seoul, Korea',
  language: 'en',
  readingType: 'career',
};

test('direct checkout sends only the current fulfillment minimum plus safe attribution', () => {
  const checkout = new URL(buildDirectCheckoutUrl(BASE, INPUT, {
    source: 'reddit_chineseastrology_001',
    email: 'must-not-cross@example.com',
  }));

  assert.deepEqual(DIRECT_CHECKOUT_QUERY_FIELDS, ['birth', 'gender', 'lang', 'readingType']);
  assert.deepEqual(DIRECT_CHECKOUT_OMITTED_FIELDS, ['city']);
  assert.equal(checkout.searchParams.get('birth'), '199012201630');
  assert.equal(checkout.searchParams.get('gender'), 'female');
  assert.equal(checkout.searchParams.get('lang'), 'en');
  assert.equal(checkout.searchParams.get('readingType'), 'career');
  assert.equal(checkout.searchParams.get('city'), null);
  assert.equal(checkout.searchParams.get('source'), 'reddit_chineseastrology_001');
  assert.equal(checkout.searchParams.get('utm_source'), 'reddit');
  assert.equal(checkout.searchParams.get('utm_medium'), 'organic-social');
  assert.equal(checkout.searchParams.get('utm_campaign'), 'reddit_chineseastrology_001');
  assert.equal(checkout.searchParams.get('email'), null);
});

test('configured base parameters survive except forbidden city context', () => {
  const checkout = new URL(buildDirectCheckoutUrl(
    `${BASE}?affiliate=partner&city=legacy-city#buy`,
    INPUT,
  ));

  assert.equal(checkout.searchParams.get('affiliate'), 'partner');
  assert.equal(checkout.searchParams.get('city'), null);
  assert.equal(checkout.hash, '#buy');
});

test('wealth focus survives direct checkout handoff', () => {
  const checkout = new URL(buildDirectCheckoutUrl(BASE, { ...INPUT, readingType: 'wealth' }));

  assert.equal(checkout.searchParams.get('birth'), '199012201630');
  assert.equal(checkout.searchParams.get('readingType'), 'wealth');
});

test('localized Threads sources preserve language and fixed campaign attribution', () => {
  for (const language of ['ko', 'ja', 'en']) {
    const source = `threads_saju_${language}_001`;
    const checkout = new URL(buildDirectCheckoutUrl(
      BASE,
      { ...INPUT, language },
      { source },
    ));

    assert.equal(checkout.searchParams.get('lang'), language);
    assert.equal(checkout.searchParams.get('source'), source);
    assert.equal(checkout.searchParams.get('utm_source'), 'threads');
    assert.equal(checkout.searchParams.get('utm_medium'), 'organic-social');
    assert.equal(checkout.searchParams.get('utm_campaign'), source);
  }
});

test('invalid or incomplete fulfillment input falls back to the non-sensitive product URL', () => {
  for (const input of [
    null,
    { ...INPUT, gender: '' },
    { ...INPUT, gender: 'other' },
    { ...INPUT, month: 2, day: 30 },
    { ...INPUT, hour: 24 },
    { ...INPUT, language: 'alice@example.com' },
    { ...INPUT, readingType: 'health' },
  ]) {
    const checkout = new URL(buildDirectCheckoutUrl(`${BASE}?city=legacy-city`, input, { source: 'reddit' }));
    assert.equal(checkout.searchParams.get('source'), null);
    assert.equal(checkout.searchParams.get('birth'), null);
    assert.equal(checkout.searchParams.get('gender'), null);
    assert.equal(checkout.searchParams.get('lang'), null);
    assert.equal(checkout.searchParams.get('readingType'), null);
    assert.equal(checkout.searchParams.get('city'), null);
  }
});
