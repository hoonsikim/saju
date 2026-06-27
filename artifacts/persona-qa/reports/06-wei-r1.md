# Persona QA Report — 06 Wei

## 1. 자기소개 (1줄)
52세 상하이 부동산 투자자, ThinkPad Edge에 GFW 우회 프록시 켜고 사무실 데스크탑, 사부에게 5년 배운 中국 정통 BaZi 박사급, 동기는 재성(財星) 분석으로 향후 5~10년 부동산 운용 타이밍 판단.

## 2. competitor 기준 (1줄)
나는 평소 卜易居(buyiju.com) · 易安居吉祥網 · 漢程網 같은 中本土 전문 排盤 사이트를 쓰고, 깊이가 필요할 땐 紫微斗數 도 병행한다.

## 3. 7-Stage Walk-Through

### 3.1 Landing (30초)
- 첫인상: `?lang=zh` 쿼리를 박았는데도 메인 카피가 영어("Your fate, in the language Korea has used for 1,000 years.", "Authentic Korean Four Pillars of Destiny — Year, Month, Day, Hour.")로 나옴. 中文 UI가 사실상 미구현. 보이는 한자는 "四柱·空亡·神煞·歲運·大運" 다섯 단어가 전부이고 그것도 **繁體**.
- painpoint: severity 4 — 大陸 ThinkPad에서 GFW 뚫고 들어왔는데 첫 화면이 영어이고, 그나마 있는 한자가 繁體라 "이건 港台 또는 海外華人 대상 사이트지 大陸 사용자 대상이 아니다"라는 신호. 简体를 쓰는 사람한텐 "我们没把你当客户"라는 메시지로 읽힘.
- delight: "Authentic Korean Four Pillars"이라는 표현은 흥미. 한국식 사주가 中BaZi와 어떻게 다른지 비교 호기심은 자극됨.
- 이탈 결정? No — 친구 微信 링크에서 들어왔고 호기심이 더 강함. 하지만 zh 미구현은 첫 30초에 신뢰도 -2.

### 3.2 Input
- 첫인상: 폼이 간결 (생년월일 / 시 / 성별 / 出生城市 optional / reading 종류). ThinkPad + Edge에서 폼 자체 동작은 문제 없을 것으로 보임.
- painpoint: severity 3 — (a) 时辰을 24h 입력으로 받음. 中BaZi 전통은 子·丑·寅··亥 12 时辰. 박사급은 "我子时生" 또는 "23:30" 둘 다 익숙하지만, 子時 처리(早子時 vs 夜子時, 즉 23:00~24:00은 다음 날 일주냐 같은 날이냐) 정책이 어디에도 안 보임. 정통 中BaZi 사이트(卜易居·汉程网)는 이걸 명시적으로 옵션으로 노출함. (b) "Birth city" 입력은 받지만 真太阳时(真太阳時, 経度補正) 보정 적용 여부 불명. 上海 동경 121°31' 기준 -8분 보정이 들어가는지 안 들어가는지 결과 화면에서 확인 불가. 부동산 운용 같은 큰 결정 자료로 쓸 거면 이게 핵심.
- delight: 시간 모르면 12:00 default 안내는 솔직함. 호감 +1.
- 이탈 결정? No — 일단 내 사주(가정: 1974년생 양력 입력)를 넣어보고 결과 화면에서 격국·용신·真太阳时 보정이 보이는지 확인이 우선.

