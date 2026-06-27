# Persona QA Report — 11 창업자 김

## 1. 자기소개 (1줄)
35세 서울 SaaS 창업 1년차 (직원 3명), MacBook Pro M3 Arc browser로 늦은 밤 사무실에서 wealth motivation 사주를 진지하게 검증하러 왔다.

## 2. competitor 기준 (1줄)
나는 평소 명리 상담 전문가(1시간 100,000원, 1:1 대면 + 사주 5권 책 + 후속 follow-up)를 작년 한 번 받아본 사람이며, 그 경험을 기준으로 본다.

## 3. 7-Stage Walk-Through

### 3.1 Landing (30초)
- 첫인상: 헤드라인 "Your fate, in the language Korea has used for 1,000 years" + "Not Western astrology pretending to be Eastern. The real thing." — 카피는 정통성 angle 잘 잡았다. 다만 한국 SaaS 창업자인 내가 `?lang=ko`로 들어왔는데도 메인 헤드라인이 영어로 노출되는 점이 어색하다 (about에서도 영문 카피만 추출됨).
- painpoint: severity 2 — `?lang=ko`인데 일부 카피가 영어로 보임. 알아챘지만 무시는 가능. 다만 "한국 천 년" 마케팅하면서 한국어 페이지의 카피 일관성이 흔들리는 건 brand fit 측면에서 마이너스.
- delight: "Free. Instant. No signup." + General/Career/Love readingType 분기가 입구에 명시되어 있어서 "career 선택하면 사업 분석 깊어지나?" 라는 내 1차 호기심을 즉시 자극. 1시간 100,000원 명리상담은 약속 잡고 1주일 기다리는데 여기는 즉시 + 무료라는 점이 anchor 9 결제 의지를 더 키운다.
- 이탈 결정? No — 30초 안 이탈 없음. wealth 진지 검증 모드라 더 파볼 의지.

### 3.2 Input
- 첫인상: Birth date / Birth time / Gender(Prefer not to say · Female · Male) / Birth city (optional) / "Don't know your birth time? Use 12:00" 안내. 명리상담 전문가는 출생 시각 정확도를 1시간 내로 좁혀준 적 있는데, 여기서 "모르면 12:00 쓰세요"는 진지 검증 모드의 나에겐 정확도 회의를 일으킨다. 시진(子·丑·寅...) 모르면 평균값으로 때우는 건 paid $7 결과의 정확도 base를 흔든다.
- painpoint: severity 3 — Birth time 폴백 12:00은 free에선 OK지만 paid 결제 직전 안내가 또 나와야 한다. 한숨 + 계속.
- delight: City optional이라 사업 데이터 민감한 내가 일부러 비워둘 선택지가 있음. Arc browser 데스크탑에서 폼 정렬은 깔끔 (실측 X, WebFetch 카피 기준).
- 이탈 결정? No — Birth city optional 덕에 진행.

### 3.3 Rendering (무료 결과)
- 첫인상: src/reading-prompt.js를 직접 봤더니 무료 결과는 LLM reading 없이 4 pillars / Day Master / 오행 / 십신 / 12운성 / 지장간 / 공망 / 신살(天乙·桃花·驛馬) / 세운 / 대운 cycle table까지 데이터로 노출되는 것으로 보인다(reading-prompt.js:140-188 — userMessage가 LLM에 넘기는 구조이므로 free UI에도 동일 데이터가 표시될 가능성 매우 높음). 명리상담 전문가가 1시간 동안 종이에 적어주던 데이터의 60-70%가 무료로 나온다는 건 anchor 9 결제 의지에는 오히려 역효과: "데이터 다 봤는데 굳이 $7?" 의문 발생.
- painpoint: severity 3 — wealth 진지 검증 모드인 나는 "재성(正财/偏财) 분석"을 원하는데 free 단계는 십신 라벨만 보일 가능성, 십신 해석은 paid에서만. 그러나 reading-prompt.js Section 4 "Wealth & Resources ~400 words"가 paid 전용이라는 가설은 검증할 수 없음(KYC 막힘).
- delight: 지장간(hidden stems) + 12운성 + 공망 + 신살까지 free에 노출되면 명리 책 3권 읽은 나에겐 즉시 cross-check 재료가 된다. 100,000원 상담에서도 신살 이 정도까지 풀어주는 사람 드물다 — 데이터 완결성 측면 강한 +1.
- 이탈 결정? No — 데이터 보러 계속.

