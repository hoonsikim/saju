# Marketing Routines & Automation r1 — 채널별 자율 관리 + n8n 통합

**Date**: 2026-05-24 (D+13)
**Trigger**: 사용자 "개별 채널 자율 관리 + 루틴 + 스킬화 + n8n 활용"
**Goal**: 사령이 매 채널 manually 관리 X → 정기 cron + skill + n8n workflow

---

## 1. 채널별 자동화 가능성 매트릭스

| 채널 | API | API 비용 | 자동 post | 자동 comment | 사령 권고 path |
|---|---|---|---|---|---|
| **Dev.to** | ✅ Free | $0 | ✅ | ✅ | **API direct** (사령 자율 100%) |
| **Bluesky** | ✅ Free (AT Protocol) | $0 | ✅ | ✅ | **API direct** (사령 자율 100%) |
| **Mastodon** | ✅ Free | $0 | ✅ | ✅ | **API direct** |
| **Reddit** | ✅ Free (PRAW) | $0 | ✅ | ✅ | API direct (단 신규 계정 ban risk → 1-2주 빌드 후) |
| **HN** | ✅ Free (Firebase) | $0 | ✅ | ✅ | API direct (단 카르마 무관, 첫 post 노출 약함) |
| **LinkedIn** | ✅ OAuth | $0 | ✅ | ✅ | API (사용자 LinkedIn 보유 시) |
| **Medium** | ✅ Integration Token | $0 | ✅ (article) | ❌ | API direct |
| **Tumblr** | ✅ Free | $0 | ✅ | ✅ | API direct |
| **Pinterest** | ✅ Free | $0 | ✅ (pin) | — | API direct |
| **Product Hunt** | ✅ GraphQL | $0 | ❌ launch는 dashboard | ✅ comment | API for stats |
| **X (Twitter)** | API v2 Basic | $100/mo | ✅ paid | ✅ paid | **handoff 권장** (비용 회피) |
| **Instagram** | Graph API (Business) | OAuth 복잡 | △ (image upload 복잡) | △ | handoff |
| **Threads** | Meta API | 제한적 | △ | △ | handoff |
| **TikTok** | Content Posting API | $0 (제한적) | △ (영상 업로드) | △ | handoff |
| **Disquiet** | API X | — | ❌ | ❌ | handoff 또는 paste |
| **Indie Hackers** | API X | — | ❌ | ❌ | handoff 또는 paste |
| **Substack** | API X | — | ❌ (web only) | ❌ | handoff 또는 paste |

### 분류 결과

| 카테고리 | 채널 | 사령 자율도 |
|---|---|---|
| **A. 완전 자동 (API direct)** | Dev.to · Bluesky · Mastodon · Reddit (post-karma) · HN · Medium · Tumblr · Pinterest · LinkedIn | 100% |
| **B. 반자동 (handoff cookie)** | X · Instagram · Threads · TikTok | 80% (사용자 PC + Chrome) |
| **C. 수동 (paste only)** | Disquiet · IH · Substack | 50% (사령 작성 + 사용자 paste) |

---

## 2. 루틴 정의 (Daily / Weekly / Monthly)

### Daily (n8n cron + 사령 호출)

| Time (KST) | 액션 | 실행 |
|---|---|---|
| 09:00 | **트래픽 daily digest**: KV /track + GitHub repo + CF analytics → 텔레그램 push | n8n workflow `daily-traffic-digest` |
| 09:30 | **채널 알림 aggregate**: Gmail 필터 (from:noreply@disquiet·*.dev·indiehackers 등) → Notion DB | n8n workflow `channel-alert-aggregator` |
| 12:00 | **HN/Reddit 카르마 빌드**: 사령이 frontpage 글 read + thoughtful comment 1-2개 작성 → handoff post | 사령 cron (별도) |
| 21:00 | **Bluesky/Mastodon daily insight 1줄**: Day Master 1개 archetype 강조 또는 user question 답변 | API direct 사령 cron |

### Weekly (사령 cron + n8n)

