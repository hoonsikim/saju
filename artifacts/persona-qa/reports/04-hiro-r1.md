# Persona QA Report — 04 Hiro

## 1. 자기소개 (1줄)
38세, 도쿄 거주, iPhone 15 Safari (JP 5G), 명리 박사급 (四柱推命 5권 + 일본 BaZi 사이트 운영자) — 韓国産 BaZi 사이트의 정확도와 일본어 자연스러움을 fact-check 하러 왔다.

## 2. competitor 기준 (1줄)
平素は 高島易断公式サイト(takashima-ekidan.co.jp)、運命大学、そして 真太陽時 보정까지 해주는 易象乾坤(yixiangqiankun.com/ja) 를 ref 로 쓴다.

## 3. 7-Stage Walk-Through

### 3.1 Landing (30초)
- 첫인상: `?lang=ja` 를 분명히 붙였는데 hero copy 가 그대로 "Authentic Korean Four Pillars of Destiny — Year, Month, Day, Hour. Free. Instant. No signup." 라는 영어. title 도 "Saju — Free Korean Four Pillars Reading". 일본어는 어디에도 없고 한자 4글자(四柱)만 박혀있다. ja 박사 입장에서는 "ja=ko 와 동일, lang param 무시" 라고 30초 안에 결론.
- painpoint: severity 4 — `lang=ja` query 가 사실상 noop 인 것은 일본 사용자한테 "여기는 우리한테 관심 없다" 시그널. 짜증 + about 페이지로 이동해 운영자 확인.
- delight: 단 하나 — `四柱` `神煞` `歲運` `大運` `空亡` 라는 정통 용어가 한자 그대로 박혀있는 것은 wikification 보다 솔직해서 호감. 高島 식의 「四柱推命」 표기와는 다른 한국식 `四柱` 단독 표기지만 의미는 통한다.
- 이탈 결정? No — 박사 입장에서 정확도 fact-check 가 1차 미션. 영어 UI 라도 4 pillars 계산만 정확하면 의미 있다. 일반 일본 소비자라면 100% 이탈.

### 3.2 Input
- 입력 폼: Birth date / Birth time (local) / Gender (Prefer not to say · Female · Male) / Birth city (optional) / Reading style dropdown. 라벨이 전부 영어. iPhone 15 Safari 에서 birth date 가 native picker 로 뜨는지가 핵심인데, 모바일 ja IME 환경에서 city 입력 시 일본어 도시명(東京·横浜)이 그대로 free-text 로 받아진다는 건 그나마 양호.
- painpoint: severity 4 — **결정적 결함 2개**:
  1. **真太陽時(LMT) 補正 X**. 일본 BaZi 정통은 明石(東経135°) 기준 ±20분(均時差) + 출생지 경도 보정이 거의 필수. 도쿄(東経139.7°)면 약 +19분. 일본 정통 사이트 itaxes·yixiangqiankun 는 모두 真太陽時 적용. 이 사이트는 city 가 optional + reading 맥락용이라고 코드 주석에 명시(`saju.js:111`, `city - 출생 도시 (자유 입력). 진태양시 보정·리딩 맥락용.`), 즉 **계산에는 안 쓴다**. 子時 경계 케이스(예: 23:15 출생)는 보정 없이는 일주(日柱) 자체가 틀린다.
  2. **타임존 처리 X**. 코드 `new Date(year, month - 1, day, hour, minute, 0)` 는 브라우저의 로컬 타임존을 그대로 쓴다. 日本 출생 사용자가 海外 旅行 中 사이트 접속하면 birth time 이 그 나라 타임존으로 해석되어 lunar 변환이 어긋난다. "Birth time (local)" 라는 라벨은 누구의 local 인가?
- delight: 시(時) 입력에 "모름" 옵션이 있는지 확인되지 않았으나, 일본 박사 입장에서는 시각 모를 시 일주까지만이라도 보여주는 fallback 이 정통.
- 이탈 결정? No — 박사이기에 일부러 시간 정확히 입력하고 결과 검증.

