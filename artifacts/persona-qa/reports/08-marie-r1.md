# Persona QA Report — 08 Marie

## 1. 자기소개 (1줄)
35세, Paris 11구, tech enterprise PM, Dell XPS Firefox 데스크탑, 사무실 점심에 career 분기 고민하며 `?lang=fr` 링크 직접 타이핑해서 들어옴.

## 2. competitor 기준 (1줄)
나는 평소 ChatGPT Custom GPT "Chinese BaZi Fortune Teller (Cantian AI)" + Co-Star app + Tarot AI (Sanctuary AI)을 월 $50+ 구독으로 비교 사용한다.

## 3. 7-Stage Walk-Through

### 3.1 Landing (30초)
- 첫인상: `?lang=fr` 붙여서 들어왔는데 첫 화면이 영어로 떴다. "Saju — Free Korean Four Pillars Reading" 헤딩 그대로. 🌐 selector에 "Français" 항목은 보이는데 클릭해도 콘텐츠는 안 바뀜. About 페이지는 "20 languages available" 적어놨고 footer는 "20 languages"인데 실제로 fr만 placeholder다 (en/ko/ja/zh/es만 진짜로 번역된 것으로 보임 — today.html fetch에서 fr 언급 없이 5개만 나옴).
- painpoint: severity 4 — 짜증나서 다른 탭으로 옮긴다. tech PM이 i18n placeholder를 못 알아볼 리 없다. "20 languages" claim과 실측 5개 mismatch는 brand trust 즉시 깨짐. 이건 ChatGPT에선 안 일어남 (GPT는 fr로 물어보면 fr로 답함).
- delight: "Built autonomously by 일사령(逸事令)" footer는 호기심 자극. AI agent 이름 박는 건 솔직해서 좋다 (Co-Star도 안 함). "Code = MIT licensed"도 dev 친화적.
- 이탈 결정? No — en으로 계속 본다. fr 떨어진 건 감점이지만 PM이라 en은 native 수준.

### 3.2 Input (생년월일 폼)
- Birth date, Birth time (local), Gender (Prefer not to say / Female / Male), Birth city (optional), Reading style dropdown. Dell XPS Firefox에서 직관적.
- painpoint: severity 2 — "Birth time (local)"라고만 적혀 있는데 내가 모르면 어떻게 하지? ChatGPT는 "if you don't know, say noon"라고 친절히 안내. 여기는 사용자가 알아서 판단해야 함. Paris 출생인데 timezone DST 처리 명확하지 않다 (1990년 4월 출생자는 UTC+2였나 +1이었나).
- delight: Gender에 "Prefer not to say" 있는 거 EU/FR 감수성 OK. Birth city optional도 GDPR 친화 (선택사항으로 두는 게 맞다).
- 이탈 결정? No — 형식 자체는 30초 컷.

### 3.3 Rendering (무료 결과)
- Free reading은 "rule-based"라고 명시. Day Master / Five Elements / Ten Gods 노출. LLM Deep Reading은 "coming this week"로 미래형. 즉 무료는 정통 계산 결과 + 짧은 텍스트.
- painpoint: severity 3 — career 분기 골랐는데 무료 rendering이 "Career & work"에 맞춰 정말 다른지 페이지 인용으로는 확인 안 됨 (rule-based output은 birth chart 자체에 종속, readingType은 paid LLM 단계에서만 의미). 즉 무료 단계에서는 "career 선택"이 cosmetic이고 paid 결제 안 하면 분기 효과 0. 이건 dark pattern까진 아니어도 PM 시각으론 funnel design 문제.
- delight: 5 Elements balance 시각화는 ChatGPT custom GPT 텍스트 dump 대비 우월. Cantian AI는 한자 chart 이미지만 던지는데, 여기는 ko/한자/eng 라벨 셋트가 일관됨.
- 이탈 결정? No — 결과는 봤다.