| Day (KST) | 액션 | 실행 |
|---|---|---|
| **월요일 21:00** | Substack 1편 long-form 발행 (사령이 작성 → 사용자 paste) | handoff |
| **화요일 22:00** | Dev.to 1편 발행 (사령 API direct) | API direct |
| **수요일 20:00** | X/Threads/Bluesky thread 동시 (5 tweets) | Bluesky API + X/Threads handoff |
| **목요일 20:00** | Instagram 캐러셀 1편 (Day Master 시리즈 등) | handoff |
| **금요일 20:00** | Medium 1편 (Dev.to 재발행 또는 별도 angle) | API direct |
| **토요일 11:00** | Reddit r/asianastrology 또는 r/SideProject 1편 (카르마 5+ 이후) | API direct + 사용자 검수 |
| **일요일 21:00** | 주간 트래픽 종합 리포트 (Notion publish) | n8n + 사령 |

### Monthly

| Date | 액션 |
|---|---|
| 1일 | 월간 매출 (LS dashboard) + Anthropic 비용 + 신규 user 종합 보고 |
| 15일 | 신규 채널 평가 (가입할지) + 컨텐츠 plan 다음 달 |
| 마지막 일 | KB 정리 (ADR 누적 + 99-resume) |
| 분기 | Product Hunt launch 1회 (분기당 1번 권고) |

---

## 3. n8n Workflow 3종 (사령 자율 작성 + 사용자 import)

### Workflow A: `daily-traffic-digest` (매일 09:00 KST)

**노드**:
1. **Cron trigger** (매일 09:00 KST)
2. **HTTP GET** GitHub repo traffic API (`/repos/hoonsikim/saju/traffic/views`)
3. **HTTP GET** GitHub clones API (`/repos/hoonsikim/saju/traffic/clones`)
4. **HTTP GET** CF Worker /metrics (?token=${ADMIN_TOKEN})
5. **HTTP GET** CF Worker /feedback/recent (?token=)
6. **Code node**: 데이터 정리 + Telegram message format
7. **HTTP POST** Telegram sendMessage → @seanist_ilsaryung_bot

**산출물**: 매일 아침 텔레그램에:
```
📊 Saju 트래픽 daily (2026-05-25 09:00)
─────────────────
• GitHub views 14d: 24/11 (+0/+0 vs 어제)
• GitHub clones: 605/250 (봇)
• Site page_view 어제: 12
• saju_reading_generated: 8
• saju_paid_click: 0
• 피드백 신규: 0
─────────────────
어제 referrer: Google (3) · Bluesky (2) · 직접 (7)
```

### Workflow B: `channel-alert-aggregator` (매시간)

**노드**:
1. **Cron trigger** (매시간)
2. **Gmail search**: `from:(noreply@disquiet.io OR noreply@dev.to OR noreply@indiehackers.com OR noreply@bsky.app OR noreply@producthunt.com OR noreply@instagram.com OR noreply@threads.net) newer_than:1h`
3. **Code node**: 알림 분류 (댓글 · 좋아요 · follower · 멘션)
4. **HTTP POST** Notion DB (새 row 추가)
5. **Conditional** 댓글/멘션 → Telegram 즉시 push (사령 응대 필요)

### Workflow C: `weekly-content-publisher` (매주 화·금)

**노드**:
1. **Cron trigger** (매주 화·금 22:00 KST)
2. **HTTP GET** 사령 cron → 콘텐츠 ready file path
3. **Read file** (사령이 미리 작성한 글)
4. **HTTP POST** Dev.to API (article publish)
5. **HTTP POST** Bluesky API (thread publish, 5 posts)
6. **Telegram push** 발행 완료 알림

**사령 자율**: 콘텐츠 파일은 매주 일요일 사령이 작성 (`/artifacts/marketing/queue/YYYY-MM-DD-{channel}.md`).

---

## 4. 사령 Skill 후보 (slash command)

n8n과 별개로 사령에게 명령형 호출:

| Skill | 동작 |
|---|---|
| `/post-devto {file}` | KB의 markdown 파일을 Dev.to API로 publish |
| `/post-bluesky {thread.txt}` | 5-tweet thread를 Bluesky API로 post |
| `/post-medium {file}` | Medium API publish |
| `/comment-hn {threadId} {body}` | HN comment API |
| `/comment-reddit {sub} {body}` | Reddit PRAW |
| `/report-traffic {day|week|month}` | KV + GitHub + CF 데이터 종합 |
| `/content-plan-week` | 다음 주 5 채널 콘텐츠 draft 생성 (사령이 IH·Dev.to·X·Substack·IG 각 1편) |
| `/karma-build {channel}` | HN 또는 Reddit frontpage 읽기 + thoughtful comment 1-2개 draft |

---

## 5. 분담 plan — 사령 자율 vs 사용자

