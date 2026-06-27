# Persona QA Report — 01 민지

## 1. 자기소개 (1줄)
27세, 서울 직장인, iPhone 14 Pro Safari, 점심시간 회사 화장실에서 친한친구가 카톡 1:1로 보낸 링크 클릭 — 동기는 career(직무 이직·평가 시즌 고민).

## 2. competitor 기준 (1줄)
나는 평소 **만세력닷컴**(manseryeok.com)을 사주 궁금할 때 쓴다. 무료, 한국어, 년주·월주·일주·시주 + 신살·대운까지 다 나옴. 결제는 한 번도 해본 적 없다.

## 3. 7-Stage Walk-Through

### 3.1 Landing (30초)
- 첫인상: 카톡 인앱브라우저로 열었더니 헤딩이 영어 — "Your fate, in the language Korea has used for 1,000 years". 한국 사이트가 왜 한국인한테 영어 헤딩으로 환영하는지 1초 안에 위화감. URL에 `?lang=ko` 안 붙은 채로 친구가 링크 줘서 그런 듯. 상단 어딘가 "한국어" 토글이 있다고는 하지만 화장실 좁은 화면(390pt)에서 어디 있는지 손으로 더듬게 됨.
- painpoint: severity 3 (한숨 + 계속) — "Free. Instant. No signup." 카피가 진정시켜 줘서 한 번은 참음.
- delight: "Authentic Korean Four Pillars of Destiny — Year, Month, Day, Hour" 카피는 만세력닷컴보다 깔끔. 만세력닷컴은 광고 배너부터 뜨는데 여기는 안 뜸.
- 이탈 결정? No — 친구가 보낸 링크라 의리로 한 번 더 스크롤. 30초는 버팀.

### 3.2 Input
- "Birth date / Birth time (local) / Gender (Prefer not to say / Female / Male) / Birth city (optional) / Reading style (General · Career & work · Love & relationships)" 폼. 라벨이 영어로 노출되는 게 디폴트 — 한국어 토글 누르기 전에 폼이 먼저 보임.
- painpoint: severity 4 (짜증) — iOS Safari에서 `<input type="date">`면 iOS 네이티브 wheel picker가 뜨겠지만 fetch한 HTML로는 dropdown인지 number 입력인지 확신 불가. 만약 년/월/일 세 dropdown이면 1985년생 친구 사주 보러 1985까지 스크롤하다가 손목 아픔. iPhone 14 Pro에서도 작은 month dropdown은 한 손 엄지로 잘못 누르기 쉬움.
- delight: "Gender: Prefer not to say"가 첫 옵션인 건 좋음. 만세력닷컴은 男/女 강제.
- 이탈 결정? No, 일단 내 생년월일 1998-09-XX 14:30 입력. "Birth city"는 optional이라 스킵.

### 3.3 Rendering
- 무료 결과로 4 pillars / 5 elements / 신살 / 세운 / 대운 / reading이 나온다고 카피에 적혀 있는데, 화장실 10분 안에 "신살(神煞)" 한자가 작은 폰트로 뜨면 동네 점쟁이가 종이에 휘갈긴 거 보는 느낌. 만세력닷컴은 한자에 한글 병기를 해줘서 "겁재(劫財)"처럼 읽힘. 여기는 카피 단계에서 이미 한자만 보임 ("四柱, 神煞, 大運" 등).
- painpoint: severity 3 — 나는 BaZi 중간 지식(만세력 가끔 봄)이라 "대운"은 알지만 "신살" 항목 안의 "도화살·역마살"까지 한자로만 오면 한 호흡 멈춤.
- delight: Reading style을 Career로 고를 수 있다는 게 만세력닷컴엔 없는 기능. 만세력닷컴은 통짜 reading.
- 이탈 결정? No — 내 동기(career)에 맞춰서 결과 갈라준다는 약속 때문에 결과 페이지까지는 본다.

