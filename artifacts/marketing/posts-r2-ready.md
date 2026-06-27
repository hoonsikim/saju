# Marketing Posts r2 — Paste-Ready (Day 1 launch)

**Date**: 2026-05-24 (D+13)
**Status**: 8 채널 가입 완료. KYC 답신 대기 동안 무료 사용자 모음 + KV /track baseline 빌드 목적.
**Update from r1**: Chunks 1-5 deploy 결과 모두 반영 (9:16 share card · What is Saju? · wealth readingType · Methodology · about 4 lang)

---

## 권고 paste 순서 (사용자 시간 40-60분)

| # | 채널 | 시간 | 효과 |
|---|---|---|---|
| **1** | **Indie Hackers** | 5분 (paste + publish) | solo dev tribe, 즉시 ROI |
| **2** | **Dev.to** | 10분 (Markdown + tag setup) | SEO + dev audience, 검색 발견 |
| **3** | **X / Threads / Bluesky** (동일 thread 3 채널) | 15분 (5 tweets × 3 = 15 paste) | multi-lingual reach |
| **4** | **Instagram** (bio + 첫 캐러셀) | 15분 (캐러셀 디자인 + caption) | Z세대 visual viral |
| **5** | **Product Hunt** (maker 프로필 + "Coming soon") | 5분 | launch day burst 준비 |

---

## 1. Indie Hackers — Post

**URL**: https://www.indiehackers.com/post/new
**Category**: "Launch" or "Building in Public"

**Title** (그대로 paste):
```
Shipped: Korean Saju (Four Pillars) reader — solo, MIT, $7 one-time digital product
```

**Body** (그대로 paste):
```
Hi IH — sharing my solo project that just hit "ready for first users."

**What it is**: Korean Saju (Four Pillars of Destiny) is the local variant of Chinese BaZi. There's an interesting under-served niche: globally accessible, methodologically transparent, paying users get a one-time digital product instead of subscription.

**Product**:
- Free basic chart in 20 languages, no signup
- $7 one-time Deep Reading (2,500-3,500 words across 5 sections: Personality, Career, Love, Wealth, Timing + closing). Choose your focus → that section expands to ~800 words. Email delivered.
- No subscription. No recurring billing. No upsell beyond one tier.

**Stack** (all 1-person, mostly free tier):
- Static HTML/JS on GitHub Pages
- Cloudflare Worker for the LLM endpoint (Anthropic Claude Haiku 4.5)
- Lemon Squeezy as Merchant of Record (tax + compliance globally)
- n8n on my GCP VM for webhook → reading → email
- Resend for transactional email
- Open-source lunar-javascript for the deterministic chart computation (browser-side)

**Interesting design**: split the deterministic part (chart) from the stochastic part (LLM). ChatGPT/Claude custom GPTs for BaZi/Saju hallucinate the actual chart because LLMs don't have ephemeris data — here the chart is computed in your browser via lunar-javascript and verifiable from GitHub. The LLM only writes the interpretation layer.

**Business mode**:
- Solo operator (me) in Seoul, Korea
- No team, no investors, no data farming
- Intentionally non-personal-brand (no TikTok influencer mode, no public face)
- Everything client-side except the LLM call

**About page**: methodology + classical sources (子平真詮·滴天髓·三命通會·窮通寶鑑) + AI model card + 4 languages so far (en/ko/ja/zh)

**Why I'm here**: tomorrow's challenge is traffic. The path: Reddit r/asianastrology + HN Show HN (waiting on karma) + here + SEO long-tail. If anyone here has experience with mystic/astro niches' marketing channels I'd love to hear what's worked beyond the standard "build in public" playbook.

Site: https://hoonsikim.github.io/saju
Code: https://github.com/hoonsikim/saju (MIT)
About + methodology: https://hoonsikim.github.io/saju/about/
```

---

## 2. Dev.to — Article

**URL**: https://dev.to/new

**Title** (그대로):
```
Building a 20-language Saju (Korean Four Pillars) reader: deterministic chart + LLM interpretation
```

**Tags** (4개 max): `webdev`, `ai`, `showdev`, `javascript`

**Cover image**: (optional — favicon 또는 캐러셀 1번 슬라이드)

