#!/usr/bin/env node
// Daily Bluesky rotation — picks one evergreen post per day from the draft DB
// and publishes it via post-bluesky.mjs. Language interleaves EN/KO/JA.
// Usage:
//   node scripts/bluesky-rotate.mjs --dry-run   # print today's selection, no post
//   node scripts/bluesky-rotate.mjs             # publish today's selection
// Env: BLUESKY_APP_PASSWORD (from homeclaw/.env); passed through to post-bluesky.mjs.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DRAFTS = '/Users/shkim/hoonsikim/kb/ilsaryung/artifacts/bluesky/drafts/rotation.json';
const POSTER = path.join(__dirname, 'post-bluesky.mjs');

const dryRun = process.argv.includes('--dry-run');

const db = JSON.parse(fs.readFileSync(DRAFTS, 'utf-8'));
const posts = db.posts;
if (!Array.isArray(posts) || posts.length === 0) {
  console.error('rotation.json has no posts');
  process.exit(1);
}

// Deterministic day-of-year index so each calendar day maps to one post.
const now = new Date();
const startOfYear = new Date(now.getFullYear(), 0, 0);
const dayOfYear = Math.floor((now - startOfYear) / 86400000);
const idx = dayOfYear % posts.length;
const pick = posts[idx];

console.log(`[bluesky-rotate] date=${now.toISOString().slice(0, 10)} dayOfYear=${dayOfYear} idx=${idx}/${posts.length} id=${pick.id} lang=${pick.lang} theme=${pick.theme}`);
console.log(`[bluesky-rotate] text (${[...pick.text].length} graphemes):\n${pick.text}`);

if (dryRun) {
  console.log('[bluesky-rotate] --dry-run: no post sent');
  process.exit(0);
}

if (!process.env.BLUESKY_APP_PASSWORD) {
  console.error('[bluesky-rotate] BLUESKY_APP_PASSWORD missing — cannot post');
  process.exit(2);
}

const res = spawnSync('node', [POSTER, pick.text, pick.lang], { stdio: 'inherit' });
process.exit(res.status ?? 1);