### 3.4 Upsell
- "$7 Deeper LLM Reading · 1,500-word PDF (love, career, wealth, health, timing)". 가격이 **달러 표시** — 화장실에서 환율 계산("7달러면 한 9,500원이네") 한 번 더 머리 굴려야 함. 만세력닷컴은 무료가 끝이라 비교 대상 자체가 없고, 한국 결제 사이트들(천명사주 등)은 처음부터 원화 9,900원 식.
- painpoint: severity 4 — Lemon Squeezy 결제(해외 결제 처음). 카드 정보 입력 페이지가 영어로 뜨면 회사 화장실에서 카드 꺼내서 결제하기 망설여짐. 환불 정책 ("All sales are final, instant delivery, waive 14-day right of withdrawal") 봤더니 더 멈칫. 한국 소비자보호법의 7일 청약철회 권리 포기를 한 번에 적어놓는 건 솔직하긴 한데 점심시간 화장실에서 클릭할 결정은 아님.
- delight: $7는 점심값 수준. 만약 원화 9,900원이고 카카오페이 결제됐다면 충동 결제 가능.
- 이탈 결정? Yes(잠정) — 결제 한 번 더 고민하려고 폐쇄 후 카톡으로 친구한테 "야 이거 결제해봤어?" 질문.

### 3.5 Paid email (가설)
- 결제 후 email 받으면 만족할 조건:
  1. **한국어 PDF** (영어 PDF는 점심시간에 읽기 부담). 카피상 reading style 선택은 한국어가 되지만 PDF 산출물 언어 명시가 없어서 불안.
  2. 회사 단톡방에 일부 캡처 공유 가능한 한 페이지 요약(첫 장에 "오늘의 한 줄" 같은).
  3. 카톡 첨부 가능한 파일 크기(2MB 이내).
  4. About 페이지의 "browser-only 처리" 약속이 PDF 생성 서버에도 적용되는지 명시. 안 적혀 있으면 결제 후 "내 생년월일이 LLM 회사로 흘러갔나" 의심.
- 가설 결제 의향: 4/10 — anchor 5 "친구 추천" 아래. 영어 PDF 가능성 + 환율 + 해외 결제 3종 세트로 결제 직전 멈춤.

### 3.6 Share
- 무료 결과 화면을 친한친구 1:1 카톡에 보낼 가치는 있음. 회사 단톡방은 X — career 분석 결과를 단톡방에 뿌리는 건 정보 노출.
- painpoint: severity 3 — 카톡 공유 시 og:image가 어떻게 잡히는지 fetch로는 확인 불가. 만약 OG가 영어 헤딩 그대로 들어가면 받는 친구가 "이게 뭐야 영어 사이트네" 1초 컷.
- delight: Today's Fortune 페이지에 "Share today's fortune" 카드 다운로드가 있어서 일진 카드는 캡처 공유 OK.
- 이탈? No — 결과 캡처는 친한친구 1:1로 일단 보냄.

### 3.7 Return
- "Bookmark this and come back tomorrow"(today.html) hook이 있긴 한데 만세력닷컴을 매일 안 가는 나는 굳이 매일 일진 보러 다시 안 옴. retention hook이 "오늘의 일진"뿐이면 일진 자체가 익숙한 한국 BaZi 중간 사용자한테는 약함.
- painpoint: severity 2 (알아챔) — daily 알림(이메일·푸시) 옵션이 카피상 안 보임. "Notify me when live"는 다른 기능 예고용.
- delight: 카피에 "LLM-deep daily guidance coming soon" 예고 있어서 한 번은 더 와볼 만함.
- 이탈? No (재방문은 1~2주 후 1회 정도, retention 약).

## 4. Core Dim Deep Evaluation

### 4.1 input_mobile_keyboard_iOS
fetched HTML에서 input 타입을 dropdown/wheel/number 중 무엇으로 쓰는지 명시가 안 보임. iOS Safari 사용자 입장에서 결정적인 분기점이라 이게 안 보이는 것 자체가 페이지가 "iOS-first"가 아니라는 신호. 만약 native `<input type="date">`면 iOS wheel picker가 자동 뜨지만 1998년 같은 과거 년도 스크롤이 손가락 한 번에 안 되고, 시(hour)는 24시간 wheel이면 14:30 입력에 3번 스크롤. 만세력닷컴은 년/월/일 세 dropdown인데 적어도 dropdown이 큰 폰트라 누르기 쉬움. iPhone 14 Pro의 dynamic island 영역 때문에 picker가 상단 노치에 가려질 수 있어서 화장실에서 한 손 입력은 짜증 (severity 4).