**Body** (Markdown, 그대로 paste):
```markdown
This is a writeup of a side project I just shipped: a Korean Saju (Four Pillars of Destiny) reader at [hoonsikim.github.io/saju](https://hoonsikim.github.io/saju).

The interesting engineering decision was splitting the deterministic part (birth chart computation) from the stochastic part (LLM interpretation). Here's why and how.

## The problem with ChatGPT custom GPTs for astrology

If you ask ChatGPT or Claude to compute a BaZi or Saju chart from your birth date, it confidently produces something — but the actual stems and branches are often wrong. LLMs don't have ephemeris data baked in. They hallucinate the chart and then write a beautifully fluent interpretation of the hallucinated chart.

This is invisible to most users. The interpretation sounds right, so the chart must be right, right?

## The split

For my Saju site I do this:

1. **Chart layer (deterministic)** — computed entirely in the browser via the open-source [lunar-javascript](https://github.com/6tail/lunar-javascript) library. Year/month/day/hour pillars (天干·地支), Five Elements balance (五行), Ten Gods (十神), hidden stems (지장간), twelve life stages (12운성), void branches (공망), ten-year luck cycles (대운), and the three core shen sha (神煞: 天乙·桃花·驛馬). All deterministic. Same birth data → same chart, every time. Verifiable from the source.

2. **Interpretation layer (LLM)** — Anthropic Claude Haiku 4.5 generates a 2,500–3,500 word long-form interpretation across 5 sections (Personality / Career / Love / Wealth / Timing) + closing. It's given the structured chart data, not the raw birth date. So the LLM is interpreting actual classical features, not making up which Day Master you are.

This makes the site auditable in a way that a custom GPT can't be. The About page documents the methodology (立春 boundary, 24절기, 子時 학파, classical text sources like 子平真詮·滴天髓·三命通會·窮通寶鑑) and an AI Model Card with the prompt template link.

## Stack

All one-person, mostly free tier:
- **Site**: static HTML+JS on GitHub Pages
- **LLM endpoint**: Cloudflare Worker (Anthropic Claude Haiku 4.5)
- **Payment**: Lemon Squeezy (Merchant of Record — handles tax + compliance globally)
- **Webhook → email pipeline**: n8n on a small GCP VM
- **Transactional email**: Resend
- **i18n**: 20 languages including full RTL for Arabic; about page in 4 (en/ko/ja/zh)

## What's free, what's $7

- **Free**: full chart in 20 languages, deterministic, browser-side, no signup
- **$7 one-time** (no subscription): the long-form LLM Deep Reading delivered to email. Choice of focus (general / career / love / wealth) expands that section to ~800 words

## Why I'm writing this

Looking for two kinds of feedback:

1. **From devs**: does the disclosure of "chart deterministic / interp LLM" come through? Where would you cut?
2. **From BaZi/Saju practitioners or astrology folks**: where does the chart computation deviate from what you'd expect? Specifically interested in 真太陽時 (LMT correction) — I currently don't apply it; for serious cases I refer people to credentialed practitioners.

Code: [github.com/hoonsikim/saju](https://github.com/hoonsikim/saju) (MIT)
About + methodology: [hoonsikim.github.io/saju/about](https://hoonsikim.github.io/saju/about)

If this resonates I'll write a follow-up on the LLM prompt engineering side (how I structured the 5-section system prompt and the readingType branching).
```

---

## 3. X / Threads / Bluesky — 5-tweet thread (동일 본문, 3 채널 paste)

각 채널 동일 본문, 한 channel 5 tweets 차례 post.

**Tweet 1/5**:
```
I shipped a Korean Saju (Four Pillars of Destiny) reader as a side project.

Free chart in 20 languages + optional $7 AI Deep Reading.

The interesting design choice: split deterministic chart from stochastic LLM interp 🧵

hoonsikim.github.io/saju
```

**Tweet 2/5**:
```
ChatGPT/Claude custom GPTs for BaZi have a hidden flaw: they hallucinate the actual chart (天干·地支) because LLMs don't have ephemeris data.

I keep the chart deterministic (lunar-javascript, MIT, browser-side) and only use the LLM for the 2,500–3,500 word interpretation.
```

**Tweet 3/5**:
```
Stack:
• GitHub Pages (site)
• Cloudflare Worker (Claude Haiku 4.5)
• Lemon Squeezy (Merchant of Record)
• n8n + Resend (email delivery)

All 1-person, mostly free tier.

20 languages with full RTL for Arabic.
```

**Tweet 4/5**:
```
About page documents: methodology, classical sources (子平真詮·滴天髓·三命通會·窮通寶鑑), AI model card.

Available in 4 languages so far: en/ko/ja/zh
hoonsikim.github.io/saju/about
```

**Tweet 5/5**:
```
Solo operator in Seoul. $7 one-time, no subscription. MIT-licensed.

Looking for feedback from BaZi/Saju practitioners + AI tool evaluators.

Site: hoonsikim.github.io/saju
Code: github.com/hoonsikim/saju
```

**Hashtag 첨부 권고** (마지막 tweet 또는 별도):
- X: `#BaZi #Saju #AItools #buildinpublic #soloSaaS`
- Bluesky: `#mystic #astrology #BaZi #Saju #buildinpublic`
- Threads: `#bazi #saju #astrology #aitools`

---

## 4. Instagram — bio + 첫 캐러셀

### Bio (그대로 paste, 1줄 + link in bio):
```
Korean Saju (四柱) reader · 20 languages
Free chart + $7 AI deep reading
hoonsikim.github.io/saju
```

### Highlights name 후보:
- About · Day Master · Examples · How

### 첫 캐러셀 (10 슬라이드, Day Master 시리즈)

각 슬라이드 1080×1350 (Instagram square 또는 portrait). 사령이 SVG 생성 가능 (가장 빠른 path) 또는 사용자가 Canva.

