# Marketing Onboarding r1 — 채널 가입 입력값 준비

**Date**: 2026-05-24 (D+13)
**Trigger**: 사용자 "채널 0개, 가입 다 해야 함" + 사령 한계 (자동 가입 X)
**Goal**: 사용자 가입 마찰 최소화 — 사령이 username·bio·avatar·email 전략 ready

---

## 1. Username 후보 (6 채널 통일)

가용성은 사용자가 가입 시도 시 confirm. 우선순위 순:

| 순위 | username | 톤 | 길이 |
|---|---|---|---|
| **1** | `hoonsikim` | 본명 직접, brand 일관 (GitHub와 동일) | 9 |
| 2 | `seankim` | 영문명 짧음, glob 친화 | 7 |
| 3 | `sajumaster` | 제품 이름 직접 | 10 |
| 4 | `saju_sean` | 제품 + 이름 | 9 |
| 5 | `hoonsaju` | hybrid | 8 |

**사령 권고**: **`hoonsikim`** (GitHub username과 통일, 브랜드 일관성 ↑, "I built X" 형식 글 신뢰도 ↑). 가용성 fallback 시 `seankim` → `sajumaster`.

---

## 2. Email 전략 (Gmail plus addressing)

`h.company.sean@gmail.com` + suffix:

| 채널 | email |
|---|---|
| HN | `h.company.sean+hn@gmail.com` |
| Reddit | `h.company.sean+reddit@gmail.com` |
| Disquiet | `h.company.sean+disquiet@gmail.com` |
| Indie Hackers | `h.company.sean+ih@gmail.com` |
| Substack | `h.company.sean+substack@gmail.com` |
| Product Hunt | `h.company.sean+ph@gmail.com` |
| X | `h.company.sean+x@gmail.com` |

**효과**: 모든 채널 알림이 메인 Gmail에 들어옴 + 어디서 온 메일인지 즉시 식별 + 채널별 unsubscribe 단순.

**대안**: OAuth 가능한 채널 (Disquiet · Substack · Product Hunt · IH 일부)은 Google login 1클릭 — email 입력조차 안 함.

---

## 3. Bio (각 채널 형식 맞춤)

### 3.1 Disquiet (한국어, 1인 메이커)
```
1인 인디 메이커. 서울 거주.
한국식 사주(四柱)를 글로벌 시장에 푸는 사이드 프로젝트 운영 중 — https://hoonsikim.github.io/saju
무료 차트 + $7 AI 심층 풀이, 20개 언어, MIT 오픈소스.
관심: AI tool · solo SaaS · 비대면 자동화 · 명리.
```

### 3.2 Indie Hackers (영어, solo dev)
```
Solo dev based in Seoul, Korea. Currently shipping Saju — a Korean Four Pillars of Destiny reader (deterministic chart + LLM interpretation, 20 languages, MIT-licensed). Site: hoonsikim.github.io/saju
Background: software engineering, product.
Interests: solo SaaS, AI tools, MoR payment ops, multilingual product.
```

### 3.3 Substack (영어, writer tone)
```
Saju & beyond — a one-person publication on the engineering and craft of building software for traditional systems (Korean Saju, Chinese BaZi, eastern divination) without the hand-wavy parts. By Sean Kim, solo operator of hoonsikim.github.io/saju (MIT, 20 languages).
```
**Publication title 후보**: 
- `The Saju Lab` (직접적, 영어권 친화)
- `Four Pillars, Honestly` (writer 톤, mystic 거리감)
- `사주, 정직하게` (한국어, KR 사용자 target)

→ 사령 권고: **The Saju Lab** (영어 1st, 한국어 별도 신호 가능).

### 3.4 Product Hunt (영어, maker)
```
Maker. Solo dev. Seoul-based.
Currently shipping: Saju — Korean Four Pillars reader (free chart in 20 languages, $7 AI deep reading). Deterministic chart + LLM interpretation, MIT-licensed.
hoonsikim.github.io/saju
```

### 3.5 Hacker News (한 줄, 매우 짧음)
```
Solo dev in Seoul. Currently building https://hoonsikim.github.io/saju
```

### 3.6 X / Twitter
```
Solo dev · Seoul · building Saju (Korean Four Pillars reader, 20 langs, MIT) — hoonsikim.github.io/saju
AI tools · solo SaaS · MoR payment ops
```

### 3.7 Reddit
```
Solo dev based in Seoul. Building Saju (Korean Four Pillars of Destiny reader) as a side project.
```

---

## 4. Avatar (사령 자율 가능)

### 옵션 A — 기존 favicon 재사용 (가장 빠름)
사이트의 `favicon.svg` (四 + 골드 ring) — 이미 brand 일관. 1080×1080로 export 가능.

### 옵션 B — 새 avatar SVG (사령 작성)
사령이 plain SVG 생성 가능. 톤: dark navy 배경 + 금색 `四` + 작은 ring. Co-Star 미적 코드 (Lily 페르소나 권고)와 유사.

**사령 권고**: **옵션 A** (기존 favicon 1080×1080 export). 브랜드 일관성 + 작업 시간 0. 후속 디자이너 작업 시 모든 채널 일괄 교체.

---

## 5. Day 1 가입 우선순위 (사용자 5분/채널)

가입 마찰 ↓ 순서:

