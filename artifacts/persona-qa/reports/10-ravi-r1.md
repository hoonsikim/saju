# Persona QA Report — 10 Ravi

## 1. 자기소개 (1줄)
29세, 뱅갈루루 SW engineer (ThinkPad Chrome IN wifi), HN "Korean BaZi site" 링크 호기심 유입 — Vedic 박사 시각으로 BaZi system structural 비교 검증.

## 2. competitor 기준 (1줄)
나는 평소 AstroSage Kundli (Vedic) + kundli match site를 사용/비교한다 (50+ page kundli PDF, Lahiri ayanamsa, Vimshottari Dasha 익숙).

## 3. 7-Stage Walk-Through

### 3.1 Landing (30초)
- 첫인상: `?lang=hi` 쳤는데 Devanagari 한 글자도 안 나옴. URL param이 그냥 무시되고 영어로 fallback. "🌐 English 한국어 日本語 中文" selector에 हिन्दी 옵션 자체가 없음. 인도 12억 인구 6번째 글로벌 언어인데 통째로 빠진 거 보면 "we don't see you" 시그널.
- painpoint: severity 4 — Hindi fallback이 placeholder조차 아니라 silent fallback. SW engineer로서 URL param 처리 broken이라고 즉시 판단.
- delight: Headline "Your fate, in the language Korea has used for 1,000 years" — positioning은 honest. "Not Western astrology pretending to be Eastern. The real thing" 카피는 self-aware. Vedic 사람으로서 "OK at least they're not faking depth"는 신뢰 +0.5.
- 이탈 결정? No (30초) — Vedic vs BaZi 비교 호기심이 hi 누락 짜증을 이김. 그러나 신뢰 baseline은 이미 낮음.

### 3.2 Input
- 첫인상: "Birth date / Birth time (local) / Gender / Birth city (optional)" — minimal. AstroSage는 latitude·longitude·timezone·DST·ayanamsa 선택(Lahiri/Raman/KP/Sayan)까지 요구해서 결과가 deterministic. 여기는 city가 optional이고 ayanamsa 개념 자체가 없음. SW engineer 시각으론 "input 부족하면 output 어떻게 deterministic?" 의문.
- painpoint: severity 3 — Birth city optional은 hour pillar 계산에서 longitude 보정이 빠진다는 뜻 (true solar time 미적용). Vedic에서는 lagna가 4분만 어긋나도 ascendant 다르게 나오는데, BaZi도 hour stem 경계에서 동일 문제 발생. 박사급에겐 즉시 red flag.
- delight: 폼이 가볍고 ThinkPad Chrome에서 즉시 렌더. No signup, browser-side 계산 disclosure (about 페이지)는 GDPR 의식하는 인도 tech 입장에서 +1.
- 이탈 결정? No — "browser-side 계산" 주장 검증하고 싶음.

### 3.3 Rendering
- 첫인상: Year/Month/Day/Hour pillar + Five Elements + Day Master + Void(空亡) + 神煞 + 歲運 + 大運 — structural completeness는 BaZi 표준 충족. 漢字 옆에 영어 gloss 있음(Auspicious Stars, Major Luck)은 cross-cultural에 +1.
- painpoint: severity 3 — Vedic 27 nakshatras + 9 grahas + 12 houses + Vimshottari Dasha (120년 cycle, 9 maha-dasha + sub-periods까지) 대비 BaZi는 8 char + 10 stems + 12 branches + 60 갑자 cycle. **structural granularity는 Vedic이 명백히 더 깊음.** Vedic은 한 사람 인생을 분 단위 timing까지(antar-dasha sub-period), BaZi 大運은 10년 단위. 박사 시각: "this is a lower-resolution system."
- delight: Rule-based 계산을 browser에서 한다는 점은 SW engineer로서 inspect해볼 가치 (GitHub MIT licensed). Vedic free 사이트 99%가 server-side 블랙박스인데 이건 audit 가능.
- 이탈 결정? No — 영어 reading quality 보고 싶음.