### 4.2 upsell_LS_brand_trust (해외 결제 처음)
Lemon Squeezy는 About 페이지에 "Merchant of Record"로 명시. 미국·유럽에선 친숙해도 한국 27세 직장인이 들어본 적 없는 브랜드 — Toss·KakaoPay 아이콘 옆에 있으면 한 번 더 신뢰갈 텐데 단독으로 뜨면 "이거 결제하면 카드 정보 어디로 가나" 의심. 환불 정책의 "All sales are final" + "waive 14-day right of withdrawal" 조합은 한국 소비자가 7일 청약철회로 보호받는 데 익숙한 정서와 정반대. 결제 페이지 전환 직전이 이탈 최대 지점 (severity 4 - 짜증 + 다른 페이지로 이동).

### 4.3 share_kakao_card_image
Today.html에 카드 다운로드 + share 기능 있는 건 점수. 무료 결과 페이지에서도 카드 이미지 캡처 공유 가능한지가 핵심. og:image / og:title이 한국어로 자동 잡히는지 fetch에서 확인 불가. 카톡 공유 시 영어 OG가 잡히면 받는 친구가 클릭 자체를 안 함 (회사 단톡 + 친한친구 모두 한국어 환경). 카톡 공유 카드 이미지가 만약 다크 골드 톤이면 단톡방에서 시각적 임팩트는 있을 듯 — 만세력닷컴은 카톡 공유 카드 자체가 빈약함 (+1 for saju site).

### 4.4 daily_pillar_return_hook
today.html이 "Bookmark this and come back tomorrow" + "New every day" + 다국어(en/ko/ja/zh/es) 지원 + 카드 공유까지 갖춰서 retention 의도는 명확. 다만 내가 만세력닷컴조차 매일 안 가는 사용자라 "오늘의 일진"만으로는 약함. "LLM-deep daily guidance coming soon" 예고가 진짜 매일 새로운 LLM 한국어 한 줄로 풀리면 카톡 친구한테 "오늘 너 일진 봐봐" 보내는 viral hook 가능. 현재 상태로는 retention severity 3.

### 4.5 cognitive_load_ko_익숙
한국어 BaZi 중간 지식 사용자한테 "신살(神煞)·세운(歲運)·대운(大運)" 한자가 한글 병기 없이 노출되는 건 만세력닷컴 대비 -1. 만세력닷컴은 "겁재(劫財)·도화살(桃花殺)" 식으로 한글 우선 + 한자 괄호. 카피에 한자가 많은 건 정통성 어필 의도지만 화장실 10분 안 친구가 카톡으로 보낸 사이트에 한자 5개 동시 등장하면 인지부하 (severity 3 - 한숨 + 계속).

## 5. 동기 만족도
점수: **5/10** (부분적)
이유: 동기는 **career** — 이직·평가 고민을 사주로 한 번 점쳐보고 싶음. Reading style을 "Career & work"로 분기해주는 건 다른 한국 사주 사이트엔 없는 차별점이라 +. 그러나 결과의 "Career" 분기가 실제로 얼마나 다른 결과를 주는지 fetch로 확인 불가 — General과 한 줄 차이만 나면 실망. 유료 PDF의 5섹션 중 "career" 한 섹션만 깊어도 동기 충족은 7로 올라감. 무료 결과만 보고는 "내가 식상 강한 일주라 이직 시점이 언제다" 식의 구체 액션이 없을 가능성이 커서 5점.

## 6. 친구 공유
- 공유 채널: **카톡 1:1 친한친구** (회사 단톡방은 career 정보 노출 우려로 X)
- 보낼 메시지 텍스트:
  > "야 친구가 보내준 사주 사이트인데 무료고 가입 없어. Career 옵션 따로 있어서 좀 다름. 근데 결제는 7달러 해외결제라 좀 그래. 너 일주 한번 봐봐 ㅋㅋ"

## 7. 이탈 지점
- Yes/No: **Yes** (잠정 이탈)
- 어디서: **stage 3.4 Upsell** (결제 직전)
- 왜: $7 달러 표시 + Lemon Squeezy 해외 결제 + "All sales are final, waive 14-day right of withdrawal" 3종 세트. 결제 버튼 누르기 전 카톡으로 친구한테 검증받으려고 일단 탭 닫음. 30초 안 이탈은 아니지만 "결제 직전 이탈"이 가장 명확. 추가로 stage 3.1에서 한국어 토글 못 찾는 사용자(친구 링크에 ?lang=ko 안 붙은 경우)는 30초 안 이탈 가능성도 동시에 존재.

