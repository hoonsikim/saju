# Persona QA Report — 07 Tom

## 1. 자기소개 (1줄)
Tom, 19, Manchester 대학 2학년, iPhone SE3 (4.7" 작은 화면) Safari, UK 4G, 강의 사이 5분 휴식 중 TikTok "BaZi reading" 영상 보고 호기심 1분짜리.

## 2. competitor 기준 (1줄)
나는 평소 TikTok 점성 creators (BaZi/ChatGPT 영상)와 Co-Star app (친구들 다 깔려 있음, push notification 스샷 밈)을 본다.

## 3. 7-Stage Walk-Through

### 3.1 Landing (30초)
- 첫인상: "Your fate, in the language Korea has used for 1,000 years." 헤드라인이 너무 진지함. TikTok 영상에서 본 vibe (재미 + 밈)랑 톤 mismatch. 근데 "Free. Instant. No signup." 한 줄은 정확히 내가 원한 거 — 이거 없었으면 즉시 뒤로가기.
- painpoint: severity 3 — 4.7" SE3에서 "Authentic Korean Four Pillars of Destiny — Year, Month, Day, Hour. Five Elements in balance. Ten Gods at work." 가 한 줄에 안 들어와서 hero가 2-3 줄로 wrap됨. Korea라는 단어가 셋 (Korean, Korea, 1,000 years) 박혀있는데 나는 Korea 관심 0. Co-Star는 그냥 별 그림이고 끝나는데 여기는 텍스트 brick.
- delight: "No signup" — 학생한테 email 안 줘도 되는 거 큰 +. Co-Star도 가입 강제하는데.
- 이탈 결정? No (간신히) — "Free + No signup + 1분이면 끝" 셋이 머무르게 함. 근데 영상 보고 기대한 "fun + viral" 톤이 아니라 academic 톤이라 30초에 한 번 뒤로가기 손가락 갔다 멈춤.

### 3.2 Input
- 첫인상: 폼 자체는 above-the-fold 잡혀서 + 점이지만, **birth time 필드** 보자마자 "ㅋ 내 출생시간 모름". 18 단어짜리 "Don't know your birth time? Use 12:00" 헬프 텍스트 읽어야 함 — 4.7" 화면에 폼 안에서 18단어 읽는 건 시각 부하 3.
- painpoint: severity 3 — Gender 라디오 (Prefer not to say / Female / Male) 가 SE3 portrait에서 세 옵션 wrap되면서 폼 길어짐. Birth city "optional"이라 적었다 — 근데 왜 옵션이 있는지 hint 없음 (도시가 reading에 영향?). Reading style dropdown ("General, Career & work, Love & relationships") 보고 General 골랐는데, 다른 거 골랐어야 깊은 거 받나 짜증.
- delight: 폼이 짧다 (5필드). Co-Star 첫 가입 폼 (name, sun sign, birth city autocomplete, etc) 보다 +1 짧음.
- 이탈 결정? No — 폼 자체는 1분 budget 안에 들어옴. 30초 안에 채움.

### 3.3 Rendering
- 첫인상: 결과 페이지에 **"Day Master," "Void (空亡)," "Auspicious Stars (神煞)," "Major Luck (大運)"** — 4개 한자가 동시에 등장. 나는 한자 0개 읽음. TikTok creator는 "Your day master is FIRE which means..." 한 문장 쓰는데, 여기는 한자 박힌 라벨 + 영어 단어 둘 다 보여줘서 인지 부하 ×2. 영상 한 줄로 30초 안에 들어온 정보를, 이 페이지는 한참 스크롤하면서 흩어진 한자 단어로 다시 읽으라고 시킴.
- painpoint: severity 4 — 4.7" 화면에 Five Elements / Day Master / Void / Auspicious Stars / Major Luck 다 들어가니까 스크롤 5-6번. 강의 시작 3분 남았는데 reading은 안 끝남. Co-Star 데일리 노티는 한 문장이면 끝.
- delight: Five Elements 색 밸런스 시각화 (라벨로만 짐작) — 이게 시각적이면 TikTok 댓글 첨부할 만함. 일단 hold.
- 이탈 결정? No (지금까지) — 결과는 받았는데 "그래서 뭐?" 감정. 한 줄 요약이 어디 있는지 못 찾음.

### 3.4 Upsell
- 첫인상: $7 "Deeper LLM Reading" 카드 보자마자 0.5초 만에 close 의도. 학생 = $7 = 점심 두 번. payment anchor 0 그대로.
- painpoint: severity 2 — upsell 자체가 공격적이진 않음 (배너/모달 X). 그냥 페이지 일부. 근데 "Deeper LLM Reading" 단어 보면서 "그럼 지금 받은 무료는 얕은 거란 얘기네?" 인지 — 무료 만족도 ↓.
- delight: "By purchasing, you agree to instant delivery and waive your 14-day right of withdrawal." — UK 소비자 권리 박살내는 문구를 너무 정직하게 박아둠. 결제 의지 없는 나한테는 별 일 아니지만, **있는 사람한테는 큰 -**. 그리고 이거 보고 학생 본능적으로 "scammy?" 의심 한 번 함.
- 이탈 결정? No — 어차피 결제 0이니까 무시하고 무료 결과만 보고 있음.

### 3.5 Paid email (가설)
"결제 후 email 받으면 만족할 조건": 해당 없음. 나는 결제 안 함. 만약 친구가 강제로 사줬다면 — 영상 30초에 들어갈 한 줄 ("Tom your day master is X, you're meant to do Y") 받으면 만족. PDF 5장 받으면 안 봄.
"가설 결제 의향": 0/10 — 카드 안 꺼냄. anchor 0 = 절대 X.

### 3.6 Share
- 채널: TikTok 댓글 + Snapchat DM 친한 친구 2명
- TikTok comment에 paste할 거: **없음**. 한자 박힌 "Day Master / Major Luck (大運)" 라벨은 댓글에 paste하면 일행이 한자 못 읽어서 그냥 깨진 글자처럼 보임. og:image 없어서 링크 paste하면 bland preview. Co-Star push noti는 그 자체로 스샷 밈인데 (e.g. "you may experience anxiety today lol"), 여기 reading은 스샷 한 장에 안 들어옴.
- Snapchat DM: 친구 2명한테 link만 보낼 수 있음 — "lol try this korean bazi thing free" + URL. 친구가 클릭해도 나처럼 한자 보고 confused 끝.
- 이탈 결정? Share 충동 = 3/10 (기억만, 5분 내 메시지 X).

### 3.7 Return
- 다음에 또 올까? **No**. Today's Fortune 페이지가 "new every day" hook이라 알긴 했는데, 매일 4.7" 화면에서 한자 라벨 스크롤할 동기 없음. Co-Star는 매일 11pm push noti 보내서 alarm처럼 작동 — 여기는 push 자체가 불가능 (no signup이라 email도 X).
- Retention hook 부재: bookmark? 학생은 bookmark 안 함. home screen 추가? 안 함. Daily reminder 없음.

## 4. Core Dim Deep Evaluation

### 4.1 performance_4G_small_screen
Image/video 0개라서 4G에서 LCP는 1-2초로 빠를 것 — 이건 + 큰 점. 강의 사이 5분 budget에 페이지 자체는 fast. 근데 진짜 painpoint는 viewport: 4.7" 375px에 Hero 2-3줄 wrap + 폼 5필드 + 결과 페이지 6 섹션 스크롤이라, 총 사용 시간은 4분 30초. 5분 budget 중 30초 남기고 강의 들어가야 함. Co-Star 매일 noti는 5초 컨텐츠 — 이 사이트는 5분 컨텐츠. Z세대 attention budget 미스매치 severity 4.

### 4.2 무료 충분성
"Free. Instant. No signup." 약속은 지킴 — 무료 결과 받음. 근데 "Deeper LLM Reading" 카드가 결과 옆에 박혀서 "방금 받은 건 얕은 거"라고 노골적으로 말함. anchor 0 페르소나한테 무료 충분성은 **부분적** (5/10). 1분 안 wow는 아님 — TikTok 영상 30초가 더 wow. 무료 reading이 한 줄 요약 ("Tom you're a [archetype], your year is [color]") 없이 한자 라벨로 흩어져 있어서, anchor 0 학생은 "받긴 받았는데 이해 안 됨 + 더 깊은 건 돈 내래" 빈손 감정.

### 4.3 결제 거부 이유
이유 1: $7 = 학생 점심 2회 (예산). 이유 2: 무료가 충분히 wow하지 않아서 paid도 wow일 거란 신뢰 X. 이유 3: "waive your 14-day right of withdrawal" 문구가 UK 소비자 보호 인식 있는 학생한테 약간의 sketchy 시그널 — 즉 결제 의지 anchor 0 = 절대 X. 이유 4: Co-Star도 paid tier 있는데 친구들 다 무료만 씀, 결제하는 친구 본 적 없음 = social proof X. 이유 5: 결제 후 email로 받는다는 게 학생한테 friction — 학생 inbox에 promo 들어오기 싫음. 5중 가장 큰 이유는 1+2 — 무료 wow 부재가 예산보다 더 큰 거부 사유.

### 4.4 TikTok_share_potential
**거의 0**. TikTok에 viral 가는 컨텐츠는 (a) 스샷 한 장에 hook (b) 한 줄 카피 (c) 색감 미적. 이 사이트는 셋 다 부재. og:image 없어서 link share preview bland. Five Elements 색 시각화는 잠재력 있는데, screenshot에 한자 라벨 ("空亡," "神煞") 박혀서 댓글 paste하면 깨진 글자처럼 보임 (UK iPhone 폰트 한자 fallback 추함). TikTok creator가 BaZi 영상 만들 때 쓰는 hook은 "your day master = your soul type" 같은 archetype 1단어인데, 이 사이트는 archetype을 한자 라벨에 묻음. viral 충동 3/10.

### 4.5 first_BaZi_cognitive
1분 안에 이해 가능? **No**. TikTok 30초 영상은 "BaZi = Chinese birth chart with 4 pillars, your day master is your soul element" 한 문장으로 끝냄. 이 사이트는 같은 정보를 (a) "Authentic Korean Four Pillars of Destiny" 헤드라인 (b) 결과 페이지 "Day Master" 섹션 (c) "Void (空亡)" 별도 섹션 (d) "Auspicious Stars (神煞)" 등 4개 한자 라벨로 분산. 19살 BaZi 처음 만난 학생 인지 부하 4. "Day Master = ?" "Void = ?" 같은 1줄 inline 정의 없음. 한자 위협 — 신살·세운·대운 한자는 폰트 fallback 못생긴 SE3에서 그냥 "alien text"로 보임. TikTok 댓글에 "my day master is fire" 같은 paste-able 한 줄 없어서 share도 X.

## 5. 동기 만족도
점수: 3/10 (약함)
이유: 내 동기는 "TikTok 영상 보고 1분 호기심 충족" — general. 받은 결과는 "이름·DOB 넣었더니 한자 라벨 6개 + 영어 설명 6 문단". 영상에서 본 "your day master is X = you're meant to do Y" 식 1줄 archetype을 못 찾음. 5분 휴식 중 4분 30초 쓰고 강의 들어가는데 머리에 남는 한 줄이 없음. Co-Star 데일리는 "you may overthink today" 한 줄 — 머리에 남음. 동기 satisfy 약함.

## 6. 친구 공유
- 공유 채널: TikTok comment + Snapchat DM (close friends 2명)
- 보낼 메시지 텍스트:
  - TikTok 영상 댓글: "tried this korean bazi site free no signup — got confused by the chinese characters lol but check it"
  - Snapchat DM: "lol [link] free korean bazi if ur bored in lecture, takes like 4 min tho"
- 솔직히 link만 보내고 끝. 스샷 안 보냄 (한자 깨져 보임). viral 충동 3/10.

## 7. 이탈 지점
- Yes/No: **No (간신히)** — 1차 방문은 완주. 근데 retention은 X (재방문 안 함).
- 어디서 거의 이탈: 3.1 Landing 30초 시점 (academic 톤 + Korea Korea Korea 헤드라인) + 3.3 Rendering 한자 4개 동시 등장 시점.
- 왜 안 이탈: (a) "Free + No signup" 약속이 강했음 (b) 폼이 짧음 (5필드) (c) 강의 사이 5분이라 어차피 다른 할 일 없음.
- 왜 재방문 X: Retention hook 0개 (push X, email X, bookmark 동기 X) + 컨텐츠가 1분 budget 초과 (4분 30초).

## 8. 결제 의향
- 점수: 0/10
- 행동 기준 (anchor): 카드 안 꺼냄. 결제 절대 X.
- 이유: payment_anchor 0 (학생 예산). 추가로 무료가 1분 wow 부재 → paid 신뢰 X. + "waive 14-day withdrawal" 문구 sketchy 인식. + Co-Star도 친구들 무료만 씀 social proof 0.

## 9. 개선 제안 Top 3 (페르소나 시각, actionable)

1. **결과 페이지 상단에 "1-line TikTok-ready archetype" 카드 추가**: 한자 라벨 6개보다 먼저, "You're a [Fire Day Master] — TikTok caption: 'my day master is fire and it shows 🔥'" 식 paste-able 한 줄 카드 박기. 한자 라벨은 그 아래에 expandable로 숨기기. Day Master 1단어를 영어 archetype name (Fire/Water/Wood/Metal/Earth + 1형용사)으로 hero에 띄우면 viral hook + 1분 cognitive 둘 다 해결.

2. **og:image 동적 share card 생성 (Five Elements + Day Master archetype 시각화, 한자 0개)**: 현재 og:image 부재로 TikTok 댓글/Snapchat DM에 link paste하면 bland text preview. SE3 스샷 가능한 1080×1920 share card 동적 생성 (이름 X, archetype + 색 5개 막대 only), 한자 0개로 — TikTok 댓글에 paste 가능. Co-Star push noti 스크린샷처럼 self-contained 한 장.

3. **Hero에서 "Korea / Korean / 1,000 years" 단어 둘 빼고 "TikTok-friendly hook"으로 교체**: 현재 "Your fate, in the language Korea has used for 1,000 years" — Z세대 영국 학생한테 Korea origin은 selling point X. "Your BaZi in 60 seconds. Free. No signup." 식으로 시간 약속 + 0친구 friction 약속을 hero에 박기. SE3 4.7" 1줄 안에 들어오는 길이로. Korea origin은 about 페이지에만 남기기.