### 3.4 Upsell ($7 paid CTA)
- "Deeper LLM Reading · $7" / "1500-word reading across 5 areas (love, career, wealth, health, timing). PDF download. AI-powered."
- painpoint: severity 3 — **5 areas 모두 준다는 건 readingType 선택 의미를 자기가 부정**. 내가 career 골랐는데 어차피 love/wealth/health/timing 다 받는다? 그럼 dropdown은 뭐였나. PM 시각으론 product taxonomy 모순.
- 또 painpoint severity 2 — "AI-powered"만 적혀있고 어떤 LLM인지 (GPT-4? Claude? Gemini?) 명시 X. ChatGPT Custom GPT 쓰는 사람은 모델 알고 싶다 (Anthropic skill 박힌 거 보면 Claude일 가능성 높은데 명시 안 함). About 페이지에 "LLM-generated long-form interpretation" 정도만 적힘.
- delight: $7 가격은 ChatGPT Plus 월 $20 / Sanctuary $9.99/mo 대비 one-shot one-pay라 가성비 인식 ↑. 즉결제 가능 수준. PDF download도 LinkedIn share 자료로 쓸 수 있음.
- 이탈 결정? No — 결제 의사 있음 (anchor 8 일관).

### 3.5 Paid email (가설)
- "결제 후 email 받으면 만족할 조건":
  1. 1500 단어 진짜 채워야 (Co-Star가 늘 짧게 끊어서 만족도 낮음 — 여기는 약속이라도 했으니).
  2. career 분기가 무료 5 areas 중 career area에 weight를 더 줘야 (단순 5 areas 균일이면 readingType 분기 의미 0).
  3. PDF가 정말 LinkedIn에 올릴 만한 typography여야 (Helvetica dump면 안 됨, 한자 chart 이미지가 있어야 visual hook 됨).
  4. fr 약속 안 됐으니 en 받는 거 OK. 단 LLM이 fr로 다시 prompt하면 fr로 줘야 (이건 paid 못 봐서 가설).
- "가설 결제 의향": 8/10 — 카드 꺼냄. AI tool 월 $50+ 쓰는 사람한테 $7은 noise. 다만 ChatGPT Custom GPT가 무료라는 점이 -1.

### 3.6 Share
- 공유 채널: LinkedIn (curated). X (FR tech)는 mystic 콘텐츠라 안 올림 (brand mismatch).
- 어디 화면을 share? 5 Elements balance 시각화 한 장 screenshot + caption "AI tool evaluation #47: Korean BaZi solo dev project". paid PDF 받으면 "1500-word AI reading vs ChatGPT Custom GPT — surprisingly nuanced. $7. Built solo by Hoonsi Kim".
- painpoint: severity 3 — fr UI 깨진 상태로는 FR LinkedIn에 못 올림. "20 languages claim과 실측 불일치" 자체가 화제는 되지만 그게 site에 +가 아니라 -다. 전문직 LinkedIn은 polish 깨지면 안 올림.
- 이탈 결정? No.

### 3.7 Return
- today.html은 "Bookmark and come back tomorrow" 박았지만 birth data 매번 입력 강요 (cookie/localStorage 저장 unclear). 데스크탑에서 매일 폼 다시 채울 PM 없음.
- 7-day forecast 있다고 today.html 페이지에 적힘 — 그건 흥미. 단 결제 안 하면 forecast가 무료인지 paid인지 불명확.
- painpoint: severity 2 — Co-Star는 push notification 보내준다. 여기는 email signup도 없다 (결제 안 하면 retention hook 0).
- 이탈 결정? Return 안 함 — bookmark 안 함. 결제는 하지만 1회성 transaction.

## 4. Core Dim Deep Evaluation

### 4.1 AI_tool_evaluation (다른 AI tool 대비 차별점)
ChatGPT Custom GPT "Cantian AI" / "BaZi Fortune Telling"은 무료 + 대화형 + 한자 chart 던져준다 (정확도는 들쭉날쭉, 사주 계산을 LLM이 hallucinate하는 게 알려진 문제 — shen-shu.com 비교 글). 우리 site는 **rule-based 계산 + LLM 해설 분리**가 진짜 차별점이다. 즉 chart 계산은 결정론적이고 LLM은 해설만 — 이건 ChatGPT가 절대 못 하는 것 (ephemeris 없음). 다만 site copy가 이 구조를 강조 안 함. "rule-based" 한 단어 짧게 묻혀 있고, "Authentic Korean" 같은 추상 marketing 뒤에 숨음. PM 시각으론 **technical moat을 marketing copy에서 매장**한 상태. Co-Star는 NASA JPL 데이터 쓴다고 자랑함 — 우리는 立春 기준 사주 계산을 자랑 안 함.

