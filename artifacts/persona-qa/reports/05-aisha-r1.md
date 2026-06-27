# Persona QA Report — 05 Aisha

## 1. 자기소개 (1줄)
24세, 두바이 디자인 학생, iPhone 14 Safari (UAE 5G), 새벽 1시 침대에서 IG mystic reel → link 클릭, 동기는 love.

## 2. competitor 기준 (1줄)
나는 평소 AstroSage Vedic (kundli 무료, 영어/힌디 + 인도언어 다수) + Co-Star app (검정 배경 + 흰 산세리프 Gen Z 미학 + 친구 차트 비교)을 비교한다.

## 3. 7-Stage Walk-Through

### 3.1 Landing (30초)
- 첫인상: `?lang=ar`로 들어왔는데 페이지가 **그대로 영어 + 한자**다. URL 파라미터가 무시되고 LTR 그대로. "Your fate, in the language Korea has used for 1,000 years" 영문 헤드라인이 화면 왼쪽 위에 정렬돼 있는데 — 아랍어 native인 나한테는 광고에서 본 mystic 분위기가 0초 만에 깨진다. "Authentic Korean Four Pillars · not Western astrology pretending to be Eastern" 문구는 영어 능숙해서 읽기는 되지만, IG에서 본 reel은 영어였어도 사이트에서 자국어가 안 뜨면 *그 다음에 가입할 곳이 아니다* 라는 신호.
- painpoint: severity **5 (즉시 이탈 후보)** — RTL 미적용 + Arabic string 0개. 광고가 영어였어도 두바이 24세는 Instagram에서 native 언어 UI를 기대.
- delight: 거의 없음. 가장 그나마는 무료 + no signup 문구 — 새벽 1시 침대에서 카드 안 꺼내도 된다는 신호는 살아남음.
- 이탈 결정? **No (간신히)** — design 학생 호기심 + 검정/금 톤 가능성 + 일단 무료니까 30초만 더. 일반 아랍어 사용자라면 이미 이탈.

### 3.2 Input
- iPhone 14 Safari에서 form 3칸 (Birth date / Birth time (local) / Gender) + optional Birth city. 라벨 영어. native iOS date picker일 가능성 — 그건 다행 (Co-Star도 native 씀).
- painpoint: severity **3 (한숨 + 계속)** — UAE는 일/월/년 순서인데 영어 페이지에서 month-first 가능성 (`MM/DD/YYYY` 패턴). 실제 인풋이 어떤 순인지 source에서 명시 안 됨 → 확신 못함이 이미 painpoint. "Birth time (local)" 의 "local" 의미가 UTC 보정인지 출생지 시간인지 처음 BaZi 만나는 나로선 불명. 두바이는 GMT+4, 만약 입력값이 시스템 시계 기준이면 한국 시간 보정이 어떻게 되는지 불안.
- delight: signup 없이 바로 입력 — Co-Star는 첫 화면부터 이메일 + 친구 connect 강제, AstroSage는 회원가입 push. 이건 +1.
- 이탈 결정? No — 새벽 1시 호기심이 강함.

### 3.3 Rendering (무료 결과)
- 4 Pillars (Year/Month/Day/Hour) + Five Elements Balance + Day Master + Void status + Auspicious Stars (神煞) + 2026 Year (歲運) + Major Luck (大運) + Reading summary. **한자가 영어 사이에 그대로 노출** — 처음 BaZi 보는 24세 디자인 학생한테 神煞 같은 글자는 그냥 "decorative glyph"이고, 의미를 모름. 영문 짧은 가이드도 jargon에 그쳐 ("Day Master" 옆 1줄 설명도 약함).
- painpoint: severity **4 (짜증)** — "Day Master"가 뭔지, "Void"가 좋은 건지 나쁜 건지, 神煞이 별인지 신인지 첫 단락에서 안 풀어줌. Co-Star가 jargon ("Mercury Retrograde") 옆에 풀어쓴 setup 문장을 항상 붙여주는 것에 비해 -2.
- delight: 검정 텍스트 + 미니멀 layout은 Co-Star 미학과 통함. screenshot 했을 때 톤은 IG story에 어울릴 가능성.
- 이탈 결정? Yes/No 경계 — 5번째 섹션쯤에서 스크롤 멈춤 가능성.