### 3.3 Rendering
- 무료 결과 sections: Five Elements Balance / Day Master / Void (空亡) / Auspicious Stars (神煞) / 2026 Year (歲運) / Reading content / Major Luck (大運). 박사 시각으로 항목 구성은 합격선 — 지장간·12운성·공망·신살(천을귀인·도화·역마)·세운까지 무료에 다 노출하는 건 일본 무료 ranai 사이트보다 깊다(高島 무료는 干支 + 운세 한줄 수준).
- painpoint: severity 3 — **신살 누락이 박사 입장에서 거슬림**. `saju.js:200` 의 `computeShenSha` 는 천을귀인·도화·역마 3개만 계산. 양인(羊刃)·괴강(魁罡)·백호(白虎)·화개(華蓋)·문창귀인(文昌貴人) 같이 일본 정통도 무게있게 다루는 신살이 빠짐. ADR-030 코멘트에서 "핵심 3개" 라고 인정. 박사 입장에서 천을귀인만 강조하고 양인 빠지면 "초보용" 인상.
- painpoint: severity 3 — **12운성 표기**. 코드 주석 `'长生·沐浴·冠带·临官·帝旺·衰·病·死·墓·绝·胎·养'` (`saju.js:158`) — 简体字. 일본 박사한테 보여줄 거면 长生→長生, 临官→臨官, 帝旺→帝旺(同), 绝→絕, 养→養 식으로 한국·일본에서 쓰는 旧字 가 정통. lunar-javascript 가 简体 그대로 뱉는 듯한데 ja 사용자 향 변환 레이어 없음.
- delight: section 5(Timing & Cycles) 에 大運 narrative 가 들어가는 구조(`reading-prompt.js:48`). 高島 무료는 大運 cycle 자체를 안 보여준다. 이 부분은 +1.
- 이탈 결정? No — 결과 본문 자체를 봐야 fact-check 가능.

### 3.4 Upsell
- $7 paid CTA: "Deeper LLM Reading: $7 (1500-word PDF)" + "Compatibility reading: $7 per pair". 일본 환경에서 가격이 USD 표시. JPY 환산(약 1,050円) 없음. JP 사용자는 $7 가 직관적이지 않다.
- painpoint: severity 3 — **결제 통화 + Lemon Squeezy 인지도**. 高島易断 의 유료 鑑定 은 보통 5,000円~30,000円, JCB·PayPay·コンビニ 결제. Lemon Squeezy 는 JP 일반 소비자 0% 인지. about 페이지에서 "Merchant of Record" 라고 적혀 있지만, 일본인은 メルカリ·BASE 같은 친숙한 결제 platform 이 아니면 카드 정보 입력 망설인다.
- painpoint: severity 4 — **환불 정책 JP 무방비**. `/legal/refund/` 는 "All sales are final" + EU 14일 cooling-off waiver. 일본 特定商取引法上の "通信販売" 表記(事業者名·住所·電話番号·返品特約) 가 없다. 박사이자 사이트 운영자 입장에서 "이건 일본법에서 위험하다" 즉시 인지.
- 이탈 결정? Partial — 박사가 결제 직전까지 가서 가격·약관 확인 후 멈춤. anchor 5(친구 추천 정도)에 정확히 부합.

### 3.5 Paid email (가설)
- "결제 후 email 받으면 만족할 조건":
  1. 1500-word PDF 가 진짜 5 section + closing 구조(`reading-prompt.js:23-56`)대로 오고, 大運·空亡·12운성·지장간이 **mechanically enumerate** 가 아니라 narrative 로 weave 되어야 함(prompt 의 명시 요구). 박사이기에 "Personality & Essence 500자, Career 500자..." 가 실제로 그대로 오는지 검증.
  2. 日本語 출력이 placeholder 수준이 아니라 자연스러운 丁寧体(LANGUAGE_NAMES.ja = "Japanese (日本語、丁寧体で)" 명시, `reading-prompt.js:88`). 박사는 "ですます" 만으로는 부족하고 명리 용어가 일본 BaZi 통용어로 와야 한다 — 예: "Day Master" → 日主 또는 命主, 그냥 "デイマスター" 라면 즉시 환불 요청 트리거.
  3. PDF 메타데이터에 출생 데이터 안 박혀있어야 함(privacy). 사이트 본문에 "처리는 브라우저 안" 이라 했지만 PDF 는 server-side 생성일 테니 약속 일치 검증.
- "가설 결제 의향": 5/10 — anchor 정의상 "친구 추천" 수준. 박사로서 정확도·일본어 자연스러움 직접 검증 못 한 상태에서 anchor 5 가 정확. 검증 후 만족이면 7로 상승 가능.

### 3.6 Share
- 박사 시각으로 共有 가치는 두 케이스:
  1. **positive case**: 무료 path 의 12운성·신살·세운까지 한 화면에 노출되는 점은 `X(ja BaZi community)` 에 紹介 가치 있음 — "韓国の Saju サイト、無料でここまで出してる" 라는 angle.
  2. **negative case**: 真太陽時 보정 없고 子時 처리 불명확한 점은 박사 community 에서 즉시 트집 잡힐 위험. 추천보다 "검증 요청" 으로 X 에 던질 가능성.