### 3.4 Upsell
- 첫인상: "Deeper LLM Reading · $7 · 1500-word PDF · AI-powered". "AI-powered" 한 단어가 전부. 어떤 LLM? GPT-4o? Claude? Llama 파인튜닝? 모델·temperature·prompt 전혀 disclosure 없음. SW engineer로서 "LLM black box on top of rule-based engine" = 두 단계 신뢰 손실.
- painpoint: severity 4 — $7 자체는 ₹580 정도라 인도 기준에서도 부담은 아니지만, LLM 출력은 본질적으로 비결정적(non-reproducible). 같은 input에 다른 output. Vedic Brihat Parashara Hora Shastra(BPHS) 같은 1500년 된 reference 텍스트의 rule lookup이 아니라 stochastic generation. "1500 words of plausible-sounding text" = Barnum effect 위험.
- delight: Lemon Squeezy MoR + 14-day right of withdrawal waiver 명시 — payment legal hygiene은 깔끔. Stateless·private 표기.
- 이탈 결정? No — 결제는 안 하지만 평가 계속.

### 3.5 Paid email (가설)
- "결제 후 email 받으면 만족할 조건": (a) LLM 모델명·version·prompt 일부 공개, (b) 출력 reproducibility 보장(seed 고정 또는 cache), (c) 1500 words 안에 generic horoscope-speak("you are sensitive but strong") 비율 20% 미만, (d) BaZi classical text 인용 1회 이상(예: 子平真詮 인용 문장), (e) confidence boundary 명시(예: "이 해석은 day master rule X에서 도출, classical interpretation에서 50% deviation").
- 가설 결제 의향: 1/10 — anchor 1 = "회의적, 결제 거의 안 함". HN 보고 호기심으로 들어온 박사가 다른 system($7)에 돈 쓸 가능성 매우 낮음. AstroSage는 ₹0 무료에서 50 page PDF 주는데 BaZi 1500 words에 $7? 가성비 안 맞음.

### 3.6 Share
- 보낼 채널: HN comment + WhatsApp 인도 친구 그룹.
- HN comment 텍스트(영어): "Korean BaZi site, browser-side rule engine, MIT licensed. Structurally shallower than Vedic Vimshottari Dasha (10y blocks vs minute-level antar-dasha sub-periods) but the engineering hygiene (no signup, audit-able JS, Lemon Squeezy MoR) is unusually clean for an astro site. Hindi locale missing despite `?lang=hi` URL param. $7 LLM upsell with zero model disclosure — skip that part."
- WhatsApp 메시지: "yaar dekho — Korean BaZi calculator, free part is clean code. Vedic dasha is deeper but this is fun for comparison. Hindi nahi hai."
- viral 충동: 5/10 — HN tech 커뮤니티에 "interesting engineering, shallow system" 코멘트 가치 있음. SNS viral은 X (Vedic vs BaZi는 인도 일반 대중 관심사 아님).

### 3.7 Return
- 다음에 또 올까? No (회의주의). Vedic kundli 매일 한 번 보는 daily rashifal 습관 있지만 BaZi 매일 갈 hook 없음. "today's 일진" 페이지가 있다지만 영어 사용자가 "ilji"라는 단어 자체를 이해 못 함.
- Return hook 필요: daily English transit reading + Vedic dasha 비교 column + 영어 nakshatra equivalency 표 — 그래야 Vedic literate 한 명이 weekly 옴.

## 4. Core Dim Deep Evaluation