### 3.4 Upsell ($7 paid CTA)
- "Deeper LLM Reading · $7" (1500-word PDF, 5 life areas) + "Compatibility · $7 per pair". 가격은 AED로 환산하면 약 25 디르함 — Co-Star Plus가 월 $5.99 (subscription)인 데 비해 single $7는 비교 못할 정도는 아니나, *LLM이 쓴 PDF* 라는 disclosure가 회의를 일으킴. 나는 디자인 학생이고 ChatGPT 일상 사용. LLM = "내가 직접 prompt하면 공짜" 인식.
- painpoint: severity **4** — payment_anchor 3 (가격 합리적 + reading 깊으면 결제) 기준에서 *지금까지 본 무료 reading의 깊이가 결제 가치를 입증 못함*. 그리고 결제 페이지 통화가 USD 단일일 가능성 — UAE 카드 (Mashreq/ENBD) USD 결제는 forex fee + SMS 인증으로 새벽 1시에 귀찮음.
- delight: Lemon Squeezy 사용 — Stripe보다 신뢰도 낮지만 GCC에서 카드 거부율 낮음 들었음. 정보 +0.5.

### 3.5 Paid email (가설)
- "결제 후 email 받으면 만족할 조건":
  1) 1500 단어 중 최소 절반이 **나의 입력값 (birth date + love motivation)** 에 정말 묶여 있어야 함 — generic horoscope text면 즉시 환불 요청.
  2) love 동기 선택했으니 *호환 별자리/궁합 framework* 가 specific 인물 가능성 시나리오로 와야 함 (e.g. "당신 Day Master는 wood, 잘 맞는 partner는 fire/earth Day Master").
  3) PDF가 아랍어로 오면 결제 가치 +3, 영어로만 오면 +0 (이미 영어로 입력했으니).
- 가설 결제 의향: **3/10** — anchor 정의 "다시 와서 결제" 수준. 새벽 1시 즉결 X, but 다음날 친구한테 보여주려고 다시 와서 결제 가능성.

### 3.6 Share
- 채널: Instagram DM (close friends 3-4명).
- "Download share card" + "Copy share text" 두 옵션 있음 — 핵심 viral 자산. **하지만 share card 디자인을 source에서 확인 못함 — RTL/아랍어 미지원 사이트가 만든 share card가 IG story에서 어떻게 보일지 불안**. text-heavy minimal 미학은 Co-Star DM 스크린샷 트렌드 (검정 배경 + 한 줄 문장) 와 통하지만, 한자 4 Pillars가 카드 가운데 박혀 있으면 "이게 뭐야?" 질문 들어옴 = 설명 부담 = share 안 함.
- painpoint: severity **3** — share card 자체 존재는 +, 하지만 아랍어 친구한테 "한자가 뭐냐"를 매번 설명해야 하면 -.

### 3.7 Return
- hook 없음. 매일 daily pillar push 같은 게 보이지 않음 (Co-Star 강점). About 페이지에 newsletter signup도 source에서 확인 안 됨. login도 없으니 다시 와도 birth data 재입력 — UAE 24살 침대 사용자한테 마찰.
- painpoint: severity **4** — return reason zero.

## 4. Core Dim Deep Evaluation

### 4.1 ar_RTL_layout (RTL 정상?)
**완전 실패.** WebFetch로 확인: `?lang=ar` URL param이 페이지에 어떤 변화도 일으키지 않음. `dir="rtl"` 속성 없음. 본문 strings 100% 영어 (또는 한자). language switcher에 "العربية" 가 20번째 옵션으로 나열돼 있지만 — 이건 **placeholder, 실제 번역 0%**. 클릭 시 페이지가 *그대로 영어로 다시 그려질 가능성*이 매우 높음 (혹은 빈 화면). About 페이지에서 운영자 본인이 "20 languages" 라 광고하지만 실제 ar는 미구현. → 이건 단순 "fallback 부족"이 아니라 **광고 오인**. payment_anchor 3 인 나는 이 시점에서 결제 의향 -3 깎임. competitor AstroSage도 Arabic 본격 지원 X (Hindi/Tamil/Bengali 위주), Co-Star는 영어 전용. 그러니 *시장 공백을 노릴 좋은 기회였는데 사이트는 잡지 못함*.

