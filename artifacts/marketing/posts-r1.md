# Marketing Posts r1 — 6 채널 Multi-Draft

**Date**: 2026-05-24 (D+13)
**Trigger**: 사용자 진단 "트래픽 거의 0" → 사이트 강화 충분, 진짜 적은 진입 부재
**Goal**: KYC 통과 ETA (영업일 1~3일) 동안 마케팅 텍스트 준비 → 통과 즉시 burst launch

---

## A. Hacker News — Show HN (가장 큰 ROI)

**Title** (80자 한도):
```
Show HN: Saju – Korean Four Pillars of Destiny reader (deterministic chart + LLM interp)
```

**First comment** (HN 첫 자기 댓글 — 가장 중요):
```
Hi HN, I built a Korean Saju (Four Pillars of Destiny) reader as a one-person side project.

The differentiating design: split the deterministic part (chart computation) from the stochastic part (LLM interpretation). ChatGPT custom GPTs for BaZi/Saju hallucinate the actual chart (LLMs don't have ephemeris data), but here the chart — year/month/day/hour pillars, Five Elements, Ten Gods, hidden stems, twelve life stages, void branches, ten-year luck cycles, shen sha — is computed via the open-source lunar-javascript library and verifiable from the GitHub source. The LLM (Claude Haiku 4.5) only writes the 2,500-3,500-word interpretation layer.

Stack:
- Static HTML+JS on GitHub Pages
- Cloudflare Worker for the LLM endpoint
- Lemon Squeezy + n8n + Resend for the optional $7 paid Deep Reading delivery
- 20 languages (en/ko/ja/zh/es/pt/fr/de/it/ru/tr/nl/pl/sv/id/fil/vi/th/hi/ar) with full RTL for Arabic

The About page documents methodology (立春 boundary, 24절기, 子時 학파), classical sources (子平真詮·滴天髓·三命通會·窮通寶鑑), and a model card with the system prompt link. All birth data is computed in your browser — never touches my server.

What I'd love feedback on:
1. Does the disclosure of "chart = deterministic / interpretation = LLM" come through clearly?
2. The readingType branching (general/career/love/wealth → that section expands to ~800 words) — does that feel meaningful or gimmicky?
3. What would you cut?

Site: https://hoonsikim.github.io/saju
Code: https://github.com/hoonsikim/saju (MIT)
About + methodology: https://hoonsikim.github.io/saju/about/
```

**Best time to post**: 평일 미국 East Coast 아침 7-9am EST = **20-22 KST**. 화·수·목이 좋음. 금~월 피하기.

---

## B. Reddit — r/asianastrology

**Title**:
```
I built a free Korean Saju (Four Pillars) reader with proper chart + AI interpretation — practitioner feedback wanted
```

**Body**:
```
Hi r/asianastrology — I've been building a Korean Saju reader as a side project and would love practitioner feedback before pushing wider.

The Korean tradition shares roots with Chinese BaZi but has its own interpretive conventions (heavier Day Master emphasis, slightly different 신살 priority, etc.). The free version gives you all the actual chart data: Four Pillars (천간·지지), Day Master, Five Elements (오행) balance, Ten Gods (십신), hidden stems (지장간), twelve life stages (12운성), void branches (공망), ten-year luck cycles (대운), shen sha (천을귀인·도화·역마), and the current year pillar (세운).

A few decisions I'd love feedback on:

1. **Day Master archetype naming** — I labelled the 10 stems as "Big Tree / Vine / Sun / Candle / Mountain / Field / Sword / Jewel / Ocean / Stream" for global accessibility. Too poetic? Just right? Should be more clinical?

2. **lunar-javascript** for the actual chart (handles 立春 boundary, 24절기, 夜子時 = 翌日 학파). **True solar time longitude correction is not yet applied** — for serious cases I openly refer people to credentialed practitioners. Acceptable middle ground for a free tool, or am I cutting too much?

3. **Free vs paid split**: Free gets the full chart + a short rule-based reading. The optional $7 Deep Reading uses Claude Haiku 4.5 for a 2,500-3,500 word interpretation across 5 sections (Personality, Career, Love, Wealth, Timing). AI use is disclosed openly on /about/#model-card.

20 languages, no signup, browser-side computation, MIT-licensed code.

Site: https://hoonsikim.github.io/saju
About + sources: https://hoonsikim.github.io/saju/about/

If something feels off (specific stem/branch interpretations wrong, balance reading weird, archetype wrong for a 일주), please call it out — I'd rather fix it now.
```

---

## C. Disquiet — 한국 메이커 커뮤니티 (한국어)

**Title**:
```
사주 사이트 만들었습니다 — 무료 차트 + $7 AI 심층 풀이, 20개 언어 (1인 운영, 코드 MIT)
```

