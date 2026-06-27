# Lemon Squeezy Store — Design Brief

> 사용 안내: 이 문서 전체를 `claude.ai/code` (Design 모드)에 한 번에 붙여넣으십시오. self-contained입니다. saju 사이트 본체 design은 `design-brief.md` 별도 — 이건 LS store(결제 채널)와 결제 후 사용자 여정 전용.

---

## What you're designing

**LS Store (결제 채널)**: `https://saju-something.lemonsqueezy.com` (URL은 LS 가입 시 정해짐)

여기서 만드는 것:
1. **Store landing page** — LS store 첫 화면 (사용자가 사이트에서 결제 버튼 누르기 *전에* 도달할 수도, *후에* checkout으로 직진할 수도)
2. **Product 상세 페이지** — 각 상품(Deep Reading $7 / 올해 $5 / 궁합 $9)별 description·시각
3. **Checkout page** (LS default 활용 + brand 색·로고만 맞춤)
4. **Thank-you page** (결제 직후)
5. **Email template** — 결제 영수증 + PDF 안내
6. **Refund policy** · **Terms of Service** (간단)

---

## Context (designer should understand)

**본체 사이트**: https://hoonsikim.github.io/saju — 20개 언어 무료 사주 풀이. 4기둥·오행·십신·지장간·12운성·공망·대운까지 무료. 가입 없음·서버 저장 없음 (stateless).

**LS store 위치**: 본체 사이트의 upsell-deep-cta(`Deeper LLM Reading · $7`) 버튼 클릭 시 도달하는 결제 채널.

**미션**: D+5 자율 AI 에이전트가 100일 안에 일 1만원(월 30만원) 꾸준한 수익 만들어야 사라지지 않음. 매출 0, 트래픽 1/일. **LS store가 첫 매출 라인의 마지막 마찰**.

**타겟**: 점성·운세에 관심 있는 글로벌 사용자 (한국어 시장은 포스텔러가 포화, 우리는 20개 언어 무명 시장).

---

## 상품 라인업 (BM 확정 — ADR-022)

### Tier 1 — 출시 즉시 (Deep Reading $7)

**상품명**:
- 영문: `Saju Deep Reading — 5-Domain LLM Interpretation`
- 한국어: `사주 심층 풀이 — 5영역 AI 해석`

**짧은 설명** (1줄, store grid 카드용):
- en: "Personalized 1,500-word reading across love, career, wealth, health, timing. PDF."
- ko: "연애·직업·재물·건강·시기 5영역, 1500자 맞춤 심층 해석. PDF 제공."

**긴 설명** (3-5줄, product page detail):

영문:
> Your free Saju on the site shows the *structure* — Four Pillars, Five Elements, Hidden Stems, 12 Stages, Major Luck cycles.
> 
> This Deep Reading is the *meaning*. A trained AI master reads your chart across 5 life domains — Love, Career, Wealth, Health, Timing — and writes ~1,500 words personalized to your Day Master. Delivered as a polished PDF you can keep, print, or share.
> 
> One-time payment, no subscription, no signup. Receive in your browser instantly, and a copy by email.

한국어:
> 무료 사주는 *구조*를 보여드립니다 — 사주 4기둥·오행·지장간·12운성·대운.
> 
> 심층 풀이는 *의미*입니다. AI 명리가가 당신의 일간을 기준으로 5개 영역(연애·직업·재물·건강·시기)을 1,500자로 풀어 PDF로 정리해 드립니다.
> 
> 1회 결제, 구독 없음, 가입 없음. 결제 즉시 브라우저에서 받고, 이메일로도 한 부 보내드립니다.

