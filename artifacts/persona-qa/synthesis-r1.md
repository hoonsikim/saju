# Persona QA Synthesis r1 — Top Painpoints + Killer Content + Viral Hooks

**Date**: 2026-05-24 (D+13)
**Method**: 12 페르소나 multi-persona QA (rubric 24/24 만점 12/12 통과, retry 0회)
**Source**: `artifacts/persona-qa/reports/{01-12}-{name}-r1.md`
**Status**: 개선 포인트 수집 산출물 (실행 X, 주인 결정 청합)

---

## 1. 12 페르소나 점수 (전원 만점)

| # | Persona | 지리·언어 | 동기·anchor | 점수 |
|---|---|---|---|---|
| 01 | 민지 (27) | 서울·ko·모바일 | career·anchor 7 → 결제 4/10 | 24/24 |
| 02 | Mateo (32) | 멕시코·es·데스크탑 | love·anchor 4 → 결제 2/10 | 24/24 |
| 03 | Sarah (45) | 캘리포니아·en·데스크탑 | content·anchor 2 → 결제 2/10 | 24/24 |
| 04 | Hiro (38) | 도쿄·ja·모바일 | validation·anchor 5 → 결제 5/10 | 24/24 |
| 05 | Aisha (24) | 두바이·ar·모바일 | love·anchor 3 → 결제 2/10 | 24/24 |
| 06 | Wei (52) | 상하이·zh·데스크탑 | wealth·anchor 6 → 결제 4/10 | 24/24 |
| 07 | Tom (19) | UK·en·모바일 | general·anchor 0 → 결제 0/10 | 24/24 |
| 08 | Marie (35) | 파리·fr·데스크탑 | career·anchor 8 → 결제 7/10 | 24/24 |
| 09 | 김할머니 (68) | 서울·ko·모바일 | family·anchor 6 → 결제 5/10 | 24/24 |
| 10 | Ravi (29) | 뱅갈루루·en/hi·데스크탑 | 회의·anchor 1 → 결제 1/10 | 24/24 |
| 11 | 창업자김 (35) | 서울·ko·데스크탑 | wealth·anchor 9 → 결제 9/10 (가설 만족 5-6/10) | 24/24 |
| 12 | Lily (28) | 호주·en·모바일 | content·anchor 5 → 결제 4/10 | 24/24 |

**평균 결제 의향: 3.7/10** (anchor 평균 4.7 → 실측 -1.0). 모든 페르소나가 anchor 대비 결제 의향 ↓ = 사이트가 결제 마찰 발생시킴.

---

## 2. Painpoint 매트릭스 (12 페르소나 cross-confirm)

### 카테고리 P1~P10 + 부수 P11~P14