- 결국 박사 페르소나는 호의적 공유보다 "이거 한국 사이트인데 真太陽時 안 잡아주네, 어떻게 생각함?" 형식의 검증 toss-up 으로 share. viral 충동: 3/10 (기억만, 즉시 메시지 X).

### 3.7 Return
- 박사 입장에서 return hook 약함. about 페이지에 운영자(김시훈) 가 software/product 백그라운드만 명시 — 명리 사부·자격·계보 일체 없음. 박사한테는 "엔지니어가 만든 BaZi 計算機" 이상으로 안 보임. 일본 정통은 流派 명시(神聖館·総本部 식)가 신뢰의 1차 신호.
- return 가능성: 大運 narrative + 매년 세운(歲運) update 하는 패턴이면 1년 1회 return 가능. daily 일진 page (`today.html`) 존재 여부 확인 안 됨 — 있으면 박사한테는 큰 hook 아님(이미 高島 暦 본다).

## 4. Core Dim Deep Evaluation

### 4.1 정확도_fact_check (4 pillars 계산 + 立春 + 子時)
- **4 pillars 계산 자체는 lunar-javascript@1.7.7(`saju.browser.js:4`) 라이브러리에 위임**. 이 라이브러리는 중국 본토 기준이며 香港·대만·일본 BaZi 커뮤니티에서 일반적으로 신뢰. lunar.getYearInGanZhi() / getMonthInGanZhi() 가 자동으로 24절기 기준(立春·驚蟄·…)으로 연주·월주 boundary 처리. 立春 처리 자체는 **라이브러리 내부에서 해결됨** — 이 부분은 합격.
- 그러나 사이트 UI/about 어디에도 "**立春을 기준으로 연주를 계산합니다**" 명시 없음. 일본 박사는 高島·運命大学 사이트가 모두 立春 명시하는 데 익숙. "そもそも年柱の境目を立春で取っているか暦正月で取っているか" 가 표시 안 되면 라이브러리를 모르는 박사는 의심을 거둘 수 없다.
- **子時 (23-01) 경계는 실측 불가**. 코드 `Lunar.fromDate(jsDate)` 는 lunar-javascript 가 23:00 부터 翌日 子時 로 처리(夜子時 = 翌日扱い). 일본 BaZi 의 두 학파(早子時·夜子時/晩子時·夜子時=翌日 vs 早晩子時=当日) 중 라이브러리 default 가 어느 쪽인지 사용자한테 노출 안 됨. 박사한테는 critical hole — 23:30 출생자의 일주가 어느 학파 따라 달라지는데 사이트는 단일 답만 내놓는다.
- **真太陽時 X**. 위에서 언급. 도쿄 ~+19분, 札幌 ~+25분, 那覇 ~-30분. 시주(時柱) 가 한 칸씩 어긋날 수 있는 케이스가 매일 발생. 박사 入賞 X.

### 4.2 ja_naturalness (UI + reading)
- **UI 일본어**: WebFetch 결과 `?lang=ja` 가 거의 noop. 이건 단순한 i18n 누락이 아니라 ja 사용자에게 "이 사이트는 일본 시장 향이 아니다" 라는 명시 신호. 박사 입장에서 evaluator 가 아니라 그냥 "외국 사이트" 로 분류.
- **reading 일본어**: 실측 불가(유료). 코드 `LANGUAGE_NAMES.ja = 'Japanese (日本語、丁寧体で)'` (`reading-prompt.js:88`), system prompt 가 "translate section headers into Japanese naturally — e.g. 'Personality & Essence' → '性格と本質'" (`reading-prompt.js:19`). prompt 수준에서는 의도 표현됨. 하지만 LLM(Claude 추정) 의 일본어가 박사 기준 自然 한지는 별개 문제.
- 박사 lens 로 우려: prompt 가 "If writing in a non-Korean language, give the Korean/Chinese term once with a brief translation, then use it naturally" (`reading-prompt.js:65`) 식이면, LLM 이 "Day Master(日主)" 처럼 영어/한국어 용어를 먼저 던지고 일본어 보충하는 패턴이 나올 가능성. 일본 BaZi 정통은 처음부터 「日主」「命主」「日干」 로 쓴다.
- 결론: UI 는 fail(placeholder만), reading 일본어 품질은 prompt 의도는 있으나 검증 불가. 박사 입장에서 "사령(운영자)이 일본어 native 아니라서 잡기 어려운 영역" 임이 명백 — about 페이지에 김시훈(KR) 솔로 운영 명시.

