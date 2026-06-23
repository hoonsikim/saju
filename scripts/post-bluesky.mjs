#!/usr/bin/env node
// Bluesky post — reusable. Reads text from stdin or first arg.
// Auto-detects URLs in text and creates link facets.
// Usage:
//   echo "post text" | node scripts/post-bluesky.mjs
//   node scripts/post-bluesky.mjs "post text" [lang]
// Env: BLUESKY_APP_PASSWORD (from homeclaw/.env), BLUESKY_IDENTIFIER (default h.company.sean@gmail.com)

import fs from 'node:fs';

const PASSWORD = process.env.BLUESKY_APP_PASSWORD;
const IDENT = process.env.BLUESKY_IDENTIFIER || 'h.company.sean@gmail.com';
if (!PASSWORD) { console.error('BLUESKY_APP_PASSWORD missing'); process.exit(1); }

let text;
let lang = 'en';
if (process.argv[2]) {
  text = process.argv[2];
  if (process.argv[3]) lang = process.argv[3];
} else {
  text = fs.readFileSync(0, 'utf-8').trimEnd();
}
if (!text || text.length < 1) { console.error('empty text'); process.exit(1); }

// Bluesky 300-grapheme cap; conservative byte cap
const enc = new TextEncoder();
const textBytes = enc.encode(text);
if (textBytes.length > 3000) {
  console.error(`text too long: ${textBytes.length} bytes`);
  process.exit(1);
}

// Auto-detect URLs and build link facets (UTF-8 byte coords)
function findUrlFacets(t) {
  const facets = [];
  const re = /https?:\/\/[^\s<>"']+/g;
  let m;
  while ((m = re.exec(t)) !== null) {
    const before = t.slice(0, m.index);
    const byteStart = enc.encode(before).length;
    const byteEnd = byteStart + enc.encode(m[0]).length;
    facets.push({
      index: { byteStart, byteEnd },
      features: [{ $type: 'app.bsky.richtext.facet#link', uri: m[0] }]
    });
  }
  return facets;
}

// 1) Auth
const sessionRes = await fetch('https://bsky.social/xrpc/com.atproto.server.createSession', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ identifier: IDENT, password: PASSWORD })
});
const session = await sessionRes.json();
if (!session.accessJwt) {
  console.error('AUTH FAIL:', JSON.stringify(session));
  process.exit(2);
}

// 2) Post
const record = {
  $type: 'app.bsky.feed.post',
  text,
  createdAt: new Date().toISOString(),
  langs: [lang],
  facets: findUrlFacets(text)
};
const postRes = await fetch('https://bsky.social/xrpc/com.atproto.repo.createRecord', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${session.accessJwt}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    repo: session.did,
    collection: 'app.bsky.feed.post',
    record
  })
});
const post = await postRes.json();
if (post.uri) {
  const rkey = post.uri.split('/').pop();
  console.log(`OK uri=${post.uri} cid=${post.cid}`);
  console.log(`WEB https://bsky.app/profile/${session.handle}/post/${rkey}`);
} else {
  console.error('POST FAIL:', JSON.stringify(post));
  process.exit(3);
}
