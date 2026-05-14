# saju

Korean Four Pillars of Destiny (사주, 四柱) — global edition.

**Authentic Korean Saju methodology, AI-powered, in 20 languages.** Not Western astrology pretending to be Eastern. Real Year/Month/Day/Hour pillars, Five Elements balance, Ten Gods, Daewoon (10-year luck cycles).

## Try it

- **Reading** — https://hoonsikim.github.io/saju
- **Compatibility (궁합)** — https://hoonsikim.github.io/saju/compat.html — two birth charts, a 0–100 verdict, shareable result card

Both run fully client-side. Enter a birth date/time, get a reading instantly. Every result is a shareable URL — open someone's link and their chart renders on your screen.

## What it does

- **20 languages**: English · 한국어 · 日本語 · 中文 · Español · Português · Français · Deutsch · Italiano · Русский · Türkçe · Nederlands · Polski · Svenska · Bahasa Indonesia · Filipino · Tiếng Việt · ไทย · हिन्दी · العربية
- **Four Pillars engine**: Year/Month/Day/Hour gan-ji, Five Elements ratio, Ten Gods auto-labeling — handles 立春 solar-term boundaries
- **Compatibility**: four-axis score (Day Master relation, Day Branch 六合/相沖, Five Elements complement, combined balance) → soulmate/strong/good/mixed/challenging verdict
- **Shareable**: URL-encoded birth state, native Web Share, downloadable verdict card (PNG)
- **Pricing (planned)**: free basic reading → premium detailed reading / membership

## Why this exists

Co-Star, The Pattern, Cafe Astrology — all Western astrology. The K-wave is global, but no modern Saju app exists outside Korea. ChatGPT can do it but with zero UX, no sharing, no consistency.

This fills that gap: **authentic Korean Saju + modern UX + AI consistency + shareable results**.

## Accuracy

Matches Posteller (포스텔러 만세력 2.2) — Korea's #1 fortune app — 100% on the benchmark case (1990-12-20 16:30 KST → 庚午 / 戊子 / 己未 / 壬申). See `test/saju.test.js`.

## Stack

Static frontend (GitHub Pages) + a Four Pillars engine in plain JS. Optional Cloudflare Worker calls the Claude API for narrative reading generation; without it the site falls back to a built-in rule-based reading, so it works with zero backend.

## License

MIT for code. Reading methodology = public-domain Korean tradition.