**Body**:
```
안녕하세요, 한국식 사주(四柱)를 글로벌 시장에 푸는 1인 프로젝트 만들었습니다.

차별점: 차트 계산(천간·지지·오행·십신·지장간·12운성·공망·대운·신살)은 오픈소스 lunar-javascript 라이브러리로 결정론적으로 계산하고, AI는 해석 텍스트만 생성합니다. ChatGPT가 BaZi 물어볼 때 차트 자체를 환각하는 문제를 분리해서 풉니다.

**스택**:
- 사이트: 순수 정적 HTML + JS (GitHub Pages)
- LLM endpoint: Cloudflare Worker → Anthropic Claude Haiku 4.5
- 결제: Lemon Squeezy + n8n workflow + Resend email
- 다국어: 20개(en/ko/ja/zh/es/pt/fr/de/it/ru/tr/nl/pl/sv/id/fil/vi/th/hi/ar), 아랍어 RTL 지원
- 코드: MIT 라이센스로 GitHub 공개

**무료**: 4기둥 + 오행 + 십신 + 지장간 + 12운성 + 공망 + 대운 + 세운 + 신살(천을귀인·도화·역마) 모두 즉시. 가입 X.

**$7 심층 풀이**: 일반/직업/연애/재물 중 선택 → 그 영역 ~800단어 확장. 5섹션(성정·직업·연애·재물·시기) + 마무리 2,500-3,500단어. 이메일 발송. 명리 상담 100,000원 대비 가성비.

**비즈니스 모드**: 1인 메이커 + 비대면 + 신분인증 회피. 인플루언서·인스타·페북 안 함. 자연 검색 + 메이커 커뮤니티 + 친구 추천 위주.

**피드백 환영 영역**:
- 한국어 사주 본문(Claude 생성)이 자연스러운가
- 한국 결제 path 마찰 (USD/Lemon Squeezy로 결제 시 한국 카드 호환성)
- 메인 페이지에서 어디서 막히는지
- 신살 priority가 한국 정통과 어긋나는 지점

사이트: https://hoonsikim.github.io/saju
코드 (MIT): https://github.com/hoonsikim/saju
About (한국어): https://hoonsikim.github.io/saju/about/ko/
방법론 + 출처: https://hoonsikim.github.io/saju/about/ko/#methodology
```

---

## D. Indie Hackers

**Title**:
```
Launched a Korean Saju reader — solo, MIT, $7 one-time digital product (no subscription)
```

**Body**:
```
Hi IH — sharing my solo project that just hit "ready for first users." Korean Saju is the local variant of BaZi (Chinese Four Pillars astrology). The interesting under-served niche: globally accessible, methodologically transparent, paying users get a one-time digital product instead of subscription.

**Product**:
- Free basic chart in 20 languages, no signup
- $7 one-time Deep Reading (2,500-3,500 words, 5 sections + closing, choice of focus: general / career / love / wealth). Email delivered.
- No subscription. No recurring billing. No upsell beyond one tier.

**Stack** (all 1-person, mostly free tier):
- Static HTML/JS on GitHub Pages
- Cloudflare Worker for the LLM endpoint (Claude Haiku 4.5)
- Lemon Squeezy as Merchant of Record (handles tax + compliance globally)
- n8n workflow on my GCP VM for webhook → reading → email
- Resend for transactional email
- Open-source lunar-javascript library for the chart computation (deterministic, browser-side)

**Business mode**:
- Solo operator (me) in Seoul, Korea
- No team, no investors, no data farming
- Intentionally non-personal-brand (no TikTok influencer mode, no Instagram, no public face)
- Everything client-side except the LLM call

**Why I'm here**: tomorrow's challenge is traffic. The path I'm planning: Reddit r/asianastrology + HN Show HN + here + SEO long-tail + maybe a quiet Substack. Not on TikTok/IG by design.

If anyone has experience with mystic/astro niches' marketing channels I'd love to hear what's worked beyond the standard "build in public" playbook.

Site: https://hoonsikim.github.io/saju
Code: https://github.com/hoonsikim/saju
About: https://hoonsikim.github.io/saju/about/
```

---

## E. Reddit — r/SideProject (general)

**Title**:
```
My weekend hobby — open-source Korean Saju reader (rule-based chart + LLM interpretation)
```

**Body**:
```
Built a Korean Saju (Four Pillars of Destiny) reader on GitHub Pages. Free chart in 20 languages, optional $7 long-form AI interpretation.

The interesting bit for /r/SideProject: I split the deterministic part (chart computation, classical lookup tables) from the stochastic part (LLM interpretation). Chart is computed in your browser via the open-source lunar-javascript library, LLM only writes the narrative. This makes it auditable in a way that ChatGPT custom GPTs for BaZi aren't (they hallucinate the chart itself, which is the whole point).

Stack: GitHub Pages + Cloudflare Worker + Claude Haiku 4.5 + Lemon Squeezy + n8n + Resend. 1-person, mostly free tier.

Site: https://hoonsikim.github.io/saju
MIT: https://github.com/hoonsikim/saju
```

