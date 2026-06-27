# Persona QA Report — 02 Mateo

## 1. 자기소개 (1줄)
32세 멕시코시티 데이터 엔지니어, MacBook Pro Chrome, 사무실 점심에 Reddit r/asianastrology에서 BaZi 첫 조우 — Aries(서양 점성 골수)인데 동양 명리는 zero, love 동기로 들어옴.

## 2. competitor 기준 (1줄)
나는 평소 **Cafe Astrology**(영문 정통 ref, Western chart 무료)와 **Astro.com**(natal chart calculator 무료)을 쓴다.

## 3. 7-Stage Walk-Through

### 3.1 Landing (30초)
- 첫인상: 헤드라인 "Your fate, in the language Korea has used for 1,000 years." — 'Korea' 단어가 박혀서 "어? 중국 BaZi가 아니라 한국 거?" 혼동. Reddit 글은 분명 BaZi였는데 site는 Saju라 한다. 서브헤드 "Authentic Korean Four Pillars of Destiny — Year, Month, Day, Hour. Five Elements in balance. Ten Gods at work."는 단어 4개(Four Pillars / Five Elements / Ten Gods / Day Master)가 첫 화면에 폭격. Aries 한 단어로 자기 정체성 만든 Western 사용자한테는 진입장벽 4배.
- painpoint: severity 3 — 'Korea vs China' 정체성 혼란 + 정의 없는 jargon 4개 동시 노출, 한숨 쉬고 계속 스크롤.
- delight: "Not Western astrology pretending to be Eastern. The real thing." 카피 — 정직한 포지셔닝. 내가 Western 골수라 오히려 "ok, 다른 거 한다는 거지" 명확.
- 이탈 결정? No — Reddit DM에서 호기심으로 왔고 데스크탑이라 스크롤 비용 낮음. 하지만 mid-30s tech worker 기준 "도대체 Day Master가 뭔데?" 라는 호기심 ≥ 짜증, 1분만 더 본다.

### 3.2 Input
- Birth date / Birth time (local) / Gender / Birth city (optional) / Reading style — 데스크탑 폼이라 입력 마찰 zero, 5초 안에 끝낼 수 있다.
- painpoint: severity 2 — "Birth time (local)" 만 표기. Astro.com은 도시 입력하면 timezone 자동 추론하고 DST까지 잡아준다. Mexico City 사용자는 1988년생 본인 BaZi 뽑을 때 1988년 멕시코 DST 룰 (1996년부터 시행) 신경 써야 해서 'local'이라는 한 단어로는 부족. Birth city가 optional이라는 건 4 pillars 계산 정확도 자체를 사용자가 책임지라는 뜻 — Aries(태양 위치)는 도시 1km 오차 무의미하지만 BaZi 時柱는 지방시 보정 없으면 한 시간 단위로 틀어진다. 첫 사용자가 이 사실을 모른다는 게 문제.
- delight: Reading style 셀렉터에 "Love & relationships"가 있어서 love 동기 사용자 즉시 매칭. Western daily horoscope는 보통 love/career 무관하게 한 덩어리.
- 이탈 결정? No — 폼 자체는 빠르다.

### 3.3 Rendering
- 무료 결과 구조: Five Elements Balance / Day Master / Void (空亡) / Auspicious Stars (神煞) / Reading / Major Luck (大運) — 헤더만 있고 정의 없음. "Your Four Pillars never change — but each day shifts the balance." 한 문장이 유일한 onboarding context.
- painpoint: severity 4 — 한자 4개(空亡 / 神煞 / 大運 / 四柱) 첫 노출. Western astrology에서는 글리프(♈ ♉ ♊)가 익숙해서 기호 자체가 위협은 아닌데, 한자는 픽토그램이 아니라 의미 통째로 모르는 글자라 인지부하 폭증. 영어 번역 "Auspicious Stars" "Major Luck"가 옆에 있긴 한데 'auspicious'라는 단어가 일상어가 아니라 Spanish 화자한테 더 멀다 (Spanish는 'auspicioso' 거의 안 씀, 'astros favorables' 같은 게 자연스러움).
- Day Master가 뭔지 모르는 상태에서 "Your Day Master is [甲]" 같은 결과 받으면 — Western에서 "Your Sun is in Aries"와 1:1 대응 정보인데 onboarding이 zero라서 의미를 잡을 수가 없다. Cafe Astrology / Astro.com은 Sun sign 결과에 항상 1-2 문단 의미 설명을 붙인다.
- delight: 시각적으로 4 pillars 그리드가 있다는 점은 깔끔할 가능성 있음 (실측 무료 결과는 입력 없이 못 봄 — 그것 자체가 painpoint).
- 이탈 결정? 50/50 — 무료 결과 텍스트 깊이에 달림. Reading 섹션이 generic 3 문단이면 즉시 이탈.