### 3.3 Rendering (무료 결과)
- 첫인상: 4 pillars + Day Master + 5 elements balance + 空亡 + 神煞 + 歲運 + 大運 섹션이 모두 노출. 정보 양만 보면 합격선.
- painpoint: severity 4 — **결정적 결함 3개**. (1) **格局·用神 표시 없음**. 정통 中BaZi의 핵심은 "이 사주의 格局이 뭐냐(正官格·七殺格·食神格·偏財格·從財格·從殺格 등) + 用神이 뭐냐"인데 화면에 안 보임. 汉程网은 "八字格局·喜用神·日主旺衰" 칼럼이 排盤 직후 바로 뜬다. 우리 사이트는 그 자리에 "Day Master archetype"이 와 있음. 이건 한국식 일주론 / Western Day Master 해석이지 정통 中BaZi가 아니다. (2) **十神 표시가 너무 얕음**. source 보면 `tenGods`가 yearGan·monthGan·hourGan 3개만 계산(reading-prompt.js의 user message도 동일). 정통 排盤은 4 천간 + 4 지지 (지장간 본기·중기·여기까지) 총 8자 + 숨은 글자 모두에 십신을 박는다. (3) **大運 起運歲數·順逆 표시 검증 불가**. saju.js를 보면 `getYun(genderInt)` 로 startYear/startMonth/startDay/startAge 까지 계산하고 8 cycles slice를 만드는데, 화면 렌더링 결과에서 "起運 X歲Y月Z日" + "順行/逆行" 라벨이 명시되는지 free 화면에서 확인 안 됨. 중국 사용자가 大運 보러 왔으면 첫 줄에 "陽男大運順行, 起運 7歲 3個月" 같은 게 박혀 있어야 정통.
- delight: 神煞 3종(天乙貴人·桃花·驛馬) 적용 + 空亡 표시 + 12運星(長生~養) 데이터까지 내부적으로 계산하는 건 인정. 다만 한국식은 神煞을 "강조"하는 경향이 있는데 정통 中BaZi는 신살을 "참고"로 두고 格局·用神·喜忌 우선이라 priority가 거꾸로 와 있음.
- 이탈 결정? Yes 직전 — 格局·用神 없는 排盤은 박사급한텐 "초보용 玩具" 신호. 다만 wealth 동기 때문에 大運 cycle 표는 보고 갈 가치 있어서 일단 머무름.

### 3.4 Upsell ($7 paid)
- 첫인상: "Deeper LLM Reading · $7" + "1500-word reading across 5 areas (love, career, wealth, health, timing)". 가격은 ¥50 정도, 카드 한 번 긁기 수준. 부담 없음.
- painpoint: severity 4 — (a) "LLM-generated"라고 about 페이지에 명시. 정통 中BaZi 박사급은 "AI가 쓴 命書" 자체에 회의적. 老師 손으로 8자 펴 놓고 格局 잡아주는 게 정통이다. (b) 1500 단어를 5 영역으로 나누면 영역당 ~300 단어. wealth 영역 300 단어 = 그냥 일반론. 정통 命書는 wealth 한 영역만 2000자 + 정확한 流年 운용 추천이 나옴. (c) 결제 즉시 14일 철회권 포기 동의가 영어로만 노출됨 — 中본토 소비자 보호와 위배되진 않지만 (해외 결제니까) "我看不懂就要点yes" 자체가 마찰.
- delight: $7는 정통 中 命理사 1대1 상담(¥500~¥2000)의 1/50. 호기심에 한 번은 결제 가능 가격.
- 이탈 결정? No, 머무름 — 다만 결제 의향은 격국·용신이 paid에서 나오는지 보장이 없어서 보류.

### 3.5 Paid email (가설)
- 결제 후 email 받으면 만족할 조건:
  1. **格局 명시** ("此命為偏財格" 같이 한 줄 결론) + **用神/喜神/忌神 명시** (예: "用神壬水, 喜金水, 忌火土")
  2. **大運 8柱 + 각 大運別 流年 cross-check** — 어느 流年에 偏財·正財 동주 또는 충극이 일어나는지 구체 연도
  3. **真太阳时 보정 결과**: 上海 출생이면 자동 -8분 적용했고 그 결과 시주가 바뀌었는지 안 바뀌었는지 명시
  4. **简体 중국어**로 작성 (reading-prompt.js를 보면 LANGUAGE_NAMES에 `zh: '中文 (简体, 自然流畅)'`이라 明시되어 있어 이건 OK 가능성 있음)