### 4.2 privacy_birth_data (UAE GDPR 의식)
About 페이지 + Terms 페이지에서 "Your birth data is processed entirely in your browser. We don't store it on our servers, don't sell it, don't share it" 명시 — 이건 GCC 의식 높은 24살에게 +2 강점. UAE PDPL (2021년 시행) 별도 명시는 없지만 EU Directive 2011/83/EU 언급 + jurisdiction = Korea 명시. Lemon Squeezy로 이메일+결제만 retain. 단점: **retention period 미명시** ("Not explicitly stated") — Terms 빈틈. UAE 사용자는 "내 데이터 보관 N개월" 같은 명시를 요구. 이거 없으면 trust -1.

### 4.3 motivation_love_매칭
input form에서 Reading style selector에 General/Career/Love 분기는 있음 — 좋음. 하지만 **무료 reading에서 love 선택이 실제로 다른 결과를 주는지 source상 확인 안 됨**. "Day Master" 가 connect 가능한 partner archetype 까지 첫 화면에서 풀어주면 viral hook, 안 풀어주면 그냥 일반 사주 + label change. payment 본 1500 단어 PDF에 5 life areas 들어간다 했는데 love가 그중 1개일 가능성 — 즉 무료에서는 love-specific depth 거의 없을 것. 첫 BaZi인 나로선 "compatibility · $7 per pair" 가 더 직관적이지만, 그건 상대방 생년월일 알아야 함 → 새벽 1시 침대에서 ex 생일 정확히 모름 → conversion 0.

### 4.4 first_BaZi_onboarding
"Day Master" 가 무엇인지 처음 보는 사람한테 **1문장도 풀어주는 setup 없이** 결과창에 등장. 神煞·歲運·大運 같은 한자가 영문 화면에 그대로 박혀 있음 — Co-Star도 점성 jargon 쓰지만 항상 plain English 풀어씀 ("Your Sun in Aries means..."). AstroSage Vedic도 Sanskrit 용어 옆에 영문 1줄 설명. 우리 사이트는 jargon-first, explain-later 구조. 디자인 학생인 나는 visual hierarchy로 "Day Master = 가장 큰 글자" 같은 단서 잡을 수 있지만, 평균 24살 GCC 사용자는 4 pillars 그리드 보고 즉시 "복잡 / 닫기" 가능성. severity **4**.

### 4.5 IG_share_potential (story 미적 가치)
미니멀 검정 텍스트 + 광고 없음 + 한자 grid = Co-Star가 viral 끌어낸 *exact* 미학과 통함 — 이건 +. 하지만 (a) share card 실제 design 미확인, (b) 한자가 아랍어 친구에게 "decorative oriental" 정도로만 읽힘 → 호기심 +, 의미 -, (c) RTL 미지원이면 share card도 LTR로 떠서 IG Arabic feed에서 "outsider" 느낌. Lily(persona 12) 같은 영어권 mystic creator라면 +2지만, 두바이 친구 단톡에 던지기엔 **아랍어 caption 직접 써야 하는 부담**. 결국 viral 충동 score 3 (기억만, 5분 내 메시지 X).

## 5. 동기 만족도
점수: **3/10**
이유: love 동기로 들어왔는데 (a) 무료 reading에서 love-specific 깊이가 표면적, (b) 한자 jargon 때문에 인지부하 ↑, (c) compatibility는 상대방 생년월일 필요 — 즉 새벽 1시 침대 사용자한테 답을 주는 흐름이 끊김. anchor "약함" 에 일치.

## 6. 친구 공유
- 공유 채널: Instagram DM (close friends 3-4명)
- 보낼 메시지 텍스트 (1-2줄):
  "شفتي ده الموقع الكوري؟ يقولك حظك بحسب اليوم اللي اتولدتي فيه — بس كله إنجليزي للأسف 😅"
  (= "이 한국 사이트 봤어? 태어난 날 기준으로 운세 나오는데, 다 영어라 좀 아쉽네 😅")

  → 즉 "신기한데 너 영어 되면 해봐" 라는 *demote된 공유* — Co-Star DM 공유 ("look at this savage horoscope") 같은 confidence 0.

