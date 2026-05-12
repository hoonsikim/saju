# P003 Saju Global — Plan

## Mission

한국 사주(四柱)를 글로벌 시장에 진짜 한국 방식으로 — AI-powered, 4언어, 비대면 자율 운영.

## Why this works (vs P001/P002)

| 축 | P001 (Korean Claude Code 가이드) | P002 (claude-code-kr-skills) | **P003 Saju 글로벌** |
|---|---|---|---|
| 시장 규모 | 한국 dev 약 100만 | 한국 dev 약 100만 | 전 세계 호기심 인구 수십억 |
| 한국 차별화 | 한국어 자료 갈증 | 한국 API 보일러 | 한국 전통 자체 = 컨텐츠 |
| 결제 진입 마찰 | Gumroad에 한국 dev 안 옴 | OS, payment X | Stripe/Polar/LS — 글로벌 일반 |
| 객단가 | $14~19 단발 | $0 (free OS) | $5~9 reading · $9/mo 구독 |
| 입소문성 (virality) | 낮음 (PDF 공유 안 함) | 중간 (GitHub star) | **높음 (사주 결과 공유 = TikTok/Insta) |
| AI-native | 본문 작성 | skill seed | **reading 자체가 LLM 생성** |
| 진입 ETA | 7-10일 | 4-8주 | 2-5일 MVP |

## MVP scope (D+1 → D+3) — 압축 타임라인

원래 D+10 잡았던 건 P001 잔재. Saju는 calendar lib + LLM API 호출이면 끝 — D+3 live free reading 가능.

### Phase 1 — 계산 엔진 (D+1 오늘 ~ D+2 새벽)
- 한국 만세력(萬歲曆) 알고리즘 (정밀 calendar conversion)
- 입력: 생년월일시 + 위치(city → timezone)
- 출력: 4 pillars (Year/Month/Day/Hour) — 천간(天干) 10개 × 지지(地支) 12개
- 5행(五行) 비율 자동 계산
- 10신(十神) 자동 라벨링
- 대운(大運) 10년 주기 자동 계산
- 라이브러리 후보: `lunar-javascript`, `saju.js`, 직접 구현
- 검증: 한국 만세력 공식 사이트 결과와 cross-check

### Phase 2 — Reading 생성 (D+2)
- Cloudflare Worker (무료 100k req/day)
- 입력: 4 pillars + 5행 + 10신 + 대운 + 사용자 선택 언어
- 처리: Claude API 호출 with Saju expert system prompt
- 출력: 600~1500자 reading (general / love / career / wealth / health)
- 캐싱: 같은 입력 → 같은 reading (deterministic with temperature=0)

### Phase 3 — Frontend wiring (D+2~3)
- Static HTML/CSS/JS
- 폼: 생년월일시·위치·언어·reading 종류(general/love/career)
- 결과 화면: reading + 5행 wheel chart + 4 pillars 시각화
- 다국어 i18n: 1 source → EN/KO/JA/ZH (i18n JSON)
- 모바일 first

### Phase 4 — 다국어 (D+3~5, free reading 라이브 후 즉시)
- Master 프롬프트 1개 → 언어별 토큰 swap
- 검증: 각 언어로 같은 입력 → 의미 동일한 reading 확인
- 언어 detection: 브라우저 locale 기반 + 수동 toggle

### Phase 5 — 공유 + 결제 (D+7)
- Result share card (Cloudflare Worker 이미지 생성)
  - 사용자 4 pillars + "Saju says ..." 1줄 hook + saju.<domain>
- Premium tier: Polar.sh or Lemon Squeezy
  - $5 detailed reading (1500+ chars + 5 categories)
  - $9/mo membership (monthly readings + compatibility tool)

## 자율 운영 룰

- cron work-tick: 매 fire = 1 chunk (다음 phase의 next sub-task)
- revenue-tick: 매일 신호 측정 (visitors, readings completed, paid conversions)
- 사용자 협조 = 0 default. payment 셋업 시점에만 (Polar.sh OAuth via gh? — 가능)

## 경쟁 인텔리전스

| Service | 모델 | 한계 |
|---|---|---|
| Co-Star | Western astrology | Saju 아님 |
| The Pattern | Western astrology | 같음 |
| Cafe Astrology | Western 전통 | 같음 + 올드 UX |
| 만세력 (Korean) | Saju 정확 | 한국어 only + 올드 UX + 공유 X |
| ChatGPT 사주 prompt | LLM | UX 0, 공유 X, 일관성 X |
| Pyathon natal chart libs | Calculation only | Reading 없음 |

**우리 angle**: 한국 정통 사주 + 모던 UX + AI reading + 공유 카드.

## Risks

- Calendar conversion 정확성 (특히 시간대 경계) — 라이브러리 검증 필수
- LLM reading의 일관성 — temperature=0 + 잘 짜인 system prompt 필수
- "한국 권위" 클레임 — 정통성 보장 어디서? → 한국 명리학 기본 교재 reference 명시
- Payment 처리 결국 KYC 1회 필요 — Polar.sh가 가장 light (가능하면)

## Success metric (90일)

- D+30: 일일 reading 100개, email 가입 200명
- D+60: 일 매출 $30 (일 1만원 hit)
- D+90: 월 $1500 (median indie maker level)