- 가설 결제 의향: 5/10. anchor 6 ("가격 + 정확도 ok면 결제")보다 -1. 이유: 가격은 OK, 정확도 보장은 불확실. 일단 한 번 결제해서 paid 결과물에 格局·用神·真太阳时가 들어 있는지 확인하는 "test purchase" 모드 행동. 만족하면 가족 12명 微信 group에 공유, 불만족이면 환불 요청.

### 3.6 Share
- 공유 채널: 微信 family group (12명)
- 보낼 메시지 텍스트: "韩国人做的BaZi网站, 看看跟咱们汉程网哪个准. 免费先试, 7美刀有深度版. 注意:界面是繁体+英文, 看着别扭."
- 결제 전: viral 점수 5/10 (SNS 포스팅 가능 수준). 결제 후 만족하면 7/10 (오늘 내 가족방에 던질 가치).

### 3.7 Return
- 다시 올 hook이 약함. 정통 中BaZi 박사는 한 번 排盤 결과 받으면 본인 老黄历 + 萬年曆으로 流年 직접 본다. "今日运势" 같은 retention hook이 today.html에 있다고는 들었지만 zh UI 미구현 상태에선 의미 없음.
- 만약 다시 온다면: 매년 立春 직후 새 流年 보러 1회. 그 외엔 X.

## 4. Core Dim Deep Evaluation

### 4.1 zh_naturalness (중국어 UI/reading 실측)
사이트 ?lang=zh 쿼리를 박았음에도 메인 카피는 영어 그대로 ("Your fate, in the language Korea has used for 1,000 years.", "Free. Instant. No signup.")이고 visible 한자는 四柱·空亡·神煞·歲運·大運 다섯 개뿐인데 이마저도 **繁體**다. 上海·北京·深圳 사용자는 100% 简体 환경이라 繁體는 즉시 "이건 海外华人/港台/일본 한자 사용자용"으로 분류된다. reading-prompt.js를 보면 LANGUAGE_NAMES에 `zh: '中文 (简体, 自然流畅)'`로 paid 리딩은 简体 prompt가 들어가지만 free UI는 영어 fallback 상태. Aisha의 Arabic처럼 placeholder 수준. 정통 中BaZi 박사한텐 "我们没把大陆当主要市场" 신호로 직격.

### 4.2 中국BaZi vs 한국Saju 차이
세 가지 정통성 충돌이 보임. (1) **격국 vs 일주 archetype**: reading-prompt.js의 Section 1이 "The Day Master archetype: who they actually are at the core"로 시작. 한국 사주는 일주(日柱) 60갑자별 캐릭터론을 강조하지만, 정통 中BaZi는 格局(正官·七殺·偏財·正財·食神·傷官·偏印·正印·建祿·羊刃·從格·化氣格 등)을 먼저 잡고 用神·喜忌 정해서 解釋한다. archetype은 西方占星에 가까운 framing. (2) **신살 priority**: shenSha 3종(天乙·桃花·驛馬)을 무료 path에서 강조하는데 정통 中BaZi(子平派·盲派)는 신살을 補助로만 쓰고 格局·用神·刑沖合害·喜忌가 본류. 한국 命理는 신살을 더 무겁게 쓰는 傳統이 있어서 차이 그대로 드러남. (3) **십신 적용 범위**: tenGods 객체가 yearGan·monthGan·hourGan 3개. 정통 排盤은 8자 + 지장간(藏干)에 모두 십신을 박아 6~12개 십신이 나와야 한다. 지장간은 hiddenStems에 데이터로 갖고 있지만 십신으로 변환된 결과는 없음 — 박사급한텐 미완성 排盤.