### 4.1 Vedic vs BaZi 비교 (structural critique)
Vedic Vimshottari Dasha는 120년을 9 행성에 비례 분배(Ketu 7y, Venus 20y, Sun 6y, Moon 10y, Mars 7y, Rahu 18y, Jupiter 16y, Saturn 19y, Mercury 17y)하고 각 maha-dasha 안에 antar-dasha(같은 9분할) → pratyantar → sookshma → prana까지 5단계 nested timing. 결과: 인생 사건을 **분 단위 window**까지 예측 시도. BaZi 大運은 10년 1 stem-branch block. **차이는 시간 분해능 1000배.** 또 Vedic 27 nakshatras 각각이 13°20' 단위로 ruling planet + symbol + deity + pada(quarter) 4개를 가져서 한 사람 moon nakshatra가 personality·career·marriage 모두 다른 layer 제공. BaZi의 day master + 神煞 조합은 categorical(약 60종) — combinatorial depth가 Vedic 격자(27 nak × 9 dasha × 12 house = 2916 base states)에 못 미침. **결론: 박사 시각에서 BaZi는 lower-resolution system, 그러나 "단순함이 곧 robustness"라는 반론도 인정함**(과적합 위험 적음, calibration 안정).

### 4.2 hi_quality (Hindi fallback 실측)
`?lang=hi` URL param 무시. Language selector("🌐 English 한국어 日本語 中文") 자체에 हिन्दी 옵션 부재 — placeholder조차 없음. silent fallback to English. WebFetch 결과 Devanagari 문자열 0건 확인. **인도 시장 무시 시그널.** AstroSage가 Hindi·Tamil·Telugu·Marathi·Gujarati·Kannada·Malayalam·Bengali 8개 인도 언어 지원하는 baseline 대비 0/9. 박사 입장에서 "global"이라 자칭하지만 인도 12억 무시는 product 결정으로서 큰 omission.

### 4.3 영어 reading quality (Vedic 영어 문헌 비교)
About 페이지·landing 모두 classical 출처(子平真詮·滴天髓 같은 BaZi 정통) 0회 인용. Vedic 영어권은 BPHS(Brihat Parashara Hora Shastra, 약 1500년 전 텍스트) 영역본을 free PDF로 보유하고 정통파는 verse 단위 인용("BPHS Ch.7 verse 23에 의하면...")이 baseline. 이 사이트의 정통성 주장은 "Korean tradition · Code = MIT licensed" 뿐. **출처 없는 정통성 주장은 SW engineer + 박사 양쪽 lens 모두에서 신뢰 -2.** "the real thing"이라고 self-claim하지만 reference 없음 = empty assertion.

### 4.4 회의 검증 (사실 vs 점성 vs 데이터)
SW engineer로서 분류: (a) **사실 layer** = 4 pillar stem-branch 변환은 deterministic 천문 계산(60갑자 + 立春 분기점) — 검증 가능. GitHub 소스 audit 가능은 +2. (b) **rule layer** = 神煞 종류, 五行 balance score — 룰북 정의면 reproducible. 그러나 어느 룰북? 한국 정통과 중국 정통이 神煞 정의 다름, disclosure 없음. (c) **LLM layer** = 1500-word reading — 본질적 stochastic, Barnum effect 위험 高. 사용자가 (a)(b)(c) 구분 못 함이 핵심 문제. **Trust hygiene 제안: 무료 결과에 "이 출력은 rule-based, deterministic" 라벨 + 유료 결과에 "this is LLM-generated narrative, non-deterministic" 라벨 분리 표시 필수**.

### 4.5 결제 거부 이유 (anchor 1 reasoning)
anchor 1 = "회의적, 결제 거의 안 함". 거부 이유 분해: (1) Vedic 박사가 비교 system에 돈 안 씀(자기 system 더 신뢰), (2) AstroSage 무료 50p PDF 대비 BaZi $7 1500 words = info 밀도 1/30, (3) LLM disclosure zero — 어느 모델, 어느 prompt인지 모르고 결제 = SW engineer 직업적 거부감, (4) reproducibility 보장 없음 — 두 번 사면 두 결과 나올 수 있음, (5) 인도 결제 friction(Lemon Squeezy는 인도 UPI 미지원, 카드 international fee). **무엇이 trust 신호가 되었을 결제 트리거?** — (a) GitHub에 prompt 공개 + 모델명, (b) "BaZi vs Vedic" 비교 article 무료 제공(인도 사용자 hook), (c) ₹가격 표시 + UPI 결제 옵션, (d) classical text 인용 한 줄이라도. 이 중 하나라도 있으면 anchor 1 → 3 상향 가능.