### 3.4 Upsell ($7 paid CTA)
- 첫인상: "Deeper LLM Reading $7 (1500-word, 5 areas)" 표기 (랜딩 카피 기준). 그런데 reading-prompt.js:74는 실제로 "Total length: 2500-3500 words"로 system prompt에 박혀 있다 — 랜딩 카피와 실제 산출물 길이가 불일치. 진지 검증 모드의 나에겐 "1500 약속하고 더 많이 주는 건 surprise+ 이지만, 반대 case면 신뢰 무너짐"의 신호.
- painpoint: severity 3 — 명리상담 전문가는 1시간 1:1 + 후속 카톡 질문 OK였다. $7는 1회 PDF email (refund 페이지 추론) + follow-up 없음. 가격 1/14인 건 맞지만 "결제 후 추가 질문" 채널 부재가 wealth 진지 검증 모드에는 결정적 약점.
- delight: $7는 anchor 9 페르소나에겐 거의 noise 수준 가격. 점심값 미만. 결제 마찰 자체는 zero. Lemon Squeezy 결제는 한국 카드도 보통 동작 (about 페이지 명시).
- 이탈 결정? No — 결제는 할 의지 충분, 다만 readingType 분기로 "career" 선택할지 고민.

### 3.5 Paid email (가설)
- "결제 후 email 받으면 만족할 조건":
  1. reading-prompt.js Section 2 "Career & Vocation"이 readingType="career" 선택 시 ~800 words로 expand (코드 라인 119 확인). 내 wealth motivation엔 "career"가 가장 근접. 그런데 readingType 선택지에 wealth가 없는 건 wealth motivation 페르소나에겐 명시적 미스.
  2. Section 4 "Wealth & Resources ~400 words"는 readingType 무관 고정 (라인 41-46). career 선택해도 wealth 섹션 자체는 400 words에 고정. 즉 wealth 깊이는 readingType 분기에서 추가 보너스를 받지 못한다 — wealth motivation에겐 구조적 한계.
  3. "Practical financial style (saver / spender / risk-taker / institution-builder)" + "One concrete financial behavior to lean into" — 액션 1개라도 구체적이면 합격선. 그러나 사업 의사결정 (예: "지금 시리즈 A 가도 되나") 같은 timing 질문은 Section 5 "Timing & Cycles ~600 words" 대운 cycle 해석에 위임된다. 대운 narrative가 명리상담의 1시간을 압축할 수 있을지가 paid 만족도의 핵심.
- "가설 결제 의향": 9/10 + anchor 행동: 카드 꺼냄(이미 anchor 9). KYC 막혀 실제 결과 검증 불가하므로 paid 후 만족도는 5-6/10 가설 — 가격 충격 없어 결제는 하지만 명리상담 100k원 대비 "1/14 가격 = 1/14 만족" 정도 기대치. 즉 "싸니까 만족"이지 "100k원 상담 대체"는 아님.

### 3.6 Share
- 카톡 창업자 단톡: "이 사이트 사주 데이터 풀로 나오는데 $7 LLM reading 짧긴 함. 명리상담 100k원 대비 가성비 체크용으로 한번 돌려봐라" — 단톡엔 보냄. anchor 7 (오늘 내).
- Slack 회사 채널: 안 보냄. 직원에게 창업자 사주를 회사 채널에 공유는 부적절. 약점: site엔 "사업/팀 reading" 같은 B2B angle이 없어 회사 채널 공유 hook이 zero.
- X (KR startup): 안 보냄. AI tool 호의 받지만 "한국 천 년" carve-out이 startup 청중에겐 어필 약함. 가성비 angle 자체는 thread 1줄 가능.