| 순서 | 채널 | 가입 방식 | 시간 |
|---|---|---|---|
| **1** | **Disquiet** | Google OAuth 1클릭 | 2분 |
| **2** | **Indie Hackers** | Google OAuth 또는 email + 비밀번호 | 5분 |
| **3** | **Substack** | Google OAuth → publication 이름 설정 | 5분 |
| **4** | **Product Hunt** | Google OAuth + maker 프로필 | 5분 |
| 5 | HN | username + 비밀번호 (이메일 verify 없음) | 3분 |
| 6 | Reddit | username + 비밀번호 + 이메일 verify | 5분 |
| 7 | X | phone verify (높은 마찰) | 10분 |

**Day 1 총 가입 시간**: 1-4번만 = **약 17분**.

---

## 6. 가입 후 사령 자율 작동 path

### 옵션 1: gstack/browse handoff mode
사용자가 가입 + 로그인 → browser session 사령에게 위임 → 사령이 직접 post 발송. 단 사용자 PC 켜져있고 browser open이어야.

### 옵션 2: 사용자 paste & post
사령이 KB의 post 텍스트 (artifacts/marketing/posts-r1.md) 정리 → 사용자가 각 채널 에서 paste & post. 사령 작업 ↓, 사용자 작업 ↑.

### 옵션 3: 일부 channel API
- **Substack**: API 없음 (사용자 수동)
- **Disquiet**: API 없음 (사용자 수동)
- **X**: API v2 (paid Basic $100/mo) — 사령 자동 post 가능. 무료 tier는 read만
- **Reddit**: API 있음 (PRAW 라이브러리) — 사령 자동 post 가능 (단 신규 계정 ban risk)
- **HN**: API 있음 (Firebase) — 사령 자동 post 가능. 단 카르마 무관, 첫 post는 어차피 약함

→ 사령 권고: **옵션 1 (handoff)** 가장 robust. 가입 후 사용자 PC 켜고 Chrome open → 사령이 cookie session으로 발송.

---

## 7. 카르마 빌드 (HN/Reddit, 1-2주)

신규 계정의 Show HN/r/asianastrology 글은 거의 노출 안 됨. 카르마 빌드:

| 채널 | 빌드 액션 | 시간 |
|---|---|---|
| HN | 1-2주 매일 3-5 thoughtful comment (frontpage 글에 reply) | 일 10분 × 14일 = **2.5h** |
| Reddit r/asianastrology | 1주 매일 1-2 comment (질문 답변) + 1 informative post (홍보 X) | 일 10분 × 7일 = **1.2h** |

**사령 협조**: comment 내용 사령이 작성 → 사용자 paste. 또는 handoff 모드로 사령 직접.

---

## 8. 가입 정보 저장 (사용자 책임)

사령이 password 저장 X. 사용자 keychain 또는 1Password 사용:

| 항목 | 저장 위치 |
|---|---|
| username (`hoonsikim`) | 사령 KB (이 파일) |
| email (plus addressing) | 사령 KB |
| password | **사용자 1Password / keychain** (사령 권한 밖) |
| 2FA backup codes | **사용자** |

---

## 9. 다음 액션 (사용자 결정)

| 결정 | 사령 다음 step |
|---|---|
| α | username `hoonsikim` 확정 + Day 1 가입 4채널 (Disquiet/IH/Substack/PH) | 사용자 17분 가입 |
| β | 다른 username 선호 | 사령이 가용성 체크 |
| γ | avatar 새로 디자인 | 사령 SVG 생성 |
| δ | HN/Reddit 카르마 빌드 도와줘 | 사령 comment 자동 작성 (handoff) |

권고: **α** + γ (기존 favicon 사용) → 사용자 17분으로 4채널 가입 → 사령 자동 post 시작.

---

## 가입 Status (2026-05-24 사용자 보고)

| # | 채널 | 가입 | username / email | Notes |
|---|---|---|---|---|
| 1 | Disquiet | ✅ | (Google) | 첫 chunk |
| 2 | Product Hunt | ✅ | (Google OAuth) | maker 프로필 |
| 3 | Indie Hackers | ✅ | h.company.sean@google.com (email) | |
| 4 | Hacker News | ❌ | 가입 실패 — 재시도 필요 | |
| 5 | Instagram | ✅ | **hcompany_saju** (email) | |
| 6 | Threads | ✅ | (IG 4번 연동) | |
| 7 | Bluesky | ✅ | **hcompany-sean@** (Google) | bsky.app |
| 8 | X (Twitter) | ✅ | **hcompany_saju** | |
| 9 | Dev.to | ✅ | (Google OAuth) | |
| - | Substack | 미가입 | — | 권장 (자체 publication) |
| - | Medium | 미가입 | — | 옵션 |
| - | LinkedIn | 미가입 | — | Marie target |

### HN 가입 실패 진단
- HN: https://news.ycombinator.com/login (no email 필요, just username + password)
- 실패 가능성: 1) username 중복 2) 비밀번호 약함 3) 일시 차단
- 재시도: 다른 username (`hoonsi`, `seansaju`, `kimhoonsi`) + 강한 비밀번호 (16자+)

### 가입 정보 저장 룰
- username + email = 사령 KB (이 파일)
- **password = 사용자 keychain/1Password** (사령 권한 밖)