### 4.3 readingType 분기 깊이 (career/love)
- 코드 `reading-prompt.js:112-121` 의 systemPrompt 가 readingType 받아서 section 2(career) 또는 section 3(love) 만 ~800 words 로 expand. 나머지 4 sections 는 동일. 박사 시각: **분기가 양적(word count) 일 뿐 질적 차이 없음**.
- 정통 사주식 분석이라면 career 선택 시 식상(食傷)·재성(財星)·관성(官星) 의 강약 분석 + 직업 五行(예: 木火 → 教育·広告, 金水 → 金融·IT) 매핑 + 격국(格局, 정관격·편재격 etc.) 까지 들어가야 박사 만족. love 라면 부부궁(夫婦宮 = 日支) + 배우자 星(男=財星, 女=官殺) + 도화·홍염 같은 살까지 깊게.
- prompt 에 "Wealth (재성) / Officer (관성) / Output (식상) gods → preferred work modality" (`reading-prompt.js:32`) 가 있어서 십신 활용은 명시. 그러나 **격국(格局) 언급 X**. 일본 박사·중국 정통의 핵심인 格局 빠진 BaZi reading 은 박사한테 "표면적" 으로 분류.

### 4.4 dayMaster_archetype_정통성 (정통 vs Western horoscope)
- system prompt 가 명시적으로 "Avoid: Western astrology vocabulary (Mercury retrograde, houses, signs)" + "Horoscope-vagueness" + "Use Korean Saju terminology where it carries meaning — these terms ARE the value" (`reading-prompt.js:60-66`). prompt 수준에서는 의도 정통. 박사 평가 +1.
- 그러나 "Day Master archetype: who they actually are at the core" (`reading-prompt.js:26`) 라는 표현 자체가 archetype = Jungian/Western 심리학 어휘. 일본 정통은 「日主の本質」「日干の象意」「五行配置から見る性情」 식. archetype 단어가 일본어 번역에서 「アーキタイプ」 로 카타카나 그대로 나올 위험 — 박사한테는 즉시 "Western 식 사주" 판정 트리거.
- 룰 기반은 정통(천간·지지·오행·십신·12운성·신살·대운 모두 정통 산출), 그러나 LLM narrative layer 에서 정통성 보장은 prompt 의존. 박사 시각: 50/50.

### 4.5 大運 정확성 (방향 + age)
- 코드 `saju.js:167-198`: `eight.getYun(genderInt)` 호출, genderInt = male:1 / female:0. lunar-javascript 가 내부적으로 **양남음녀 순행 / 음남양녀 역행** rule 적용. 즉 性別 + 年干 yin/yang 으로 방향 결정 — **이 부분은 정통**. 박사 평가 +1.
- startYear/startMonth/startDay/startAge 가 yun 객체에서 그대로 추출(`saju.js:175-177`). lunar-javascript 는 出生時刻과 가장 가까운 절입 시각까지의 거리를 3일=1년 으로 환산(중국·일본·한국 공통 정통). 이 라이브러리 의존이라 산출 신뢰 가능. 박사가 高島 cross-check 하면 동일 결과.
- 단, **gender = "Prefer not to say" 선택 시 majorLuck = null** (`saju.js:170` 의 if 분기). 일본·한국 정통 모두 大運 산출에 성별 필수. 사용자한테 "성별 안 주면 大運 못 본다" 라는 explicit 안내가 UI 에 있는지 불명. 박사가 직접 테스트하면 "왜 大運 섹션이 비었지?" 헷갈림.
- 8 cycles 만 노출(`saju.js:180` `slice(1, 9)`). 8 cycles = 80년. 박사 입장에서 충분. 但し 첫 cycle 의 시작 연령이 1세~10세 사이 random 인데, 그 사이의 小運(0~첫대운) 은 의도적으로 버림(주석 명시). 일본 정통은 小運 도 보여주는 流派 있음 — 박사 mild deduction.

## 5. 동기 만족도
점수: 4/10
이유: 동기 = validation(검증). 박사로서 fact-check 하러 왔는데 핵심 검증 포인트들이 막혀 있음 — (a) 真太陽時 보정 X, (b) 子時 학파 표기 X, (c) 立春 기준 명시 X (라이브러리는 잘 하지만 사용자한테 안 보임), (d) UI 가 일본어 noop 라 ja 자연스러움 검증 시작도 못 함, (e) 격국 분석 prompt 부재. 검증 가능한 정통 요소는 大運 방향 산출(정통)·신살 핵심 3개(정통이나 양인·괴강 등 누락)·12운성·지장간·공망(정통). 절반은 합격, 절반은 누락 또는 검증 불가. anchor "5=부분적" 보다 약간 낮게 4 — 박사한테는 "부분 검증 가능" 도 만족이 아닌 미해결.