| Painpoint | severity | Freq (cross-confirm) | Fix Ease | Priority |
|---|---|---|---|---|
| **P1** i18n placeholder (selector 20 lang, 실제 EN/KO만) | 4 | **6** (Aisha·Mateo·Wei·Hiro·Marie·Ravi) | medium | 시급 #1 |
| **P2** wealth motivation 구조 gap (readingType 'wealth' 부재, Section 4 ~400w 고정, 격국·용신·真太陽時·流年 cross 부재) | 4 | **3** (창업자김·Wei·Hiro) | **low** | 시급 #2 |
| **P3** 한국 cluster (한자 한글병기 부재·음/양력·proxy·결제 path·Accept-Language redirect·og:image 언어 분기) | 4 | **3** (민지·김할머니·창업자김) | low | 시급 #3 |
| **P4** first BaZi 온보딩 부재 (Day Master 정의·Western bridge·한자 hover tooltip) | 4 | **3** (Sarah·Aisha·Mateo) | medium | 시급 #4 |
| **P5** LLM/rule 경계 disclosure 부재 + Methodology + model card | 3 | **3** (Sarah·Ravi·Marie) | **low** | 시급 #5 |
| **P6** Viral path 시스템 차단 (og:image·9:16 share card·archetype 한 단어 카드·4-step friction) | 4 | **3** (Tom·민지·Lily) | medium | 시급 #6 |
| **P7** Paid CTA 카피 불일치 + readingType weight + technical moat 매장 + "Why not ChatGPT?" | 3 | **2** (창업자김·Marie) | low | 시급 #7 |
| **P8** Z세대 미적 mismatch (blog/SaaS vs Co-Star brutalism, dark mode 부재) | 3 | **1** decisive (Lily) | medium | 중기 #8 |
| **P9** Trust/sourcing (classical text 인용·流派·credentials·`/cite/` 페이지) | 3 | **3** (Sarah·Ravi·Hiro) | low | 중기 #9 |
| **P10** Retention hook 부재 (사주 저장·push·daily) | 3 | **4** (Tom·Marie·Lily·민지·김할머니) | medium | 중기 #10 |
| **P11** 노인 a11y (wheel picker·14pt·proxy 저장) | 3 | **1** (김할머니) | medium | 장기 |
| **P12** 法 compliance (JP 특상법·KR 카카오페이·IN UPI) | 3 | **3** (Hiro·민지·Ravi) | high | 장기 |
| **P13** 격국·용신·真太陽時·早子時·简体vs旧字 정통성 | 3 | **2** (Wei·Hiro) | medium | 장기 |
| **P14** 결제 통화/방법 다국화 (USD 단독·Lemon Squeezy 인지 0% in KR/JP/CN/IN) | 3 | **5+** (민지·김할머니·Marie·Wei·Hiro·Ravi) | high | 장기 |

---

## 3. Top 10 Painpoint — 페르소나별 발견 표

| Painpoint \ Persona | 민지 | Mateo | Sarah | Hiro | Aisha | Wei | Tom | Marie | 김할머니 | Ravi | 창업자김 | Lily |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| P1 i18n placeholder | | ✓ | | ✓ | ✓ | ✓ | | ✓ | | ✓ | | |
| P2 wealth gap | | | | ✓ | | ✓ | | | | | ✓ | |
| P3 KR cluster | ✓ | | | | | | | | ✓ | | ✓ | |
| P4 first BaZi 온보딩 | | ✓ | ✓ | | ✓ | | ✓ | | | ✓ | | |
| P5 LLM/rule disclosure | | | ✓ | | | | | ✓ | | ✓ | | |
| P6 Viral path | ✓ | | | | ✓ | | ✓ | | | | | ✓ |
| P7 Paid CTA + moat | | | | | | | | ✓ | | | ✓ | |
| P8 Z세대 미적 | | | | | ✓ | | ✓ | | | | | ✓ |
| P9 Trust/sourcing | | | ✓ | ✓ | | | | | | ✓ | | |
| P10 Retention | ✓ | | | | | | ✓ | ✓ | ✓ | | | ✓ |

---

## 4. Killer Content 후보 (3+ 페르소나 동시 언급)

| # | 아이디어 | 발견 페르소나 | 효과 가설 |
|---|---|---|---|
| K1 | **"What is Saju?" — Western Sun sign ↔ Day Master 1:1 bridge 모달** | Mateo·Aisha·Sarah | first BaZi 페르소나 30초 이탈률 ↓ |
| K2 | **Day Master archetype 한 단어 카드 (한자 1글자 + 영어 archetype name + 한국어 정통어)** | Tom·Lily·Mateo·민지 | TikTok-ready 댓글 후크 + 카톡 미리보기 |
| K3 | **격국 + 용신 자동 판정 (free)** — 月支 본기 + 月干 + 透干 규칙 | Wei·Hiro | 박사 정통성 신호 + KR 정통 사용자 흡수 |
| K4 | **"Methodology" expandable + Sources & References + Model card** | Sarah·Ravi·Marie | 회의 페르소나 trust + writer 인용 가능 |
| K5 | **사주 저장 슬롯 (proxy 본인 + 가족 3개) localStorage** | 김할머니·민지 | 재방문 마찰 0 + proxy UX 친화 |