## 7. 이탈 지점
- Yes/No: **Yes**
- 어디서: stage 3.3 (Rendering) 후반 ~ stage 3.4 (Upsell) 앞
- 왜: `?lang=ar`로 들어왔는데 페이지 100% 영어 + 한자 → 30초 한숨. 호기심으로 input까지 진행했지만 free reading 4-5 섹션 스크롤 후 "Day Master 가 뭐고 神煞 가 뭔지" 풀어주는 setup 없고 $7 LLM PDF 결제 push가 너무 빨리 옴. 새벽 1시 졸음 + 결제 마찰 = tab 닫음.

## 8. 결제 의향
- 점수: **2/10**
- 행동 기준 (anchor): "다시 와서 결제 (3) 와 절대 X (0)" 사이. 즉 이번 세션 결제 X, 추후 회상 가능성 낮음.
- 이유: payment_anchor 카드값 3 (가격 합리적 + reading 깊으면 결제) 보다 더 낮춤. 이유 3개: (1) RTL/아랍어 0% — 사이트가 *나를 customer로 안 본다는 신호*. (2) free reading 깊이가 $7 PDF 가치 입증 못함. (3) USD 결제 + Lemon Squeezy 새벽 1시 OTP 마찰. payment_anchor 3 → 실 2로 -1.

## 9. 개선 제안 Top 3 (Aisha 시각, actionable)

1. **language switcher에서 "العربية" 옵션 제거하거나, 최소 Right-To-Left CSS + landing/input/upsell 3페이지 ar string 우선 번역.** 현재 placeholder만 있고 클릭하면 사이트가 그대로 영어로 떠서 — 이건 "20 languages supported" 광고 (about 페이지) 와 실측 불일치 = trust 즉시 0. 빠른 fix는 dropdown에서 미구현 언어 회색 처리 + "coming soon" 툴팁. 본 fix는 `<html lang="ar" dir="rtl">` + landing/input/upsell의 약 30 string i18n key 추가.

2. **무료 rendering 첫 화면에 "What is Day Master?" 1-3문장 plain-language setup carousel 삽입** (영어 우선, 추후 ar). 현재는 jargon-first로 결과 던지고 끝 — Co-Star가 매 horoscope에 "Mercury Retrograde means..." 풀어쓰듯, 우리도 "Day Master = the elemental archetype of your core self, like a zodiac sign but based on your birth day" 한 줄을 4 Pillars 위에 sticky로 띄울 것. 神煞/歲運/大運 한자 옆에는 hover tooltip (mobile은 tap) 으로 "Auspicious Stars / Year Cycle / Major Luck" 풀어쓰기.

3. **share card 디자인을 RTL/아랍어 caption 지원 + Day Master 1줄 + 4 Pillars 시각 단순화한 IG story 9:16 비율로 별도 생성.** 현재 share는 text-copy + generic card 추정 — IG DM 공유 친화 X. 구체: (a) 9:16 1080x1920, (b) 상단 Arabic caption slot ("نتيجة سَجو الكورية لـ {Day Master}"), (c) 4 Pillars는 한자 + romanization + 영문 element 색상 dot, (d) 하단 "saju.gg/?lang=ar" QR. Co-Star/The Pattern DM 스샷 점유율과 직접 경쟁할 자산.

---

Sources (competitor):
- [Co-Star App Review 2026 — Aurae](https://www.auraeastrology.com/blog/co-star-app-review-2026-an-astrologers-honest-opinion)
- [Co-Star Astrology; How Astro-Nerds Dominated Design — Medium](https://medium.com/@jpinkos/co-star-astrology-how-astro-nerds-dominated-design-e04f705e96dc)
- [AstroSage Free Birth Chart](https://www.astrosage.com/freechart/)
- [AstroSage Kundli AI Astrology App](https://play.google.com/store/apps/details?id=com.ojassoft.astrosage)
