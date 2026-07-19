# saju

Korean Four Pillars of Destiny (사주, 四柱) — global edition.

![saju — Korean Four Pillars of Destiny, free and instant](./og-en.svg)

**Authentic Korean Saju methodology, AI-powered, in 20 languages.** Not Western astrology pretending to be Eastern. Real Year/Month/Day/Hour pillars, Five Elements balance, Ten Gods, Daewoon (10-year luck cycles).

## Try it

- **Reading** — https://hoonsikim.github.io/saju — Four Pillars chart + Five Elements + Ten Gods for any birth date/time
- **Daily fortune** — https://hoonsikim.github.io/saju/today.html — today's reading + 7-day forecast strip, surfaces the best day of the week
- **Compatibility (궁합)** — https://hoonsikim.github.io/saju/compat.html — two birth charts, a 0–100 verdict, shareable result card

The deterministic chart engines and rule-based fallback run client-side. The current Reading page also sends the applicable raw birth fields and derived chart context through Cloudflare Workers to Anthropic for its AI narrative; Daily Fortune and Compatibility remain client-side. Reading URLs contain encoded birth date/time and focus so a result can be reopened, so treat copied reading URLs as sensitive. See [Terms](https://hoonsikim.github.io/saju/legal/terms/) and the [AI model card](https://hoonsikim.github.io/saju/about/#model-card).

## What it does

- **20 languages**: English · 한국어 · 日本語 · 中文 · Español · Português · Français · Deutsch · Italiano · Русский · Türkçe · Nederlands · Polski · Svenska · Bahasa Indonesia · Filipino · Tiếng Việt · ไทย · हिन्दी · العربية
- **Four Pillars engine**: Year/Month/Day/Hour gan-ji, Five Elements ratio, Ten Gods auto-labeling — handles 立春 solar-term boundaries
- **Compatibility**: four-axis score (Day Master relation, Day Branch 六合/相沖, Five Elements complement, combined balance) → soulmate/strong/good/mixed/challenging verdict
- **Shareable**: URL-encoded birth state, native Web Share, downloadable verdict card (PNG)
- **Deep Reading**: the free reading is complete on its own; a long-form AI-written interpretation is available at https://hcompany.gumroad.com/l/reading

## Guides

Long-form explainers on the concepts the reading uses — English, 한국어, 日本語:

- **Day Master archetypes** — [EN](https://hoonsikim.github.io/saju/blog/day-master-archetypes-en.html) · [KO](https://hoonsikim.github.io/saju/blog/day-master-archetypes-ko.html) · [JA](https://hoonsikim.github.io/saju/blog/day-master-archetypes-ja.html)
- **Five Elements balance** — [EN](https://hoonsikim.github.io/saju/blog/five-elements-balance-en.html) · [KO](https://hoonsikim.github.io/saju/blog/five-elements-balance-ko.html) · [JA](https://hoonsikim.github.io/saju/blog/five-elements-balance-ja.html)
- **Saju compatibility (궁합)** — [EN](https://hoonsikim.github.io/saju/blog/saju-compatibility-en.html) · [KO](https://hoonsikim.github.io/saju/blog/saju-compatibility-ko.html) · [JA](https://hoonsikim.github.io/saju/blog/saju-compatibility-ja.html)

Index: https://hoonsikim.github.io/saju/blog/

## Why this exists

Co-Star, The Pattern, Cafe Astrology — all Western astrology. The K-wave is global, but no modern Saju app exists outside Korea. ChatGPT can do it but with zero UX, no sharing, no consistency.

This fills that gap: **authentic Korean Saju + modern UX + AI consistency + shareable results**.

## Accuracy

Matches Posteller (포스텔러 만세력 2.2) — Korea's #1 fortune app — 100% on the benchmark case (1990-12-20 16:30 KST → 庚午 / 戊子 / 己未 / 壬申). See `test/saju.test.js`.

## Stack

Static frontend (GitHub Pages) + a Four Pillars engine in plain JS. Optional Cloudflare Worker calls the Claude API for narrative reading generation; without it the site falls back to a built-in rule-based reading, so it works with zero backend.

## Standalone engine

The Four Pillars engine — `birthInfoToFourPillars`, Five Elements balance, Ten Gods — is also published as a standalone, single-dependency Gist you can drop into any project:

**https://gist.github.com/hoonsikim/03a5faced1f270edbd4ca8d580f2edb5**

Handles 立春 solar-term and 子時 day boundaries the way Korean 만세력 does — the part most JS bazi libraries get wrong.

## License

MIT for code. Reading methodology = public-domain Korean tradition.