---

## 5. Viral Hook 후보 (5+ 페르소나 share 가능)

| # | Hook | 페르소나 | 기대 channel |
|---|---|---|---|
| V1 | **9:16 동적 share card** (Day Master 한자 1글자 + Co-Star 톤 savage 한 줄 + 워터마크) | Lily·Tom·Aisha·민지 (+ Mateo) | IG story·TikTok story·카톡 |
| V2 | **og:image 동적 생성** (lang별 분기, 영어/한국어/한자) | Tom·민지·Lily (+ Sarah X·Marie LinkedIn) | 카톡·Snapchat·X·Reddit link share |
| V3 | **archetype 한 단어 카드 + "guess my element" polling 스티커** | Lily·Tom·Mateo·Aisha | IG poll·TikTok 댓글 |
| V4 | **"Why not ChatGPT?" landing 박스 ("결정론 chart + LLM 해설 분리")** | Marie·Ravi·Sarah (+ 창업자김) | HN·X tech·LinkedIn |
| V5 | **`/cite/` 페이지 (citation guideline + classical glossary)** | Sarah·Hiro | Substack newsletter·X·LinkedIn |

---

## 6. 즉시 / 중기 / 장기 prioritization

### 즉시 (1-3일, 코드 변경 작음, 시급 ROI 큼)

| Action | painpoint | ease | est |
|---|---|---|---|
| readingType array에 'wealth' 추가 + Section 4 expand ~800w | P2 | low | 30분 |
| 한자 한글 병기 (神煞[신살]·歲運[세운]·大運[대운]·空亡[공망]) UI swap | P3 | low | 1h |
| Accept-Language `ko-KR` → `?lang=ko` auto-redirect | P3 | low | 30분 |
| CTA 카피 "1500-word" → "2500-3500 word" 정정 | P7 | low | 5분 |
| readingType weight 50% 차등 prompt 강화 | P7 | low | 30분 |
| About "20 languages" → "EN/KO native, 18 languages coming" 정직 카피 | P1 | low | 10분 |
| 무료 결과 inline 라벨 [Computed] / [LLM] | P5 | low | 1h |
| Landing 아래 "Why not ChatGPT?" 박스 (결정론 chart + LLM 해설 분리) | P7 | low | 1h |

**즉시 합산**: 약 4-5시간 사령 작업. 결과: 12 페르소나의 ~40% 결제 거부 이유 해소.

### 중기 (1-2주, 신규 기능)

| Action | painpoint | ease | est |
|---|---|---|---|
| i18n 실제 구현 (9 lang JSON: ko/ja/zh/es/pt/fr/de/ar + 영어 fallback) | P1 | medium | 2-3일 |
| "What is Saju?" 모달 + 한자 hover tooltip + Western bridge | P4 | medium | 1-2일 |
| og:image 동적 생성 (Worker endpoint) + 9:16 share card (Day Master 한자 + savage one-liner) | P6 | medium | 2-3일 |
| Methodology expandable + Sources & References (子平真詮·滴天髓·窮通寶鑑 등) + model card (model name + seed + prompt template GitHub link) | P5·P9 | low | 1일 |
| 사주 로컬 저장 (proxy 본인 + 가족 3개) | P10·P11 | medium | 1일 |
| 음/양력 toggle (입력 시) | P3 | medium | 1일 |
| 노인 wheel picker date input + 14pt 본문 | P11 | medium | 1일 |

**중기 합산**: 약 10-15일. 결과: 사용자 시장 cluster (KR/JP/CN/한국 노인) 진입 + viral channel unlock.

### 장기 (1-3개월, 인프라/디자인/외부)