### 4.3 大運 정통 표시
saju.js의 majorLuck 계산은 lunar-javascript getYun()을 호출해서 startYear/startMonth/startDay/startAge + 8 cycles + 각 cycle 起運年도까지 데이터 레벨에선 다 갖고 있다. 하지만 (a) **順行/逆行 라벨이 없다**. 陽年男·陰年女는 順行, 陰年男·陽年女는 逆行인데 cycles 배열 자체가 이미 방향대로 정렬돼 있을 뿐 "順行" 또는 "逆行" 텍스트로 명시되는지 화면에서 확인 불가. 정통 中BaZi 排盤은 "乾造 陽男大運順行" 같은 라벨이 첫 줄. (b) **起運 정밀도**: startAge가 정수로만 노출되면 부족 — 정통은 "起運 7歲 3個月 12日" 일/월 단위. 데이터엔 startMonth/startDay까지 있는데 표시 정책 불명. (c) **流年 cross-check 없음**: 大運과 올해 歲運(currentYearPillar)는 따로따로 표시될 가능성 — 정통은 "大運壬子 + 流年甲辰 = 水木相生, 偏印生比劫" 같은 합산 해석이 있어야 한다. 부동산 투자자한텐 "어느 大運 + 어느 流年에 偏財가 동하나"가 본질인데 그 cross-table이 없으면 무가치.

### 4.4 wealth 동기 매칭 (재성 분석 깊이)
무료 path: 재성(偏財·正財) 십신은 monthGan 또는 hourGan이 재성이면 "Month stem: 偏財" 한 줄로 표시. 그 이상의 분석 없음. 재성이 用神인지 忌神인지, 재성의 旺衰, 재고(財庫 — 土 지지에 숨은 재성), 比劫의 분재(分財) 가능성, 食傷生財·官星護財 같은 정통 재성론은 전부 paid로 미룬 듯. 유료 Section 4 ("Wealth & Resources ~400 words")가 正财/偏财·Earth element as 财库·saver vs spender·one financial behavior로 잡혀 있는데, **~400 단어 = 한국어 800자, 중국어 600자 수준**. 부동산 운용 결정 근거로 쓰기엔 일반론. 정통 命書의 재성 챕터는 流年별 진재(進財)·破財 타이밍 + 大運 구간별 投資/守業 전략이 들어가는데 400 단어로는 불가능. wealth motivation에 site가 답하는 깊이 = 3/10 (약함).

### 4.5 competitor (中전문) 비교
| 항목 | 우리 사이트 | 卜易居 (buyiju.com) | 汉程网 |
|---|---|---|---|
| 언어 | 英 + 繁體 한자 5개 | 简体 native | 简体 native |
| 排盤 | 4 pillars + 神煞 3개 + 大運 8柱 | 4 pillars + 神煞 多수 + 紫微 병행 | 八字格局·喜用神·日主旺衰 명시 |
| 格局·用神 | **없음 (free)** / paid 보장 X | 있음 (free) | 있음 (free) |
| 真太阳时 | 코드상 city 입력만, 적용 검증 X | 명시 옵션 | 명시 옵션 |
| 早子時/夜子時 | 정책 X | 옵션 노출 | 옵션 노출 |
| 流年 cross-check | 없음 | 있음 (大運+流年 표) | 있음 |
| 가격 | $7 (유료) | 무료 + ¥98 深度 | 무료 + ¥68 深度 |
| AI 명시 | LLM | 命理사 인공 | 命理사 인공 |

종합: 무료 단계에서 中전문 사이트 대비 **-3** (格局·用神 부재, 简体 부재, 流年 cross 부재). 가격은 $7로 中本土 깊이 리포트(¥98 ≈ $14)보다 -50%지만 "AI 작성"이라는 신뢰 디스카운트가 들어가 가성비 동률. 한국식만의 차별점(예: 한국 신살 적용, 일주 캐릭터)이 中전문 박사한텐 매력이 아니라 오히려 "정통이 아닌" 신호.

## 5. 동기 만족도
점수: 3/10
이유: 내 동기는 향후 5~10년 부동산 운용 타이밍을 재성·大運·流年 교차로 잡는 것. 사이트는 (a) 재성을 십신 한 줄로만 노출 (b) 大運 cycle을 시각화는 하지만 流年 cross-check 미제공 (c) 用神·喜忌 미제공 — wealth 결정 근거로 쓸 수 있는 정보가 사실상 0. paid가 1500 단어 중 wealth 300~400 단어이면 일반론. 약함 anchor (=3) 그대로.