### 3.4 Upsell
- "Deeper LLM Reading · $7" (1500-word) — 가격 매우 합리적 ($7 = 약 120 MXN, 멕시코 점심 한 끼).
- painpoint: severity 3 — (a) Reddit 첫 방문자가 무료 결과로 무엇을 받는지 모르는 상태에서 $7 paid가 무엇이 어떻게 깊은지 정의 없음 ("1500-word" 단어 수가 유일한 차별점). Astro.com의 paid report ($35-50)는 sample PDF가 미리보기로 있다. (b) 'LLM Reading'이라는 단어를 hero에 쓴다는 건 솔직하지만 Western astro 사용자 입장에서는 'AI generated' = 'not from real astrologer' = 신뢰 -1. Cafe Astrology는 Annabel Gat 같은 사람 이름이 글에 박혀 있고 column이 사람이 쓴 거라는 게 명확.
- delight: $7 가격 자체. 호기심 anchor 4 사용자 입장에서 카드 마찰 가장 큰 건 가격 아니라 '결제 후 PDF가 진짜 가치 있나' 불확실성.
- 이탈 결정? No (구매 안 함), 페이지에서 이탈 안 함.

### 3.5 Paid email (가설)
- 결제 후 email 받으면 만족할 조건:
  1. PDF 첫 페이지에 "Day Master = Western Sun sign의 동양 대응 개념" 같은 bridge 문장. Aries인 나한테 "당신의 Day Master = 庚 = Metal = Western chart의 Mars/Saturn 어느 면과 연결" 이런 비교가 1개라도 있으면 즉시 share 충동.
  2. love readingType 선택했으면 PDF 안에 partner compatibility 시뮬레이션이라도 1개 (현 BF 생일 입력 권유 + free re-run link).
  3. Spanish 번역 PDF. UI가 영어인데 PDF만 영어면 ok지만 — "Receive in Spanish?" 옵션이 결제 직전에 있으면 trust +2.
- 가설 결제 의향: 3/10 — anchor 4 사용자가 무료 단계에서 'first BaZi 경험치' 충분히 못 채우면 paid 못 누른다. 1500-word 약속만으로는 멕시코 데이터 엔지니어 회의주의 못 뚫음.

### 3.6 Share
- WhatsApp 단톡 (멕시코 친구 6명, 그 중 1명이 Reddit에서 같이 본 호기심 친구):
  > "Oye, mira esto. Es como astrología pero coreana, usan 4 'pilares' en vez de signos. Yo soy Aries y aquí me sale 'Day Master = Metal' o algo así, no entendí nada pero está raro. ¿Lo probamos juntos? https://hoonsikim.github.io/saju/"
- Reddit r/asianastrology DM (원래 글쓴이):
  > "Tried the link — interesting take, very 'authentic Korean' positioning. UI is English-only despite Spanish in selector. No Day Master explainer though, kinda assumes you know BaZi already."

### 3.7 Return
- Return 가능성 낮음. Western astro에서는 매일/매주 horoscope이 retention hook인데, "Today's Fortune →" CTA가 있는데 무엇이 매일 바뀌는지 — daily pillar? — 정의가 없다. 'Notify me when live' CTA가 있는 걸 보면 today.html 자체가 아직 placeholder. Reddit 호기심 1회 방문으로 끝날 확률 70%.

## 4. Core Dim Deep Evaluation

### 4.1 first_BaZi_onboarding (Day Master jargon 처음 만남)
WebFetch 확인 결과 Day Master, Five Elements, Ten Gods가 hero 서브헤드부터 등장하는데 site 어디에도 정의 페이지가 없다. about/ 페이지는 운영자 정보일 뿐 BaZi 입문 자료 없음. Cafe Astrology가 Chinese astrology를 다룰 때는 첫 문장이 "Instead of Gods and Goddesses, the symbols used in Chinese astrology are animals"처럼 Western 독자 기준점부터 시작한다. 우리 site는 "이미 BaZi 안다고 가정"하는 톤이라 Reddit에서 처음 검색해서 들어온 사용자한테 첫 30초 진입 마찰이 사이트의 가장 큰 단일 결함. 'Saju vs BaZi' 정체성도 그대로 노출 ('shares roots with Chinese BaZi (八字)'는 about/에 묻혀 있음) — landing에 짧은 "What is Saju?" 모달 1개로 30%는 풀린다.

