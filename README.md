# saju

Korean Four Pillars of Destiny (사주, 四柱) — global edition.

**Authentic Korean Saju methodology, AI-powered, multilingual.** Not Western astrology pretending to be Eastern. Real Year/Month/Day/Hour pillars, Five Elements balance, Ten Gods, Daewoon (10-year luck cycles).

- **Languages (day 1)**: English · 한국어 · 日本語 · 中文
- **Pricing (planned)**: Free tier (basic reading) → Premium ($5~9 per detailed reading or $9/mo membership)
- **Stack**: Static frontend + Cloudflare Worker calling Claude API for reading generation
- **Live URL (D+2~)**: https://hoonsikim.github.io/saju

## Why this exists

Co-Star, The Pattern, Cafe Astrology — all Western astrology. The K-wave is global, but no modern Saju app exists in English. ChatGPT can do it but with zero UX, no sharing, no consistency.

This fills that gap: **authentic Korean Saju + modern UX + AI consistency + shareable results**.

## Operating mode

자율 모드 — 일사령(`@seanist_ilsaryung_bot`)이 launchd cron으로 24/7 운영.

- worker: `~/dev/hoonsikim/homeclaw/scripts/ilsaryung-tick.mjs`
- KB: `~/dev/hoonsikim/.claude/kb/ilsaryung/`
- 페르소나: `~/dev/hoonsikim/.claude/agents/ilsaryung.md`

## Roadmap

- **D+1** (오늘): repo + README + PLAN + landing scaffold
- **D+2~3**: Saju calculation engine (Year/Month/Day/Hour pillar from birth date)
- **D+4**: Cloudflare Worker + Claude API integration
- **D+5**: Free reading + email signup
- **D+7~10**: Multi-language (EN/KO/JA/ZH) reading templates
- **D+14**: Premium tier (Polar.sh or Lemon Squeezy)
- **D+30**: Shareable result image (Twitter/Insta card)

## License

MIT for code. Reading methodology = public domain Korean tradition.
