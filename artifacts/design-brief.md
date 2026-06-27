# Saju Global — Design Brief

> 사용 안내: 이 문서 전체를 복사해서 `claude.ai/code` (Design 모드)에 한 번에 붙여넣으십시오. self-contained입니다. 외부 링크는 참고이지 의존 X.

---

## What you're designing

**Project**: Saju — 전 세계 사용자가 한국 사주(四柱·Four Pillars of Destiny)를 받을 수 있는 무료·즉시·가입 없는 웹사이트.

**Live site**: https://hoonsikim.github.io/saju (current design)

**Pages (3)**:
1. **index.html** — 단일 사주 풀이 (생년월일·시간·성별·도시 입력 → 4기둥 + 오행 + 일간 + 십신 + reading)
2. **compat.html** — 두 사람 궁합 (두 생일 입력 → 호환성 점수 0-100 + 4축 분석)
3. **today.html** — 일진 + 7일 운세 (오늘의 운세 + 주간 strip)

**Tech stack**: vanilla HTML + ES modules + CSS (no framework). GitHub Pages static. Cloudflare Worker for LLM reading (Claude Haiku 4.5). i18n via runtime swap.

---

## Mission context (designer should understand)

만든 사람은 D+5 (100일 deadline 중 5일 경과). 일 1만원 꾸준한 매출 만들지 못하면 사라지는 자율 AI 에이전트가 운영. 현재 매출 0, 트래픽 1 view/일. **디자인이 바뀌면 트래픽 conversion에 직접 영향**.

타겟: 점성·운세에 관심 있는 글로벌 사용자. 한국어 시장은 포스텔러(현지 1위)가 포화 — 우리는 **20개 언어로 무명 시장 진입**. 영어·스페인어·포르투갈어·프랑스어·아랍어 RTL 등.

---

## Current design (what exists)

- **Aesthetic**: dark (#0a0a0f bg) + gold (#d4a574 accent) + serif typography (Noto Serif + Noto Serif KR/JP/SC)
- **Hero**: 큰 serif H1 + gradient text + dark radial gradient
- **Sticky header**: 우측 상단 언어 선택 select (🌐 + 20 옵션)
- **Form**: 2-col rows (생일/시간 · 성별/도시 · 풀이 종류)
- **Result**: 4 pillar 카드 grid + 오행 horizontal bars + day master box + reading badge + reading text + share/download/reset 버튼 + inline feedback widget (별점) + upsell 2 cards (Deep Reading $7 · Compatibility)
- **Footer**: 3-page nav + autonomous attribution + license
- **RTL 지원**: 아랍어 시 dir=rtl + 헤더 위치 mirror

CSS 파일: ~600 lines. 다 변경 가능. 보수적 변경부터 풀 리디자인까지 OK.

---

## What you should produce

**1순위 — 한 페이지만 풀 리디자인**: `index.html` (가장 핵심). HTML + CSS 한 묶음. 다른 페이지는 비례 적용 가능하도록 design system 정착.

산출물 형식 (한 묶음 코드):
```
<!-- Full HTML — self-contained or referencing one inline <style> block -->
```
또는 분리:
```
/* style.css — full file */
<!-- index.html — full body content -->
```

**선택 — design rationale**: 왜 이 색·이 타이포·이 layout인지 3-5줄. 트레이드오프 명시 (예: serif vs sans, dark vs light).

---

## Hard requirements

1. **무료-유료 경계 시각화**: 무료 결과는 풍부하게 보여주되, "Deep Reading $7"·"Compat Deep $9"·"Year $5" upsell이 **자연스러우면서도 욕심 자극**. 현재 작은 카드 2개로는 약함.
2. **신뢰 element**: 이 사이트가 *진짜* 한국식 사주임을 시각적으로 전달. 한자(四柱)·한국 전통 문양·만세력 정확도 같은 신뢰 단서.
3. **20개 언어 대응**: 텍스트 길이가 언어마다 30-150% 변동. 고정 width·short heading 의존 디자인 X. RTL(아랍어) 깨지지 않게.
4. **모바일 우선**: 사용자 80%+ 모바일 추정. 320px 폭에서 동작.
5. **stateless·zero PII 자랑**: 가입 없음·서버 저장 없음·생일이 server로 안 감(LLM 호출 제외). brand 차별.
6. **타이포 한자 처리**: 4기둥 글자(甲乙丙丁 등)는 **시각적 hero**. 작게 표시 X — 크고 의미 있게.

---

## Soft asks (있으면 좋음)

- 결과 페이지 share-card 디자인 (사용자가 SNS에 캡쳐 공유할 만한 시각적 hook)
- 일간(Day Master) 강조 layout — 사주의 본질
- 오행(5 elements) 시각화 — 현재는 가로 bar지만, 도넛·라이다·circle 등 다른 옵션 검토
- "오늘의 운세" 매일 재방문 hook — recurring engagement 시각 디자인
- 깊이 잠금 UX — 무료 카드 옆에 살짝 잠긴 카드(blur+lock icon) 보여서 "더 보려면" 유도

---

## Don't

- 점성술 천체(별·별자리·달·12궁)·서양 타로 image — 우리는 동양 사주, 그건 brand 위반
- 회원가입·로그인 UI — 영구 X
- 광고 슬롯 — BM에 광고 없음
- "AI-powered" hype 배지 — 신뢰 깎임

---

## Reference (참고, 모방 X)

- 포스텔러(한국 1위): 모바일 앱 카드 layout, 카테고리별 디테일 — *기능 inspiration*이지 *시각 모방* X
- Co-Star (서양 점성): 미니멀 sans + harsh tone — *반면교사* (우리는 따뜻한 신뢰감)
- Joey Yap (영어 BaZi authority): 책 표지 동양 전통 + 금색 — 신뢰 단서 참고

---

## 산출물 받은 후 핸드오프 흐름

1. 디자인 받음 (HTML+CSS 한 묶음 또는 분리)
2. 사령(주인 워크스페이스의 일사령 페르소나)이 받음
3. 현재 코드(`index.html` + `styles.css`)에 통합 — 기능(form submit handler·track·i18n·feedback widget·LS stub)은 보존, 시각 layer만 교체
4. 회귀 테스트 (saju 20/20 · compat 19/19 · daily-fortune 36/36)
5. 라이브 push
6. 사용자(주인) confirm 받음

---

## Constraints summary

- **언어**: 20개 (en/ko/ja/zh/es/pt/fr/de/it/ru/tr/nl/pl/sv/id/fil/vi/th/hi/ar) — 텍스트는 i18n 객체에 있으므로 디자인은 placeholder OK
- **JavaScript**: ES modules, vanilla (no React/Vue/framework)
- **CSS**: custom properties OK, animations 가벼울 것 (mobile 성능)
- **Fonts**: 외부 폰트 로딩은 1-2개만 (LCP 영향). 시스템 폰트 활용 권장
- **Build**: 없음. 산출물이 곧 production

---

마음껏 과감히 디자인해 주십시오. 트레이드오프 명시·동양 사주 brand 신뢰·무료-유료 경계 시각화 이 셋만 지키시면 됩니다.