### 사령 100% 자율
- 컨텐츠 작성 (모든 채널)
- Dev.to/Medium/Bluesky/Mastodon/Tumblr/Pinterest API direct post
- KV /track 모니터링 (ADMIN_TOKEN 알면)
- 댓글 응대 draft 작성
- n8n workflow 작성 (JSON)

### 사용자 액션 (분기 또는 setup 1회)
- 채널 가입 (현재 9개 완료)
- API token 발급: Dev.to · Medium · Bluesky · Reddit (PRAW) · HN · LinkedIn · Pinterest · Tumblr · PH
- n8n workflow import (1회)
- handoff 채널 (X/IG/Threads/Disquiet/IH/Substack)에서 post 클릭

### 사용자 액션 (정기)
- HN/Reddit 카르마 빌드 comment paste (또는 handoff 모드)
- 텔레그램 알림 받고 즉시 응대 필요 시 사령 호출
- Substack/Disquiet post 발행 (사령 작성 → 사용자 paste)

---

## 6. API token 발급 가이드 (사용자 액션, 1회)

가장 큰 ROI 순:

| 채널 | URL | 시간 |
|---|---|---|
| **Dev.to** | https://dev.to/settings/extensions → "DEV API Keys" → Generate | 1분 |
| **Bluesky** | https://bsky.app/settings/app-passwords → Create app password | 2분 |
| **Medium** | https://medium.com/me/settings/security → Integration tokens | 1분 |
| **Reddit** | https://www.reddit.com/prefs/apps → Create app (script) → client_id + secret | 5분 |
| **HN** | API key 없음 — username/password 직접 (HTTP form) | — |
| **LinkedIn** | https://www.linkedin.com/developers/apps (OAuth app 만들기) | 15분 (복잡) |
| **Pinterest** | https://developers.pinterest.com/ → Create app | 10분 |
| **Tumblr** | https://www.tumblr.com/oauth/apps → register | 5분 |

→ 발급 후 사용자가 사령에게 token 알려주면 `.env` 또는 wrangler secret으로 저장 (사령 권한 안에서).

---

## 7. 단계화 plan

### Phase 1 (사령 자율 즉시 시작 — 이번 turn 또는 다음)
1. ✅ 운영 매트릭스 KB 작성 (이 파일)
2. ⏳ Instagram 캐러셀 10장 SVG 생성 (Day Master archetype)
3. ⏳ n8n workflow A (`daily-traffic-digest`) JSON 작성 + 사용자 import

### Phase 2 (사용자 API token 발급 후)
1. Dev.to + Bluesky API direct 셋업
2. 사령 cron 추가 (Dev.to weekly + Bluesky daily)
3. weekly content pipeline 가동

### Phase 3 (KYC 통과 + 매출 시작 후)
1. Product Hunt 정식 launch
2. Reddit 카르마 빌드 완료 → r/asianastrology + r/SideProject post
3. HN Show HN (사용자 재가입 + 카르마 빌드 후)
4. SEO 강화 (sitemap.xml + meta + blog backlink)

### Phase 4 (월 트래픽 1k+ 이후)
1. paid X API ($100/mo) 검토
2. TikTok 영상 시리즈 (Day Master 10편) — 사령 script + 사용자 영상 또는 AI 영상 도구
3. Substack newsletter 자체 sponsor 모집

---

## 8. 사령 자율 즉시 시작 가능 (이번 chunk)

| Task | 시간 |
|---|---|
| Instagram 캐러셀 10장 SVG (Day Master archetype) | 30분 |
| n8n `daily-traffic-digest` workflow JSON | 30분 |
| Substack 첫 글 long-form draft (3000 단어) | 1h |
| Dev.to 첫 글 final polish | 10분 |
| Bluesky 5-tweet thread final | 10분 |

→ 사용자 명령 주시면 위 5개 중 우선순위 결정 + 자율 진행.

---

## 9. 결정 청합

| 옵션 | 사령 진행 |
|---|---|
| **α** | n8n workflow A (`daily-traffic-digest`) JSON 작성 + 사용자 import 가이드 — 매일 트래픽 자동 추적 |
| **β** | Instagram 캐러셀 10장 SVG 생성 (Day Master archetype) — 사용자 IG 첫 게시 ready |
| **γ** | Dev.to/Bluesky API token 발급 후 → 사령이 즉시 자동 publish 가동 |
| **δ** | 위 모두 자율 순차 진행 |

권고: **α + β 병행** (인프라 + 시각 자산). γ는 사용자 token 발급 후.