### 4.2 신살한자_위협 (神煞·歲運 한자 첫 등장)
Western astro에는 글리프(♓ ♑ ♎)가 있지만 12개 고정 셋이라 학습 비용 낮다. Saju site의 한자(空亡 / 神煞 / 大運 / 四柱)는 (a) 사용자가 의미를 추정할 단서 zero, (b) 영어 번역이 'Void' 'Auspicious Stars' 'Major Luck' — 셋 다 일상어 아님 (Spanish로는 'Vacío' 'Astros Auspiciosos' 'Gran Suerte' 직역하면 더 점성술스러운 게 아니라 더 이상해진다). 한자 자체는 정통성 신호로 쓸 수 있는데 그러려면 호버 시 1줄 정의 tooltip 정도가 최소다. 현 상태는 'authentic Korean' 마케팅 메시지와 'Western 사용자한테 친절' 사이에서 한쪽도 못 잡았다.

### 4.3 es_fallback_quality (Spanish UI 실측)
WebFetch 두 번 검증: `?lang=es`와 `?lang=en` 페이지 본문이 100% 동일. 언어 셀렉터 ("🌐 English 한국어 日本語 中文 Español ...")에 Español이 분명히 노출돼 있고 URL 파라미터도 받지만 실제 i18n 미구현 — 'Lectura' 'Tu destino' 'Cinco Elementos' 'Maestro del Día' 단어 0건. 즉 Aisha 페르소나의 Arabic 가설과 동일 패턴 — **광고만 있고 미구현**. 이게 결정적인 trust 손실이다: 멕시코 사용자가 자기 언어를 클릭했는데 영어가 나오면 '대충 만든 사이트' 인상 즉시. about/ 페이지에 "20 languages" 언급이 있다는 게 더 나쁘다 (약속 vs 실측 gap 명시). 차라리 셀렉터를 막아두고 "EN only for now — Spanish coming Q3" 솔직 disclosure가 trust 더 올린다.

### 4.4 동기_love_매칭 (love readingType 분기 효과)
Reading style 셀렉터에 "Love & relationships"가 분명히 있다. 그러나 onboarding 측면에서 love 선택 시 (a) 폼이 partner 정보 안 받음, (b) Hero/subhero에 love 관련 카피 없음, (c) Compatibility는 별도 $7 product로 분리돼 있어서 love 동기 사용자가 무료 reading에서 받을 게 무엇인지 명확하지 않음. Aries 골수인 나는 'Venus in Aries' '7th house ruler' 같은 Western love framework가 익숙한데, 'Day Master + 일주' 같은 Saju love 프레임이 무엇과 1:1 대응되는지 site에서 안 보여줘서 love 동기를 가지고 들어왔는데 동기 만족 경로가 paid compatibility까지 두 번 결제 유도가 됨. 단일 reading에서 readingType 분기 결과물이 텍스트만 다르고 데이터 구조가 같다면 Marie 페르소나가 던질 "AI tool 광신도 시각 분기 의미 있나" 질문에 똑같이 걸린다.

### 4.5 competitor_Cafe_Astrology (Chinese astrology 섹션 vs 우리)
Cafe Astrology의 Chinese astrology 페이지는 무료 calculator 없고 article 위주 (12 animals / 5 elements / 연간 horoscope). 즉 'Chinese astrology depth + free interactive chart'라는 정확한 합집합 경쟁자는 사실 Cafe Astrology가 **아니다** — astrobazi.com / bazi-lab.com / fatemaster.ai 가 직접 경쟁이다 (검색 결과 1, 2, 4번). 우리의 '진짜 경쟁'은 Cafe Astrology가 아니라 'BaZi Lab' 류인데, 그쪽은 Solar time 자동 보정 / Ten Gods 자동 라벨 / 20+ Shen Sha 자동 detection을 무료로 제공한다 (Master Sean Chan calculator 기준). 우리가 가진 차별점은 'LLM long-form reading'인데 그건 fatemaster.ai 도 똑같이 한다. **결론: 우리의 unique wedge는 'Korean Saju 정체성'뿐, 기능적으로는 -1**. 가격 ($7) 은 동등하거나 +0.5 (BaZi Lab 무료 / fatemaster 무료).