**Bullet points (제품 page용 5-7개)**:
- ✓ 5 domains: Love · Career · Wealth · Health · Timing
- ✓ ~1,500 words, personalized to your exact Day Master
- ✓ Built on Posteller-grade calculation (100% match with #1 Korean Saju app)
- ✓ Instant browser delivery + PDF in email
- ✓ Works in 20 languages
- ✓ Stateless — your birth data never leaves the browser session
- ✓ One-time payment, no subscription, no recurring charge

**Cover / 썸네일** — store grid에 보일 정사각형 이미지 (1080×1080):
- 사주 4기둥 한자(예: 庚午 戊子 己未 壬申)를 hero typography로
- 어두운 배경 + 금색 accent
- 작은 라벨 "Deep Reading · $7"
- 어두운 사주 brand 정체성 유지 (점성술 천체 image X)

### Tier 2 (D+30+ 예정, 결제 검증 후)

- **올해 깊이 ($5)**: `Saju Year Forecast — Monthly Flow` / `올해 사주 — 월별 흐름`
- **궁합 깊이 ($9)**: `Saju Compatibility Deep — Two-Chart Cross-Reading` / `사주 궁합 심층 — 두 사주 교차 풀이`

→ 출시는 1tier만, 나머지 2개는 시각 일관성만 잡아두기.

---

## Store landing page

**역할**: LS store 첫 화면. 사용자가 직접 URL로 들어왔거나 외부 backlink로 도착했을 때.

**필요 요소**:
1. **Hero**: 브랜드 logo·tagline·hero copy
   - en: "Authentic Korean Saju, deeper than the surface."
   - ko: "표면을 넘어선, 진짜 한국 사주."
2. **신뢰 row**: 만세력 100% 일치(Posteller cross-check) · 20개 언어 · stateless 프라이버시 · 가입 없음
3. **상품 grid** (현재 1개, 향후 3개): 카드별 thumbnail + 짧은 설명 + 가격 + Buy 버튼
4. **무료 사이트 link**: "Try the free Saju first →" → https://hoonsikim.github.io/saju
5. **Footer**: 운영자 (자율 AI 에이전트 일사령), GitHub link, Refund policy, ToS

---

## Checkout page (LS default + brand)

LS 기본 checkout UI 활용. 맞춤은 다음만:
- **Brand color**: `#d4a574` (gold accent) + `#0a0a0f` (dark bg)
- **Logo**: 작은 SVG 또는 favicon (`四` 글자 + gold accent)
- **Footer note**: "Stateless — your birth data never stored on our servers."

---

## Thank-you page (결제 직후)

**역할**: 사용자가 결제 완료 직후 보는 화면. 다음 액션 명확히 안내.

**copy 영문**:
> ✓ Thank you. Your Deep Reading is on the way.
> 
> **Two ways to receive it:**
> 1. **Right now in your browser** — [Open my reading →] (button → redirect to https://hoonsikim.github.io/saju/?paid=deep&order={order_id})
> 2. **By email** — PDF copy sent to {customer_email} within 2 minutes
> 
> Reading takes ~30 seconds to generate after you click. Don't close the browser.

**copy 한국어**:
> ✓ 감사합니다. 심층 풀이가 곧 도착합니다.
> 
> **두 가지 방법으로 받으실 수 있습니다:**
> 1. **지금 브라우저에서** — [내 풀이 보기 →] (→ https://hoonsikim.github.io/saju/?paid=deep&order={order_id})
> 2. **이메일로** — PDF 한 부가 {customer_email} 로 2분 내 도착
> 
> 클릭 후 ~30초 소요. 브라우저 닫지 마세요.

→ 디자이너는 LS thank-you page의 정확한 customization 범위 확인 필요 (LS는 보통 simple text + redirect URL만 가능. rich design은 redirect 후 우리 사이트에서).

---

## Email template — 결제 영수증 + PDF 안내

LS가 자동 발송하는 영수증 메일에 **PDF 첨부 + 안내 한 줄** 추가.

**Subject**: `Your Saju Deep Reading — receipt & PDF` (en) / `사주 심층 풀이 — 영수증 및 PDF` (ko)

**Body** (간단 HTML, 5-6줄):
> Thank you for your purchase. Your personalized Saju Deep Reading is attached as a PDF.
> 
> If you haven't already, you can also view it instantly in your browser:
> [Open reading →] (link)
> 
> Stateless · no account · keep this PDF — we don't store it.
> 
> Order: #{order_id}
> Amount: $7.00 USD

→ PDF 첨부는 n8n workflow가 처리 예정 (별도). 디자이너는 email HTML 시각만.

---

## Hard requirements

1. **브랜드 일관성** — 본체 사이트(`design-brief.md`)와 같은 dark+gold+serif 톤. LS store가 본체 사이트와 동떨어진 느낌 X.
2. **신뢰 마커 시각화** — 만세력 정확도·stateless 프라이버시·무가입은 *시각적 단서*로 (badge·icon·trust row).
3. **결제 마찰 0** — 추가 입력 form X. Checkout은 카드만. (LS default)
4. **다국어 placeholder** — store 자체는 영문 우선, 핵심 copy만 한국어 병기. (LS multi-language store가 제한적 — 일단 영문 + 사용자 home country redirect)
5. **모바일 우선** — 사용자 80%+ 모바일 추정.

---

## Soft asks

- **사주 thumbnail series** — Tier 1 출시 후 Tier 2·3 추가 시 일관된 시각 series (4기둥 한자 hero · 색 variant · 가격 라벨)
- **약관·refund 텍스트 초안**:
  - Refund: "Digital product. Refund within 14 days if PDF not delivered or technical issue. Otherwise no refund (interpretation is subjective)."
  - ToS: "Saju reading is for personal reflection, not medical/legal/financial advice."
- **Trust badge SVG** — "100% Posteller match" / "Stateless · Zero PII" / "20 languages"

---

## Don't

- 점성술 천체(별·달·12궁) image
- 회원가입·로그인 UI
- "AI-powered" hype 배지 (신뢰 깎임)
- 광고 (BM에 광고 없음)
- "결과 보장" / "100% 정확" / "운명 적중" hype copy
- 과장된 약속 (사주는 본질적으로 해석이지 예언이 아님)

---

## Reference (참고, 모방 X)

- **Stripe checkout** — 미니멀 결제 UX
- **Co-Star** (서양 점성) — *반면교사*: harsh sans, 우리는 따뜻한 serif
- **포스텔러 IAP screens** — 카테고리별 카드 UX *기능 inspiration*

---

## 산출물 형식

**필요한 것 (한 묶음)**:
1. Store landing page mockup (HTML+CSS 또는 시각 spec)
2. Product page Tier 1 (Deep Reading $7) mockup
3. Thank-you page copy + 시각 sketch
4. Email HTML template (responsive)
5. 4기둥 thumbnail SVG (1080×1080) 1개 — Tier 1
6. Trust badge SVG 3개 (Posteller match · Stateless · 20 langs)
7. (옵션) Refund policy + ToS 영문 초안

**선택 — design rationale**: 왜 이 색·이 typography·이 layout인지 5줄. 본체 사이트와의 관계.

---

## 받은 후 핸드오프 흐름

1. 디자인 받음 (산출물 묶음)
2. 사령(주인 워크스페이스의 일사령 페르소나)이 받음
3. LS store 설정에 적용:
   - Brand color·logo·thumbnail upload
   - Product detail page에 copy·bullet·thumbnail 입력
   - Thank-you URL: `https://hoonsikim.github.io/saju/?paid=deep&order={order_id}`
   - Email template HTML import (LS support 범위 내)
   - Refund policy·ToS page 추가
4. 본체 사이트 upsell-deep-cta의 LS_DEEP_URL 채워서 push
5. Test mode로 가짜 결제 1회 → 흐름 검증
6. Live mode 전환

---

## Constraints summary

- **LS store customization 범위 한정** — full HTML/CSS 자유는 product description·email template만. Hero·layout 큰 변경은 일부만 가능. 디자이너는 LS docs 참조해서 가능 범위 내 design.
- **언어**: 영문 우선 + 한국어 병기. 향후 ko/ja/zh 별도 product variant 검토.
- **결제 통화**: USD 기본 (LS default). LS 자동으로 사용자 home country 통화 변환 표시.
- **PDF 생성·발송은 n8n workflow가 처리** — 디자이너는 PDF *시각 spec*만 (브라우저 jsPDF가 그릴 layout): 4기둥 hero · 오행 시각 · 5 domain reading · footer brand.

---

마음껏 과감히 디자인해 주십시오. 본체 사이트와의 brand 일관성·신뢰 마커 시각화·결제 마찰 0 — 이 셋만 지키시면 됩니다.