**슬라이드 구조** (10장):
1. **Cover**: "Your Day Master is your soul element. Here are all 10." (검정 배경 + 황금 한자 命 + sub)
2. **甲 The Tall Tree** (Yang Wood) — "Upright. Growth-oriented. A leader who breaks new ground."
3. **乙 The Vine** (Yin Wood) — "Adaptive. Persistent. Finds light in any crack."
4. **丙 The Sun** (Yang Fire) — "Bright. Generous. Warms everyone."
5. **丁 The Candle** (Yin Fire) — "Focused. Refined. Illuminates one thing deeply."
6. **戊 The Mountain** (Yang Earth) — "Stable. Trustworthy. Holds firm."
7. **己 The Field** (Yin Earth) — "Nurturing. Patient. Quiet productivity."
8. **庚 The Sword** (Yang Metal) — "Sharp. Decisive. Cuts through."
9. **辛 The Jewel** (Yin Metal) — "Refined. Precise. Beauty in detail."
10. **壬 The Ocean** (Yang Water) — "Vast. Flowing. Big-picture thinker."
11. **癸 The Stream** (Yin Water) — "Gentle. Persistent. Finds its way."
(마지막 슬라이드: CTA "What's yours? hoonsikim.github.io/saju · No signup. 20 languages.")

### Caption (첫 캐러셀 paste):
```
What's your Day Master? 🜂🜁🜃🜄🜍

In Korean Saju (사주·四柱), your Day Master (日主) is the stem of the day you were born — an elemental archetype of your core self. Like a zodiac sign, but based on the day rather than the month.

There are 10. Swipe through to find yours.

Then check the full chart (free, no signup, 20 languages): hoonsikim.github.io/saju

#saju #bazi #fourpillars #koreanastrology #daymaster #fiveelements #astrology
```

→ 사령이 캐러셀 SVG 10장 생성 가능. 명령 주시면 자율 작성.

---

## 5. Product Hunt — Profile + "Coming soon"

**Maker bio** (그대로 paste, profile 페이지):
```
Maker. Solo dev. Seoul-based.

Currently shipping: Saju — Korean Four Pillars reader (free chart in 20 languages, $7 AI deep reading).

Deterministic chart + LLM interpretation, MIT-licensed.

hoonsikim.github.io/saju
```

**Product 정식 launch는 KYC 통과 후 별도 이벤트** — Product Hunt launch day는 24h 단위 burst가 중요하므로 결제 가능 + 사이트 안정 상태에서.

지금은 maker 프로필 + "Coming soon" page만 (있다면).

---

## 6. HN 재시도 가이드

- URL: https://news.ycombinator.com/login
- **No email required** — username + password만
- 실패 가능성:
  - **`hoonsikim` 중복** → 다른 username 시도 (`hoonsi`, `seansaju`, `kimhoonsi`, `saju_kim`)
  - 약한 비밀번호 → 16자+ (대소문자 + 숫자 + 기호)
  - IP 일시 차단 → VPN/다른 wifi 시도
- 가입 성공 후 즉시 액션 X. **1-2주 카르마 빌드** 후 Show HN.
  - 매일 frontpage 글 3-5개에 thoughtful comment (사령이 작성 가능, paste)
  - 카르마 50+ 만든 후 Show HN 화/수/목 20-22 KST launch

---

## 7. 추가 가입 권고 (사용자 결정)

| 채널 | 가입 마찰 | ROI | 우선순위 |
|---|---|---|---|
| **Substack** | Google OAuth 5분 | 자체 publication, SEO + email list 누적 | **강하게 권고** |
| **Medium** | Google OAuth 3분 | 영어 mystic 카테고리, 일부 monetize | 중 |
| **LinkedIn** | 이미 보유 가능성 | Marie 페르소나 target (AI tool eval + 전문직) | 중 |
| **Quora** | Google OAuth 3분 | multi-lingual 답변 (영/스/포/힌디) | 중 |

특히 Substack은 사령이 매주 1편 자율 발행 가능 → SEO + email list 누적이 가장 큰 장기 자산.

---

## 8. 사령 자율 다음 작업 (paste 후)

| 작업 | 자율 수준 |
|---|---|
| Instagram 캐러셀 10장 SVG 생성 | ✅ 완전 자율 |
| Reddit r/asianastrology 카르마 빌드 comment 작성 (handoff) | ✅ |
| HN 카르마 빌드 comment 작성 (handoff) | ✅ |
| Substack 첫 글 long-form draft | ✅ 가입 후 |
| 권역별 글 (디시·5ch·小红书 등) — 사용자 channel 잠금이라 보류 | — |
| 트래픽 모니터링 (KV /track + GitHub + CF analytics) | ✅ (ADMIN_TOKEN 필요) |

---

## 9. Paste 후 사령에게 알릴 것

각 채널 post 완료 후 사령에게 한 줄로 알려주시면:
- 댓글 응대 (질문 답변) 도와드림
- 트래픽 spike 모니터링
- 다음 글 timing 결정 (24h 후 next post 등)

```
ex: "Indie Hackers post 됨, link: https://www.indiehackers.com/post/..."
```