### 3.7 Return
- 다음에 또 올까? today.html "Bookmark this and come back tomorrow"이 retention hook. 5축(wealth · career · love · health · social) 일일 점수 — wealth가 첫째라는 점은 wealth motivation 페르소나에겐 +1. 그러나 매일 들어가서 일진 한 줄 보는 건 진지 창업자 사용 case가 아님 (이건 김할머니 case에 더 맞음).
- 진짜 retention hook: 시리즈 A 직전, 채용 직전, 핵심 의사결정 직전 — 사건 trigger 기반 재방문. 그 때 다시 와서 다른 readingType (general) 한 번 더 결제할 가능성 있음. anchor 3 (다시 와서 결제) 행동에 부합.

## 4. Core Dim Deep Evaluation

### 4.1 진지한 wealth 분석 (전문가 상담 대비 깊이)
명리 상담 전문가는 1시간 동안 내 재성(正财/偏财) 위치 + 용신 잡고 + 대운 흐름에서 사업 timing 짚어주는 데 100k원 받았다. reading-prompt.js Section 4는 "Wealth star analysis · Earth element role · Practical financial style · One concrete financial behavior" 4개 항목 ~400 words 고정. 100k원 1시간 대비 1/14 가격에 1/4-1/5 깊이로 추정. 다만 약점 1개 — "saver/spender/risk-taker/institution-builder" 같은 4분류 archetype은 진지 창업자에겐 표면적. 명리상담 전문가는 "당신 庚金 일간에 寅木 재성이 月支에 있고 대운이 火 운에 들어와 30대 후반에 fire-driven wealth event" 같은 구체 timing을 줬다. Section 5 (~600 words 대운 narrative)가 이걸 일부 보완하나, "wealth" focused expansion이 없는 게 구조적 약점.

### 4.2 paid 5섹션 quality (가설, 100k원 vs $7)
reading-prompt.js 전체 5섹션 구조는 명리상담 종이 노트의 골격과 일치 — 본질·career·love·wealth·timing + closing. 2500-3500 words (라인 74) = A4 5-6장. 100k원 상담은 1시간 대면 = transcript 환산 8-10k words + 후속 카톡 follow-up 무한. 텍스트 분량으론 1/3-1/2이지만 follow-up channel 부재가 진지 검증 모드엔 더 큰 마이너스. 또한 LLM 생성이라는 점 — about 페이지가 "LLM 기반"이라 명시했으므로 trust 신호는 솔직하지만, 명리상담 전문가의 "사부에게 배운 통변" 권위와 비교 시 -1. 가설 paid 만족도 5-6/10.

### 4.3 readingType career 분기 (실제로 wealth/business 깊이?)
reading-prompt.js:119를 직접 보면 readingType="career" 시 Section 2가 ~500→~800 words로 expand되고 system prompt에 "expand to ~800 words for this client (career focus)" 문구 추가. 그러나 Section 4 (Wealth) 자체는 분기 영향 zero. 즉 wealth motivation 창업자가 "career" 선택하면 career 800 words에 wealth는 400 words 그대로 — 분기 효과가 wealth 동기 페르소나엔 어긋난다. readingType 옵션에 "wealth"나 "business"가 없는 건 명시적 product gap. competitor 명리상담은 입구에서 "사업 사주 봐주세요"라고 말하면 1시간 전부가 그 angle로 reframe된다 — 분기 깊이 격차 -1.

### 4.4 privacy_business_data (창업자 민감)
about 페이지 "브라우저에서 전적으로 계산, 서버에 저장 안함" + terms "Birth information stays entirely within your browser" 명시. 진지 창업자 + 사업 IP 민감한 나에겐 이게 가장 강한 +1. 100k원 명리상담은 종이 노트에 내 정보가 남고 다른 client에게 "지난번에 SaaS 창업자 한 분이…" 식 사례 공유 위험 zero가 아니다. 여기는 client-side compute + LLM 결과만 email로 받음. Birth city optional도 명시. 다만 결제 시 Lemon Squeezy에 이메일/카드 정보가 남는 건 불가피 (refund 페이지에 명시). 사업 의사결정 데이터 정도라면 충분.