## 5. 동기 만족도
**점수: 3/10**
이유: 내 동기는 love이고 anchor 정의상 3 = "약함". Reading style에 love 옵션이 있어 0은 면했지만 — (a) 무료 reading 미리보기 zero, (b) love specific intro 없음, (c) Western astro의 Venus/7th house에 해당하는 Saju 개념 매핑 없음, (d) Compatibility는 별도 $7. Reddit 호기심으로 들어온 30분짜리 점심 세션에서 'love 답' 받았다는 감각 못 얻고 끝난다.

## 6. 친구 공유
- 공유 채널: WhatsApp 단톡 (멕시코 친구 5명)
- 메시지:
  > "Encontré algo raro en Reddit — astrología coreana, 'Saju'. Dicen que es lo mismo que el BaZi chino. Yo soy Aries y aquí salgo como 'Day Master Metal', ni idea qué significa. La página solo está en inglés aunque diga 'Español'. $7 por un PDF largo. Mira: https://hoonsikim.github.io/saju/"
- viral 충동: 3/10 (anchor 정의 = "기억만") — 시각 자료 찍을 만한 화면이 (input 전이라) 없고, share할 'aha moment'가 없다.

## 7. 이탈 지점
- Yes/No: **Yes**
- 어디서: stage 3.3 (Rendering) — 입력은 했지만 무료 결과의 jargon 폭격 + Spanish 미구현 발견 동시 타격.
- 왜: (1) Day Master 정의 없음 + 한자 4개 동시 노출로 인지부하 임계 초과, (2) `?lang=es` 클릭했더니 영어 그대로 → trust 즉시 손실, (3) love 동기 매칭 약함 → "이건 내 질문 답하는 사이트 아니구나" 결론. 페이지 닫고 Reddit 댓글로 돌아가 다른 link 클릭.

## 8. 결제 의향
- **점수: 2/10**
- 행동 기준 (anchor): anchor 정의상 0 = 절대 X / 3 = 다시 와서 결제. 나는 2 — 다시 올 확률 자체가 낮음. 만약 (a) Spanish UI가 실제로 번역돼 있고, (b) 무료 reading이 jargon 정의 포함 + love 매핑 1문단 추가됐다면 anchor 4 (카드 망설임)까지 올라간다.
- 이유: $7 가격 자체는 매우 합리적인데(멕시코 점심 1끼), 결제 결정의 병목은 **가격이 아니라 '무료 단계 가치 검증 실패'**. payment_anchor 4 = "호기심 + 가격 합리 + content 충분 시" — 셋째 조건이 깨졌다. 카드 미국 발급 카드 쓰니 LemonSqueezy 결제 자체는 마찰 없음 — 결제 의향이 낮은 건 결제 인프라 문제 아니다.

## 9. 개선 제안 Top 3

1. **Hero 바로 아래에 "What is Saju? (60-sec intro for Western astrology users)" 접이식 모달 추가** — 첫 문단 "If you know your Sun sign (Aries, Taurus, ...), think of your Day Master as the same idea but using one of 10 cosmic stems instead of 12 zodiac signs." 식의 1:1 bridge. 한자 4개(空亡 神煞 大運 四柱) 각각에 1줄 정의. 첫 BaZi 사용자의 30초 이탈을 가장 크게 떨어뜨리는 단일 변경.

2. **`?lang=es` 미구현 상태에서 언어 셀렉터에 Español 옵션 노출 중단 OR "🚧 Beta — content still in English" 레이블 추가** — 약속/실측 gap이 가장 큰 trust 손실 원인. Aisha 페르소나의 Arabic과 동일 패턴이므로 시스템적 i18n 결함. 진짜 번역 못 할 거면 셀렉터에서 '구현된 언어'(EN/KO만)만 보여주는 게 trust +3. about/ 페이지의 "20 languages" 카피도 같이 수정.

3. **`/saju/?reading=love` 진입 시 input 폼 위에 "Saju love framework = Day Master ↔ Partner's Day Master compatibility (서양 Venus/7th house와 대응)" 1문단 + partner 생일 optional 두 번째 필드 추가** — readingType 분기를 데이터 차원(추가 입력)에서 실제 차별화, 동시에 무료 reading 내에 love-specific 1 섹션 노출. 현재처럼 텍스트만 다르고 입력 구조 같으면 Marie/Sarah 페르소나가 던질 "분기 의미 있나" 비판 그대로 적용.
