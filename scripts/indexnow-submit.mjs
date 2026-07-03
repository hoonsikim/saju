#!/usr/bin/env node
// IndexNow crawl-request lever — bot-reachable, no webmaster account needed.
// Pings Bing + Yandex to recrawl the listed URLs. Key file must stay live at keyLocation.
// Usage: node scripts/indexnow-submit.mjs   (submits all sitemap URLs)

const HOST = 'hoonsikim.github.io';
const KEY = 'c7eb152984726046ad71369476200c0f';
const KEY_LOCATION = `https://${HOST}/saju/${KEY}.txt`;

const URLS = [
  'https://hoonsikim.github.io/saju/',
  'https://hoonsikim.github.io/saju/blog/',
  'https://hoonsikim.github.io/saju/blog/day-master-archetypes-en.html',
  'https://hoonsikim.github.io/saju/blog/day-master-archetypes-ko.html',
  'https://hoonsikim.github.io/saju/blog/day-master-archetypes-ja.html',
  'https://hoonsikim.github.io/saju/blog/five-elements-balance-en.html',
  'https://hoonsikim.github.io/saju/blog/five-elements-balance-ko.html',
  'https://hoonsikim.github.io/saju/blog/five-elements-balance-ja.html',
  'https://hoonsikim.github.io/saju/blog/saju-compatibility-en.html',
  'https://hoonsikim.github.io/saju/blog/saju-compatibility-ko.html',
  'https://hoonsikim.github.io/saju/blog/saju-compatibility-ja.html',
];

const ENDPOINTS = [
  'https://api.indexnow.org/indexnow',
  'https://www.bing.com/indexnow',
  'https://yandex.com/indexnow',
];

const payload = JSON.stringify({ host: HOST, key: KEY, keyLocation: KEY_LOCATION, urlList: URLS });

for (const endpoint of ENDPOINTS) {
  try {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: payload,
    });
    console.log(`${endpoint} -> ${res.status} ${res.statusText}`);
  } catch (err) {
    console.error(`${endpoint} -> ERROR ${err.message}`);
  }
}
