# Persona QA Report — Quality Rubric (v5)

8 평가 항목, 각 0-3점, 총 24점, **passing threshold = 18/24** (75%).
Fail 시 specific feedback inject → 재작업, 최대 3 retry rounds.

---

## 1. Completeness (완결성)
9 필수 항목 모두 채움:
1. 자기소개 (1줄)
2. competitor 기준 (1줄)
3. 7-stage walk-through (landing/input/rendering/upsell/paid-email(가설)/share/return)
4. core dim 4-5개 deep eval (3-5 문장 each)
5. 동기 만족도 0-10 + 이유
6. 친구 공유 (채널 + 메시지 텍스트)
7. 이탈 지점 (Yes/No, 어디서, 왜)
8. 결제 의향 0-10 + 행동 기준
9. 개선 제안 Top 3

| 점수 | 기준 |
|---|---|
| 3 | 9/9 채움 |
| 2 | 8/9 |
| 1 | 6-7/9 |
| 0 | ≤5/9 |

## 2. Specificity (구체성)
generic 표현 (e.g. "사이트가 좋다", "UX 깔끔") 카운트. 모든 평가가 행동 가능한 구체 관찰이어야.

| 점수 | 기준 |
|---|---|
| 3 | generic 표현 0건 |
| 2 | 1-2건 |
| 1 | 3-5건 |
| 0 | 6+ 또는 전체 generic |

## 3. Persona fidelity (페르소나 일치성)
평가가 페르소나 카드 (디바이스·언어·기존지식·동기·결제의지)와 일치.
예: 민지(27, 모바일)인데 "데스크탑 단축키" 평가 = 미스매치.

| 점수 | 기준 |
|---|---|
| 3 | 완벽 일치 |
| 2 | 1건 미스매치 |
| 1 | 2-3건 |
| 0 | 4+ |

## 4. Behavioral anchor consistency (anchor 일관성)
모든 점수가 behavioral anchor 정의와 일치.
예: 결제 의향 8 anchor = "카드 꺼냄" 인데 reasoning이 "절대 안 살 거" = 모순.

| 점수 | 기준 |
|---|---|
| 3 | 완벽 일치 |
| 2 | 1건 모순 |
| 1 | 2건 |
| 0 | 3+ |

### Behavioral anchor 정의 (모든 보고서 공통)
- **결제 의향**: 10=카드 꺼냄 / 7=가격 ok면 결제 / 5=친구 추천 / 3=다시 와서 결제 / 0=절대 X
- **painpoint severity**: 5=즉시 이탈 / 4=짜증+다른 페이지 / 3=한숨+계속 / 2=알아챔 / 1=무시 가능
- **viral 충동**: 10=5분 내 메시지 / 7=오늘 내 / 5=SNS 포스팅 가능 / 3=기억만 / 0=잊음
- **동기 만족도**: 10=완벽 답 / 7=충분 / 5=부분적 / 3=약함 / 0=무관

## 5. Critical edge (비판 강도)
약점 적극 찾았나. 호의적 평가 비율 + 이탈 이유 명시 여부.

| 점수 | 기준 |
|---|---|
| 3 | critical lens 강함 (호의 ≤30%) + 이탈 이유 명시 |
| 2 | 균형 (호의 40-60%) |
| 1 | 호의적 위주 (60-80%) |
| 0 | 호의 only (>80%) 또는 이탈 이유 X |

## 6. Competitor concreteness (competitor 구체성)
competitor 비교가 구체: 이름 명시 + +1/-1 평가 + 구체 항목 명시.

| 점수 | 기준 |
|---|---|
| 3 | 모든 비교 구체 (이름 + 항목 + ±) |
| 2 | 대부분 구체 |
| 1 | 일부만 |
| 0 | 추상 또는 X |

## 7. Actionability (실행가능성)
개선 제안 Top 3이 actionable (구체 변경 명시).
예: "UX 개선" X / "input form의 month dropdown을 wheel picker로 교체" O.

| 점수 | 기준 |
|---|---|
| 3 | 3개 모두 actionable |
| 2 | 2개 |
| 1 | 1개 |
| 0 | 추상 only |

## 8. Originality (독창성)
다른 페르소나가 안 본 unique 시각 1개 이상. 페르소나 정체성 활용 (e.g. 김할머니만 "한자 못 읽는다" 관점).

| 점수 | 기준 |
|---|---|
| 3 | unique 시각 명확 + 보고서 전체 일관 |
| 2 | unique 시각 있음 |
| 1 | 일반적 |
| 0 | 다른 페르소나와 거의 동일 |

---

## Pass/Fail Protocol

- **Pass (≥18/24)**: collection 합류
- **Fail (<18/24)**: 사령 specific feedback (어느 항목 몇 점, 무엇 부족, 무엇 보완) 작성 → subagent에 SendMessage로 inject → 재작업
- **Max 3 retry rounds**. 18 미만 지속 시 사령 직접 작성으로 escalate