## 6. 친구 공유
- 공유 채널: X (Twitter, ja BaZi community 3k follower)
- 보낼 메시지 텍스트:
  > "韓国製の Saju サイト見つけた。lunar-javascript ベースで 12 運星·空亡·神煞·大運 まで無料で出すのは結構深い。ただ真太陽時補正なし·子時の学派表記なし·UI が事実上英語(?lang=ja noop)。命式の精度を誰か検証してみない？ https://hoonsikim.github.io/saju/?lang=ja"

(호의적 공유 X. 검증 toss + 약점 명시. ja BaZi community 박사들이 즉시 真太陽時·夜子時 처리 캐러 들어갈 것)

## 7. 이탈 지점
- Yes/No: Partial Yes (결제 직전 이탈)
- 어디서: stage 3.4 (Upsell)
- 왜: (1) `?lang=ja` 가 noop 이라 일본 시장 무관심 시그널, (2) 무료 결과까지 보고 大運·신살 깊이는 인정하나 真太陽時 누락 + 子時 학파 표기 X 라는 박사 redline 2개 적중, (3) Lemon Squeezy 통한 USD 결제 + 일본 特商法 표기 X 라 결제 직전 멈춤. 무료 path 까지는 끝까지 봄, 유료 결제 X.

## 8. 결제 의향
- 점수: 5/10
- 행동 기준 (anchor): "친구 추천" — 카드 안 꺼낸다. ja BaZi community 에 검증 toss 하는 형태로 共有. 다른 박사가 reading 일본어 자연스러움 + 真太陽時 보정 추가됐다고 확인해주면 그때 결제 검토.
- 이유: 박사이기에 무료 path 의 정통성·깊이는 평균 이상 인정(특히 大運 방향 산출과 신살 3개·12운성·공망 노출). 그러나 (a) 真太陽時 보정 부재, (b) 子時 학파 명시 부재, (c) UI 일본어 noop, (d) 격국 분석 prompt 부재 — 박사 redline 4개. anchor 5 = 가성비/추천 가능하지만 본인 카드는 안 꺼내는 위치 정확히 매칭.

## 9. 개선 제안 Top 3 (페르소나 시각, actionable)

1. **真太陽時(LMT) 自動 補正 + 子時 학파 토글 추가** — `saju.js:115` 의 `const jsDate = new Date(year, month - 1, day, hour, minute, 0)` 직전에 city 기반 경도 lookup table(최소 主要 50 都市: 東京·大阪·札幌·福岡·那覇·서울·北京·上海·LA·NY) 추가, 経度差 × 4분/° + 균시차 보정. UI 에는 input form 아래 작은 toggle "夜子時を翌日として扱う (推奨) / 当日として扱う" 라디오 2 옵션. about 페이지에 "立春を年柱境界、節入りを月柱境界として lunar-javascript ライブラリで計算しています" 1줄 명시.

2. **`?lang=ja` 진짜 일본어 i18n 적용 + 用語 매핑 테이블** — 현재 hero/form labels/button 이 영어 hardcoded. `index.html`(또는 빌드 결과)에 i18n dictionary 추가: title `Saju — 韓国式 四柱推命 無料鑑定` / hero `あなたの宿命を、千年の智慧で読み解く` / button `命式を見る →` / form label `生年月日` `生まれた時刻(現地時間)` `性別` `出生地（任意）` `鑑定タイプ`. 한자 용어 매핑: Day Master → 日主, Five Elements → 五行, Ten Gods → 十神, 简体 `长生·绝·养` → 旧字 `長生·絕·養`. 高島易断·運命大学 어휘 ref.

3. **결제·약관 JP 컴플라이언스 패치 + 격국 분석 prompt 추가** — `/legal/refund/` 와 `/legal/terms/` 의 `?lang=ja` 버전에 일본 特定商取引法 11条 표기 block 추가 (販売業者名 / 所在地 / 連絡先 / 価格 1,050円(税込) 仮 / 支払方法 / 引渡時期 / 返品特約). 가격 표시는 lang=ja 일 때 JPY 자동 환산 노출. 추가로 `reading-prompt.js:32` 의 Career section 에 "Identify the format/structure (格局, e.g. 正官格·偏財格·食神生財·建祿格) implied by the Month branch + transparent stems, and how it shapes career trajectory" 1줄 inject — 박사 만족도 즉시 상승.