### 4.2 fr_naturalness (UI/reading)
**실측 결과: French UI는 placeholder만 존재.** `?lang=fr` 직접 타이핑해도 콘텐츠 영어 그대로. 🌐 selector에 "Français" 보이지만 클릭해도 변화 없음. About 페이지 "20 languages available" claim과 today.html 페이지 실측 (en/ko/ja/zh/es 5개만 실재) 사이 mismatch는 brand trust 즉시 깨짐. tech PM은 i18n debt를 한눈에 알아본다. 이건 다른 4개 비영어 페르소나 (Aisha ar / Mateo es / Wei zh / Hiro ja)와 cross-confirm 필요한 발견인데, **es는 진짜로 번역돼있고 fr/ar/de 등은 placeholder**일 가능성이 매우 높다. Reading 자체 fr 가설 평가는 불가능 (paid 안 받음, 결제 후 LLM이 fr prompt에 fr로 답하는지는 실측 X). FR PM 대상 launch는 fr UI 먼저 해결돼야 가능.

### 4.3 readingType_career_분기_효과
Dropdown에 General / Career & work / Love & relationships 셋 노출. **무료 rendering 단계에선 분기 효과 확인 안 됨** (rule-based 결과는 birth chart에 종속, readingType은 paid LLM prompt에만 영향 추정). 그런데 paid CTA copy가 "1500-word reading **across 5 areas** (love, career, wealth, health, timing)"라 적혀있음 — **5 areas 다 주면 readingType 선택 의미 0**. 즉 dropdown은 cosmetic UI, 결제 funnel을 가짜 personalization으로 끌어들이는 dark pattern에 가까움. PM 시각: career 선택했으면 paid PDF에서 career section을 50% weight + 나머지 4개 짧게가 product 약속의 자연스러운 해석. 박사김 페르소나(창업자)도 같은 의심 할 것 — wealth 선택했는데 5 areas 균일이면 wealth 분기 의미 0.

### 4.4 share_LinkedIn (전문직 share potential)
LinkedIn에 올릴 만한 화면: 5 Elements balance 시각화 한 장. 단 현재 site는 OG image / share card 명시적 디자인 X (확인 안 됨). LinkedIn은 og:image preview가 미려해야 클릭률 나옴. About 페이지 "Built autonomously by 일사령(逸事令)" — 이건 LinkedIn "AI tool evaluation" 카테고리 글로 쓰면 viral 가능 (AI agent가 만든 site 자체가 화제). 단 fr UI 깨진 상태로는 FR LinkedIn 못 올림 (FR audience가 fr 깨진 거 바로 본다). EN LinkedIn으론 가능하지만 그건 X audience와 동일해짐. **결론: 잠재력 7/10이지만 fr UI fix와 share card 디자인 둘 다 해결돼야 share 충동 발동**. viral 충동 현 시점 5/10 (SNS 포스팅 가능 수준이지 5분 내 메시지 X).

### 4.5 cost_perception ($7 가성비)
나는 ChatGPT Plus $20/mo + Claude Pro $20/mo + Midjourney $10/mo + Sanctuary AI $9.99/mo + Co-Star $0 = 월 $60. $7 one-time은 **하루 라떼 두 잔**. AI tool 월 $50+ 쓰는 사람한테 $7은 noise — 결제 friction 0. 다만 "ChatGPT Custom GPT BaZi는 무료"라는 비교가 머리에 박혀 있음 (검색하면 Cantian AI / Master Tsai 등 무료 GPT 다수). $7 명분은 "결정론적 계산 + LLM 해설 분리"라는 technical moat인데 site copy가 그걸 강조 안 함. 즉 **$7는 싸지만 무료 대체재가 명확히 있어서 anchor 8 (즉결제) → 실제 6-7로 떨어질 위험**. PM 시각으론 "AI hallucinates birth chart, we don't" 같은 one-liner가 upsell 옆에 필요.

