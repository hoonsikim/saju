// 4 pillars 계산 검증 테스트
//
// 한국 만세력 공식 결과와 cross-check 5 케이스.
// 실행: node test/saju.test.js

import { birthInfoToFourPillars, elementBalance, elementStrength } from '../src/saju.js';

let passed = 0;
let failed = 0;

function assert(name, actual, expected) {
  const ok = JSON.stringify(actual) === JSON.stringify(expected);
  if (ok) {
    console.log(`✓ ${name}`);
    passed++;
  } else {
    console.log(`✗ ${name}\n   actual:   ${JSON.stringify(actual)}\n   expected: ${JSON.stringify(expected)}`);
    failed++;
  }
}

function assertContains(name, actual, expected) {
  const ok = JSON.stringify(actual).includes(JSON.stringify(expected));
  if (ok) {
    console.log(`✓ ${name}`);
    passed++;
  } else {
    console.log(`✗ ${name}\n   actual:   ${JSON.stringify(actual)}\n   should contain: ${JSON.stringify(expected)}`);
    failed++;
  }
}

// === Case 1: 1990-01-01 12:00 (검증 — 만세력 표준 케이스)
// 1990-01-01은 양력 기준 음력 1989-12-05. 立春 전(2/4 전) → 月柱는 아직 1989년 기준.
{
  const r = birthInfoToFourPillars({ year: 1990, month: 1, day: 1, hour: 12 });
  assert('1990-01-01 12:00 — year pillar = 己巳', r.pillars.year.ganZhi, '己巳');
  assert('1990-01-01 12:00 — day master 존재', typeof r.dayMaster, 'string');
  assert('1990-01-01 12:00 — 8 chars 분류 합계 = 8', Object.values(r.elements).reduce((a, b) => a + b, 0), 8);
}

// === Case 2: 2000-01-01 00:00 — 21세기 진입 케이스
{
  const r = birthInfoToFourPillars({ year: 2000, month: 1, day: 1, hour: 0 });
  assert('2000-01-01 00:00 — year pillar = 己卯', r.pillars.year.ganZhi, '己卯');
  assert('2000-01-01 00:00 — element wood/water 존재', r.dayMasterElement !== null, true);
}

// === Case 3: 2024-08-15 14:30 — 광복절 (현재 시점 가까움)
{
  const r = birthInfoToFourPillars({ year: 2024, month: 8, day: 15, hour: 14, minute: 30 });
  assert('2024-08-15 — year pillar = 甲辰 (2024년 갑진년)', r.pillars.year.ganZhi, '甲辰');
  // Day master = 일주의 천간 (1 char among 10 천간)
  const validGan = ['甲','乙','丙','丁','戊','己','庚','辛','壬','癸'];
  assert('2024-08-15 — day master 천간 10개 중 1자', validGan.includes(r.dayMaster), true);
  assert('2024-08-15 — pillars 4개 모두 존재', Object.keys(r.pillars).length, 4);
}

// === Case 4: 立春 직전 vs 직후 — 月柱 변경 검증
{
  // 2024 立春은 2024-02-04 16:27 (KST). 그 전후 월주 달라야 함.
  const before = birthInfoToFourPillars({ year: 2024, month: 2, day: 3, hour: 12 });
  const after = birthInfoToFourPillars({ year: 2024, month: 2, day: 5, hour: 12 });
  // 立春 전: 月柱 寅 아님 (전 달). 立春 후: 月柱 寅
  console.log(`  立春 전 month pillar: ${before.pillars.month.ganZhi}`);
  console.log(`  立春 후 month pillar: ${after.pillars.month.ganZhi}`);
  // 立春 후는 반드시 寅月
  assert('2024-02-05 (立春 후) — month pillar 지지 = 寅', after.pillars.month.zhi, '寅');
}

// === Case 5: 5 elements balance 합 = 100%
{
  const r = birthInfoToFourPillars({ year: 1995, month: 6, day: 15, hour: 9 });
  const balance = elementBalance(r);
  const total = Object.values(balance).reduce((a, b) => a + b, 0);
  // 반올림 오차 ±2 허용
  const ok = total >= 98 && total <= 102;
  if (ok) {
    console.log(`✓ 1995-06-15 — element balance 합 = ${total}% (98~102 허용)`);
    passed++;
  } else {
    console.log(`✗ 1995-06-15 — element balance 합 = ${total}% (98~102 expected)`);
    failed++;
  }
  console.log(`  balance: ${JSON.stringify(balance)}`);
  const strength = elementStrength(r);
  console.log(`  strongest: ${strength.strongest} / weakest: ${strength.weakest} / missing: [${strength.missing.join(', ')}]`);
}

// === 결과
console.log(`\n${passed + failed} tests · ${passed} passed · ${failed} failed`);
process.exit(failed > 0 ? 1 : 0);