## 8. 결제 의향
- 점수: **4/10**
- 행동 기준 (anchor): 5 "친구 추천"보다 한 단계 아래 — 친구한테는 무료 결과 캡처는 보내지만 결제는 추천 안 함.
- 이유: payment_anchor 7(가격 ok면 결제)인 내 평소 성향에서 -3 차감 요인 — (a) 해외 결제 브랜드(Lemon Squeezy) 익숙치 않음, (b) 가격이 원화가 아닌 달러로 표기되어 환율 한 번 더 머리 굴려야 함, (c) 환불 정책의 강한 면책 문구가 한국 7일 청약철회 정서와 충돌, (d) PDF 산출물 언어(한국어/영어) 명시 부재. anchor 7로 가려면 원화 표기 + 카카오페이/Toss 옵션 + "한국어 PDF" 명시가 동시에 필요.

## 9. 개선 제안 Top 3 (페르소나 시각, actionable)

1. **Landing 헤딩 위 우상단(노치 옆 안전영역)에 큰 한국어 토글 버튼 배치 + Accept-Language 헤더가 `ko-KR`이면 default `?lang=ko`로 자동 redirect.** 현재는 친구가 카톡으로 링크 보낼 때 `?lang=ko`가 안 붙으면 한국 사용자가 영어 헤딩으로 진입. 우상단 토글은 iPhone 14 Pro dynamic island 옆에 손가락 한 번에 닿음.

2. **Upsell 섹션 가격 표기를 "$7 (≈ ₩9,500)"로 병기하고 결제 옵션에 KakaoPay/Toss 아이콘 추가(또는 한국 결제 PG 통합). "한국어 PDF로 받기" 체크박스 명시.** 현재는 달러 단독 + Lemon Squeezy 단독 + PDF 언어 미명시 — 한국 27세 직장인의 해외 결제 진입장벽 3종. anchor 4 → 7 이동 가능.

3. **무료 Rendering 결과에서 한자 용어("神煞·歲運·大運·劫財·桃花殺" 등)를 자동으로 한글 병기("신살(神煞)·세운(歲運)") 처리하고, 각 용어에 탭하면 1줄 한국어 설명 툴팁이 뜨는 인터랙션 추가.** 만세력닷컴이 한글 병기로 인지부하 낮춰주는 점을 정면 대응. BaZi 중간 지식자한테 한자만 보여주는 건 정통성 어필이 아니라 진입장벽.

---

### Competitor 비교 (만세력닷컴 항목별 ±)
- **무료 결과 깊이**: 만세력닷컴 +1 (광고는 많지만 신살·귀인·명궁까지 한 화면)
- **Reading style 분기 (Career 선택)**: saju site +1 (만세력닷컴은 통짜 reading만)
- **한글 병기 / 인지부하**: 만세력닷컴 +1 (한자에 한글 자동 병기)
- **광고 없음**: saju site +1 (만세력닷컴은 상단 배너 광고)
- **카톡 공유 카드 디자인**: saju site +1 (today.html share card 존재)
- **결제 한국 친화도**: 만세력닷컴 +1 (애초에 결제 없음 / 한국 사이트들은 원화·카카오페이)
- **모바일 first 디자인 톤**: saju site +1 (만세력닷컴 UI는 데스크탑 시대 잔재)
- **운영자 신뢰 (사업자등록)**: 만세력닷컴 +1 (한국 BaZi 사이트는 보통 사업자번호 footer 노출, saju는 개인 운영자 명시뿐)

**총합**: saju +4 vs 만세력닷컴 +4 — 무료 사용 단계에선 호각, **결제 단계에서 만세력닷컴 우위**(결제 자체가 없어서 비교조차 안 됨).

### Unique 시각 (민지만)
"화장실 10분 안에 점심시간 카톡 인앱 → Safari 전환 → 회사 단톡 vs 친한친구 1:1 공유 채널 분리 결정" 시나리오 — 다른 페르소나는 못 본다. 박사급(Hiro/Wei)은 정확도, 영어권(Sarah/Tom)은 트러스트, 노인(김할머니)은 글자크기를 보지만, **"회사 단톡에는 career 분석 못 뿌리니까 친한친구 1:1만 쓰는 직장인 KR 여성"**의 share channel 분리는 민지 고유. 이게 og:image 한국어/영어 분기, share card에 career 키워드 노출 여부 같은 구체 디자인 결정으로 연결됨.