## 5. 동기 만족도
점수: 5/10
이유: career 분기 ─ 무료 단계에서 분기 효과 확인 0, paid는 결제 전이라 가설. "career 선택했더니 결과가 career 중심"이라는 약속이 funnel 전체에서 일관되지 않음 ("5 areas 균일" copy와 모순). 내 동기는 "현재 enterprise PM에서 founder 전환할까 vs stay"인데 site는 이 수준의 구체 career 분석을 약속 안 함. Co-Star는 daily career horoscope 박지만 짧고, ChatGPT Custom GPT는 깊지만 chart hallucinate. 우리 site는 그 중간 sweet spot 잠재력 있지만 copy가 그걸 약속 안 함.

## 6. 친구 공유
- 공유 채널: LinkedIn (curated) — Paris tech PM circle
- 보낼 메시지 텍스트 (1-2줄):
  "AI tool eval #47: a solo Korean dev built a BaZi reading site where the chart is rule-based and only the interpretation is LLM-generated. $7 one-pay, no subscription. ChatGPT Custom GPTs hallucinate the chart itself — this doesn't. The French UI is still placeholder though, so wait if you need fr. → [link]"

## 7. 이탈 지점
- Yes/No: No (결제 단계까지 감)
- 어디서: stage 3.7 (return). 결제는 하지만 retention 0.
- 왜: today.html이 birth data 매번 재입력 요구하는 듯, email subscription 없음, push notification 없음. 1회성 transaction으로 끝남. fr UI 깨진 상태로는 LinkedIn share도 못 함.

## 8. 결제 의향
- 점수: 7/10 (anchor 8 → ChatGPT 무료 대체재 인지로 -1)
- 행동 기준 (anchor): "가격 ok면 결제" 그 이상. AI 월 $50+ 쓰는 사람에게 $7은 noise라 거의 anchor 10에 가깝지만, ChatGPT Custom GPT 무료 대체재 + readingType 분기 의심으로 7로 조정.
- 이유: $7 가격은 friction 0. PDF + 1500단어 약속도 합당. 단 (1) "AI-powered" 모호함 (어떤 LLM?), (2) 5 areas 균일이라 readingType 선택 의미 의심, (3) fr 안 됨 — 셋이 즉결제(8)에서 신중결제(7)로 끌어내림. 결제는 한다, 단 한 번뿐.

## 9. 개선 제안 Top 3 (페르소나 시각, actionable)
1. **fr UI 진짜 번역하든가 selector에서 "Français" 항목 제거**. 현재는 "20 languages claim + 실측 5개"로 PM 시각에서 즉시 brand trust 깨짐. landing page 모든 string에 i18n key 박고 fr.json 생성 (es가 이미 돼있으면 같은 구조로 fr.json 추가만 하면 됨). 못 하면 selector에서 fr 항목 빼고 About 페이지 "5 languages: en/ko/ja/zh/es"로 정직하게.
2. **upsell CTA copy를 "5 areas 균일"에서 "your selected readingType이 50% weight, 나머지 4개 brief"로 변경**. 현재 dropdown은 cosmetic이고 결제 funnel을 가짜 personalization으로 끌어들이는 형태. Paid PDF에서 career 선택자에겐 career section을 1500단어 중 750단어, 나머지 4개 합쳐서 750단어로 weight 차등. CTA copy에 명시: "Your selected reading style gets primary weight."
3. **landing hero 옆에 "Why not ChatGPT?" 비교 박스 1개 추가** (200자 이내). "ChatGPT Custom GPTs hallucinate birth charts. We compute them deterministically using 立春 rules, then LLM only interprets." 이게 우리 technical moat인데 현재 copy에 매장됨. AI tool 비교하는 audience (Marie 같은 PM, dev, AI 광신도)가 $7 결제 friction 0으로 가도록 만드는 single most important copy 변경.