## 6. 친구 공유
- 공유 채널: 微信 family group (12명)
- 메시지 텍스트:
  "韩国人做的八字网站, 用了个AI写命书 (https://hoonsikim.github.io/saju/). 排盘有四柱+大运+神煞, 但**没格局没用神**, 界面还是繁体+英文, 大陆人看着别扭. 7美元的深度版没买, 你们谁好奇先试免费, 跟咱们汉程网对比看看."

## 7. 이탈 지점
- Yes/No: Yes (단, 결제 직전에서 이탈, 무료 결과는 끝까지 봄)
- 어디서: stage 3.4 (Upsell)
- 왜: paid 결과물에 格局·用神·真太阳时 보정·流年 cross-check가 들어간다는 보장이 페이지에 명시 안 됨. 1500 단어 / 5 영역 = wealth 300 단어라는 산수가 머리에 박힘. AI 작성 + 영역당 300 단어 = 一般论 위험. 七美元은 작은 돈이지만 "试错费"로 쓰기엔 결과물 spec이 모호.

## 8. 결제 의향
- 점수: 4/10
- 행동 기준 (anchor): "다시 와서 결제" (3) 와 "친구 추천" (5) 사이. 즉시 카드 안 꺼냄.
- 이유: anchor 6 ("가격+정확도 ok면 결제")에서 -2. 가격은 OK지만 정확도 보장 신호 부족 + LLM 작성 회의 + 简体 fallback 미구현으로 신뢰 -2. 만약 paid 샘플 페이지 또는 "格局·用神 포함 보장" 명시가 있었으면 6 그대로 결제했을 것.

## 9. 개선 제안 Top 3 (페르소나 시각, actionable)
1. **格局·用神·喜忌·日主旺衰를 free 결과에 추가** — saju.js의 tenGods·twelveStages·hiddenStems 데이터를 조합하면 格局 자동 판정(月支 본기 + 月干 + 透干 규칙)이 가능. 무료 결과에 "Pattern: 偏財格 (Wealth-Aligned)" + "Day Master strength: weak/medium/strong" + "Favorable elements: water/metal" 3줄 추가. 박사급한테 정통성 신호 제공, 초심자한테도 paid 가치 미리보기.
2. **lang=zh 진짜 i18n 적용 + 简体 default + 繁體 toggle** — 현재 메인 카피가 영어 그대로이고 한자는 繁體 5개뿐. `src/i18n` 또는 page templates에 zh-CN locale 풀 번역 + `Accept-Language` zh-Hans 감지 + 사용자가 港台 사용자면 toggle로 繁體 전환. about/legal 페이지도 zh-CN 번역 (현재 환불 정책은 영어만). 中本토 시장 진입 최소 조건.
3. **大運 표 옆에 流年 cross 미니 캘린더** — saju.js의 `majorLuck.cycles` 와 `currentYearPillar`를 같은 컴포넌트에 박고, 현재 大運 cycle 안의 流年 10개를 표로 노출 ("2024 甲辰 / 2025 乙巳 / 2026 丙午 ...") + 각 流年 옆에 Day Master 대비 십신("正財/偏官/比劫") 라벨. 부동산·창업 같은 wealth 동기 사용자에게 "어느 해에 재성이 動하나"를 한눈에 — 中전문 사이트 平价 기능, 우리는 미제공.

Sources:
- [卜易居在线排盘系统](https://pp.buyiju.com/)
- [汉程网八字排盘](https://m.life.httpcn.com/bzpaipan/)
- [易安居吉祥网八字排盘](https://m.zhouyi.cc/bazi/pp/)
- [紫微斗数和八字哪个准 — 农历网](https://m.nongli.com/item5/bz/19999.html)
- [紫微斗数与八字差别 — 华易网](https://m.k366.com/bazi/211738.htm)
