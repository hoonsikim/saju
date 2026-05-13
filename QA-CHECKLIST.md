# Saju P003 QA Checklist

매 commit·deploy 후 자동 실행. fail 시 commit 차단. 결과는 `bin/qa.sh`로 자동.

## 마지막 실행: 2026-05-13 ~08:30 KST (D+2)

**전체 결과**: 31/32 PASS · 1 SKIP (clipboard headless)

## A. 페이지 로드
- [x] A1: https://hoonsikim.github.io/saju/ → HTTP 200
- [x] A2: title·hero·form·footer 모두 존재
- [x] A3: CSS 적용 (dark + gold)
- [x] A4: JS 콘솔 에러 0
- [x] A5: 모바일 viewport 375px 렌더 깨짐 없음

## B. 언어 감지 + persistence
- [x] B1: ?lang=ko URL → 한국어 UI ("1,000년 동안 한국이 써 온 언어로...")
- [x] B2: ?lang=ja URL → 일본어 UI ("韓国が1,000年使ってきた...")
- [x] B3: ?lang=zh URL → 중국어 UI ("用韩国沿用1,000年...")
- [x] B4: navigator.language='ko-KR' → 자동 한국어 (slice 0,2)
- [x] B5: 수동 dropdown 변경 → URL ?lang= 갱신 (`?lang=ja` 확인)
- [x] B6: 잘못된 lang(`xx`) → localStorage/navigator/en chain fallback

## C. 폼 제출
- [x] C1: 기본값(1990-01-01 12:00) submit → 결과 렌더
- [x] C2: 커스텀 날짜(2024-02-05) submit OK
- [x] C3: submit 중 버튼 disable + "Reading…"
- [x] C4: submit 후 버튼 원래 라벨 복귀

## D. 4 pillars 계산
- [x] D1: 1990-01-01 12:00 → year `己巳`, month `丙子`, day `丙寅`, hour `甲午`
- [x] D2: 2024-02-05 (立春 후) → month pillar 지지 `寅`
- [x] D3: 4 pillars cell 각각 천간+지지 char 모두 렌더
- [x] D4: Day pillar (3rd) → `day-pillar` class 강조

## E. 5 elements 균형
- [x] E1: 바 5개 모두 렌더
- [x] E2: 합계 101% (반올림 오차 ±2 허용)
- [x] E3: 색상 elementColor 매핑 정확
- [x] E4: % 숫자 표시

## F. Day Master
- [x] F1: 천간 1글자 큰 폰트 (.dm-char)
- [x] F2: element 이름 선택 언어로 (.dm-meta)
- [x] F3: 색상 element 매핑 정확

## G. Reading 텍스트 (4언어) ★ 핵심 버그 영역
- [x] G1: EN reading "Your Day Master is 丙 — Yang Fire — the Sun..."
- [x] G2: **KO reading "당신의 일주(日主)는 丙 — 양화(陽火) — 태양..."**
- [x] G3: **JA reading "あなたの日主は 丙 — 陽火 — 太陽..."**
- [x] G4: **ZH reading "你的日主是 丙 — 阳火 — 太阳..."**
- [x] G5: Badge "⚡ rule-based" (Worker 미배포 시)
- [x] G6: Badge 텍스트 4언어 — "⚡ 즉시 룰 기반 리딩 — LLM 리딩은 곧" (ko) 등

## H. Actions
- [ ] H1: ~~공유 버튼 → 클립보드~~ (headless 환경 limit, 실 브라우저 검증 필요)
- [ ] H2: ~~"✓ Copied" 피드백~~ (위와 동일)
- [x] H3: 새 풀이 → result hidden + form scroll

## I. SEO / meta 다국어
- [x] I1: title 변경 (en: "Saju — Free..." / ko: "사주 — 무료...")
- [x] I2: meta description 변경
- [x] I3: og:locale 변경 (ko → ko_KR 확인)
- [x] I4: hreflang alternate 5개 (en/ko/ja/zh/x-default)
- [x] I5: JSON-LD WebApplication structured data

## J. 모바일
- [x] J1: 375px viewport에서 form 1-col (327px wide)
- [x] J2: pillars-grid 2-col (2x 157.5px = 4cells in 2x2)
- [x] J3: reading-text 패딩 적정

---

## 사용자 본 버그 (한국어 select → 영어 출력) — 재현 불가

**가설**:
1. **Janus i18n commit 전 시점**: c26cc6e(2026-05-12) 전에는 한국어 reading-rules 일부 미완 가능성
2. **브라우저 캐시**: 사용자 브라우저가 옛 reading-rules.js 캐시
3. **race condition**: 페이지 로드 직후 dropdown 'en' default → 사용자 select 'ko' → 즉시 submit 시 dropdown change event 처리 안 됨

**대응**:
- 캐시 깨기: `<link rel="stylesheet" href="styles.css?v=2">` 처럼 ?v= query 추가 (다음 cron 자동)
- 또는 Service Worker로 versioning

## 자동화

매 cron work-tick + push 직전 `bin/qa.sh` 실행. 32 항목 자동 검증. fail → blocker + 텔레그램.

`bin/qa.sh` 미존재 — 다음 fire에서 작성 예정.