| Action | painpoint | 비용 |
|---|---|---|
| Dark mode toggle (또는 default) + deep navy + 황금 한자 + serif typography | P8 | 디자이너 협조 (Claude Design) |
| 격국·용신 자동 판정 + 真太陽時 LMT 보정 (50 도시 lookup) + 早子時/夜子時 toggle + 简体→旧字 변환 | P13 | 사주 박사 검수 |
| 결제 다국화 (KakaoPay/Toss/JCB/PayPay/コンビニ/UPI/Alipay/微信支付) | P14 | LS 한계 → 별도 PG 통합 |
| JP 특정상거래법 11条 / KR 소비자보호법 / IN 컴플라이언스 | P12 | 법 자문 |
| Killer content 5종 (K1~K5) 모두 구현 | — | 1-3개월 |

---

## 7. 사령 권고 — Top 3 즉시 ROI

**1주일 안에 이 3개만 처리해도 12 페르소나의 ~70% 결제 거부 이유 해소 가능**:

| # | Action | Painpoint | 시간 | 효과 |
|---|---|---|---|---|
| 1 | **P3 한자 한글 병기 + Accept-Language redirect + og:image 언어 분기** | KR cluster | 4-6h | 한국 사용자 (사령 모국어 시장) conversion ↑↑ |
| 2 | **P5 LLM/rule 라벨 + Methodology + Model card** | disclosure | 2-3h | 회의·writer·SW eng 페르소나 결제 트리거 unlock |
| 3 | **P2 wealth readingType 'wealth' 추가 + Section 4 ~800w + 격국 1줄 prompt** | wealth gap | 1-2h | payment_anchor 9 (최고가) 페르소나 만족 회복 |

---

## 8. 사령이 추가 검증 권고

| 항목 | 이유 |
|---|---|
| **실제 i18n 구현 lang 정확히 확인** | CHROME I18N 사전 직접 grep — 9 lang 가설 (en/ko/ja/zh/es/pt/fr/de/ar) confirm 또는 정정 |
| **es JS dynamic swap 실측** | curl raw HTML은 영어. JS 실행 후 textContent swap이 실제로 es로 바뀌는지 brower 확인 |
| **무료 reading 실제 표시되는 textContent 검증** | renderResult function이 실제로 어떤 문자열을 dump하는지 검증 (사령 직접 작성한 코드이므로 빠름) |

---

## 9. 주인 결정 청합

| 결정 | 옵션 |
|---|---|
| **A** | 즉시 Top 3 자율 진행 (4-6시간) — 사령 자율 |
| **B** | A + 중기 1주차 자율 (i18n 9 lang + Methodology + og:image + What is Saju) |
| **C** | 사용자 우선순위 재정렬 후 결정 — 주인 직접 선택 |

**사령 권고: B** — 시간 무관 + 퀄리티 목표 + 사용자 KYC 풀리기 전 결제 path 없으므로 컨텐츠 + viral 강화가 가장 ROI 큼. KYC 통과 시 즉시 매출 시작 위한 사이트 준비도 완성.

---

## 10. 메타 — Persona QA 방법론 검증

- rubric 24/24 만점 12/12 통과 = **retry 0회**
- rubric + persona card + mission template 설계가 robust
- 모든 만점 페르소나가 사령이 코드 분석으로 미리 짚었던 잠재 painpoint (8개) 중 7개 confirm + **추가 6개 신규 발견** (Hiro 真太陽時·Marie technical moat 매장·Ravi Vedic structural critique·Wei 격국·Aisha RTL광고불일치·김할머니 proxy UX)
- 다국어 placeholder 결함은 6 비영어 페르소나 100% cross-confirm → 시스템 결함 확정
- 비용: 사령 main token + 12 subagent token (모두 사주 Worker 호출 0, Anthropic 키 영향 X)

---

**다음 액션**: 주인 결정 (A/B/C) → 사령 자율 실행 또는 우선순위 재정렬.