## 5. 동기 만족도
점수: 3/10
이유: 동기 = 회의(Vedic vs BaZi 어느 게 정확). 사이트가 답한 것: BaZi structural surface(4 pillars + 5 elements + 大運) 확인 가능 → "shallower than Vedic"이라는 결론은 났음. 답하지 못한 것: (1) BaZi와 Vedic의 timing 비교 case study, (2) BaZi rule의 출처 — 子平 vs 滴天髓 vs 한국 정통 어느 것, (3) 검증 가능한 prediction track record. 동기 "정확도 비교" 자체가 사이트 design intent 밖이라 부분 답변. anchor "부분적=5" 미만으로 평가 — 회의 동기는 "약함=3" 적합.

## 6. 친구 공유
- 공유 채널: HN comment + WhatsApp 인도 친구 그룹 (3-5명, tech-savvy Vedic literate)
- 보낼 메시지 텍스트:
  - HN: "Korean BaZi calculator, MIT-licensed browser-side rule engine. Structurally shallower than Vedic Vimshottari but cleaner engineering than 99% of astro sites. Hindi locale missing. Skip the $7 LLM upsell — zero model disclosure."
  - WhatsApp: "Korean BaZi calculator dekho — Vedic se kam depth but code clean hai. Free part theek hai, paid mat lo."

## 7. 이탈 지점
- Yes/No: No (free 단계 끝까지 봄, 그러나 결제 거부)
- 어디서 stop spending: stage 3.4 Upsell
- 왜: LLM 모델·prompt·reproducibility 0 disclosure + Hindi locale 무시 + Vedic 무료 alternative(AstroSage 50p PDF) 대비 가성비 명백히 안 맞음. 박사+엔지니어 dual lens에서 모두 fail.

## 8. 결제 의향
- 점수: 1/10
- 행동 기준 (anchor): anchor 1 = 회의적, 결제 거의 안 함
- 이유: Vedic 박사로서 비교 시스템에 돈 쓸 동기 약함. SW engineer로서 LLM 블랙박스 + reproducibility 미보장이 직업적 거부 트리거. 인도 결제 friction(UPI 미지원 추정) 추가 마찰. anchor 정의 "결제 거의 안 함"과 일관.

## 9. 개선 제안 Top 3 (Ravi 시각, actionable)

1. **`?lang=hi` URL param에 실제 Hindi 리소스 binding + language selector에 हिन्दी 추가**, 최소한 landing headline·CTA·form labels 3개 string부터(AstroSage Hindi UI 참고). 그리고 URL param 미지원 언어는 "Hindi coming soon — currently English" toast로 silent fallback 방지. 인도 시장 outreach 핵심 0→1.

2. **무료 결과 페이지 상단에 "Methodology" expandable section 추가**: (a) "rule-based deterministic computation (audit on GitHub: link to specific file)", (b) "立春 boundary handling: hour-precise, 한국 정통 기준", (c) 神煞 정의 출처 1줄(예: "based on 滴天髓 + 한국 정통 변형"). 박사·skeptic 양쪽에 trust signal 즉시 +2.

3. **$7 LLM Upsell 카드에 model card 1줄 추가**: "Generated by [model name] with fixed seed for reproducibility. Same input → same output guaranteed. Prompt template on GitHub." SW engineer trust 트리거. 추가로 "compare with your Vedic chart" toggle(무료) — Vedic dasha 박사들이 BaZi 비교 article 보러 weekly 재방문 hook 형성, AstroSage 사용자층 일부 흡수.