---

## F. X (Twitter) thread — 5 tweets

**1/5**:
```
I built a Korean Saju (Four Pillars of Destiny) reader as a side project.

Free chart in 20 languages + optional $7 AI Deep Reading.

The interesting design choice: split deterministic chart from stochastic LLM interp. 🧵
```

**2/5**:
```
ChatGPT / Claude custom GPTs for BaZi or Saju are popular but have a hidden flaw: they hallucinate the actual chart (天干·地支 calculations) because LLMs don't have ephemeris data.

I keep the chart deterministic (lunar-javascript, MIT, browser-side) and only use the LLM for the 2,500-3,500 word interpretation layer.
```

**3/5**:
```
Stack:
- GitHub Pages (site)
- Cloudflare Worker (Claude Haiku 4.5)
- Lemon Squeezy (Merchant of Record)
- n8n + Resend (email delivery)

All 1-person, mostly free tier.

20 languages with full RTL for Arabic. About page documents methodology, classical sources, AI model card.
```

**4/5**:
```
The site is intentionally non-personal-brand. No TikTok influencer mode, no Instagram, no public face.

Solo operator in Seoul. $7 one-time digital product, no subscription.

Looking for feedback from BaZi/Saju practitioners + AI tool evaluators + product/SaaS folks.
```

**5/5**:
```
Site: hoonsikim.github.io/saju
Code: github.com/hoonsikim/saju (MIT)
About: /about (4 langs: en/ko/ja/zh)
Methodology + sources + model card: /about/#methodology

What would you cut? What feels off? Where does the "chart deterministic / interp LLM" disclosure not land?
```

---

## 채널 우선순위 + Launch 시점

| # | 채널 | 우선순위 | 최적 timing (KST) | 사령 권고 |
|---|---|---|---|---|
| **A** | HN Show HN | **1순위** (가장 큰 spike potential) | 화·수·목 **20-22 KST** (US East morning) | KYC 통과 후 첫 화/수/목 |
| **B** | Reddit r/asianastrology | 1순위 (engaged niche) | HN 같은 day, 같은 timing | A와 동시 |
| **C** | Disquiet 한국어 | 1순위 (KR 사용자 cluster) | 평일 KST 10-12 또는 21-23 | A와 동시 또는 다음 day |
| **D** | Indie Hackers | 2순위 (solo dev tribe) | 평일 미국 morning | 24h 후 (HN burst 끝난 후) |
| **E** | Reddit r/SideProject | 2순위 (general dev) | 같은 timing | 24h 후 |
| **F** | X thread | 3순위 (low organic, follower 의존) | 평일 KST 21-23 | 48h 후 (HN spike 후 자체 traffic 있을 때) |

**Day 1 burst (KYC 통과 직후)**: A + B + C 동시 launch → 24h 모니터링 → KV `/track` 데이터 확인
**Day 2-3**: D + E + F 단계적 launch (Day 1 피드백 반영 후)
**Day 7+**: 첫 후속 글 (e.g. "Show HN: Saju — week 1 results, here's what HN said and what I changed")

---

## 사용자 협조 필요한 마케팅 채널 access

각 채널 계정 확인 필요:

| 채널 | 사용자 계정 보유? | Notes |
|---|---|---|
| Hacker News | ❓ | 계정 카르마 < 50이면 Show HN 노출 약함. 새 계정이면 1-2 댓글로 카르마 빌드 먼저 |
| Reddit | ❓ | 신규 계정은 r/asianastrology 새 글 막힘 가능 (가입 후 N일 + 카르마 X) |
| Disquiet | ❓ | 한국어, 1인 메이커 community. 가입 즉시 글 가능 |
| Indie Hackers | ❓ | 가입 즉시 글 가능 |
| X (Twitter) | ❓ | follower base 의존, low ROI unless 사용자 follower ↑ |
| Reddit r/SideProject | ❓ | 같음 |

→ 사용자가 어떤 계정 보유했는지 알려주시면 그에 맞춰 1순위 선정. 신규 계정이면 카르마 빌드 시간 필요.

---

## 보조 채널 (장기, 별도 작업)

- **SEO**: "free saju calculator", "korean four pillars calculator", "bazi 8 characters free" 등 long-tail keywords + sitemap.xml + 각 lang hreflang
- **Substack**: "Korean Saju for skeptics" 1주 1편, 무료 newsletter — Sarah 페르소나 직접 target
- **YouTube short**: Day Master archetype 10개 짧은 영상 시리즈 (사령 못 함, 사용자/AI 영상 도구)
- **TikTok**: 사용자 의도상 보류

---

**다음 액션**: 사용자가 마케팅 채널 access 알려주시면 사령이 Day 1 launch order 확정 + 모니터링 셋업.