### 4.5 명리상담 price anchor ($7 vs 100,000원 perception, 가성비)
$7 = 약 9,500원 (2026-05 환율 1,360원 기준). 100,000원 1시간 1:1 명리상담 대비 1/10.5 가격. anchor 9 = 즉 결제, $7는 거의 free 수준. 그러나 "싸다 = 가성비 좋다"는 자동 아님. 가성비는 "단위 가격당 가치". 명리상담 100k원 = 8-10k words transcript + 1시간 즉답 + 후속 follow-up. $7 = 2500-3500 words PDF + email 1회 + follow-up 없음. 단위 word당 가격은 $7 쪽이 5-10배 저렴, 그러나 "live 즉답 가치"는 $7 쪽이 zero. 진지 검증 모드 (의사결정 trigger)엔 명리상담 100k원이 우위, 데이터 cross-check + 다른 readingType 비교 시엔 $7가 우위. 결론: 두 채널 보완재이지 대체재 아님. terms 페이지 "personal reflection only · not professional advice in financial matters" 면책 조항이 사업 의사결정 사용을 명시적으로 권하지 않는다는 점도 진지 검증 모드 페르소나엔 -1.

## 5. 동기 만족도
점수: 5/10
이유: wealth motivation에 site가 부분적으로만 답했다. (a) Section 4 Wealth ~400 words 고정 (b) readingType 옵션에 wealth/business 없음 (c) terms가 "not professional advice in financial matters" 명시 — 사업 의사결정 사용을 site 자체가 권하지 않음. anchor 5 = 부분적 답. data 완결성(Section 4.4)과 cross-check 도구로의 가치는 인정하지만, 진지 검증 모드의 핵심 욕구("이번 시리즈 A timing 맞나")엔 명리상담 100k원이 우위.

## 6. 친구 공유
- 공유 채널: 카톡 창업자 단톡 (10명)
- 보낼 메시지 텍스트:
  "https://hoonsikim.github.io/saju — 사주 데이터 무료로 풀로 나옴. $7 LLM reading은 짧긴 한데 cross-check용으론 OK. 명리상담 100k원 받기 전 prep로 한번 돌려봐라"

## 7. 이탈 지점
- Yes/No: No (이탈 없음, payment까지 진행 의지 9/10)
- 어디서: N/A
- 왜: anchor 9 + 데이터 완결성 + privacy 신호 + $7 = noise 가격이라 이탈 trigger 부재. 다만 "wealth readingType 부재"가 만족도를 5/10로 누른다.

## 8. 결제 의향
- 점수: 9/10
- 행동 기준 (anchor): 카드 꺼냄 (anchor 9 = 즉 결제). 가격 충격 zero.
- 이유: $7 = 점심값 미만, anchor 9 페르소나엔 결제 마찰 zero. 다만 결제 의향 9이라고 paid 만족도가 9는 아님 (가설 5-6/10 — 별개 차원). 결제는 거의 reflex로 한다.

## 9. 개선 제안 Top 3

1. **readingType 옵션에 "wealth/business" 추가 + Section 4 Wealth ~400→~800 words expand.** 현재 src/reading-prompt.js:114 `['general', 'career', 'love']` 배열에 `'wealth'` 추가하고, 라인 118-120과 동일 패턴으로 `{S4_BONUS}` 변수 + Section 4 헤더에 삽입. 창업자/투자자/사업가 wealth motivation 페르소나(rubric상 wealth motivation은 Wei·창업자김 2명)를 명시적으로 잡는 분기.

2. **Upsell CTA 카피 "1500-word" → "2500-3500-word"로 정정 (실제 산출물과 일치).** 랜딩의 "Deeper LLM Reading $7 (1500-word, 5 areas)" 카피와 reading-prompt.js:74 "Total length: 2500-3500 words" 불일치. 진지 검증 페르소나는 약속-실제 gap을 신뢰 신호로 본다. 더 받는다는 surprise+여도 약속을 정확히 쓰는 게 brand credibility 우위.

3. **결제 후 1회 "follow-up question" 채널 추가 ($7 paid에 24시간 내 1개 질문 응답 포함, LLM 응답 OK).** 명리상담 100k원의 강점은 follow-up. $7로 1:1 1시간을 못 줘도, LLM follow-up 1회 (예: "내 사주에서 시리즈 A 가는 게 맞나" 같은 구체 질문에 reading context 유지한 채 1회 응답)는 LLM cost 거의 zero에 가성비 perception을 크게 흔든다. about에 "AI follow-up included"만 추가해도 진지 검증 페르소나 paid 만족도 가설이 5-6 → 7-8로 점프.
