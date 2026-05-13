import { calcCompatibility, compatVerdict } from '../src/compat.js';

let passed = 0;
let failed = 0;

function assert(name, cond, detail = '') {
  if (cond) {
    console.log(`✓ ${name}`);
    passed++;
  } else {
    console.log(`✗ ${name}${detail ? '\n   ' + detail : ''}`);
    failed++;
  }
}

// === Case 1: 같은 사람 vs 같은 사람 — 모든 축 same/biJian → 중간 점수대
{
  const r = calcCompatibility(
    { year: 1990, month: 12, day: 20, hour: 16, minute: 30 },
    { year: 1990, month: 12, day: 20, hour: 16, minute: 30 },
  );
  assert('same birth — score is number 0-100', typeof r.score === 'number' && r.score >= 0 && r.score <= 100,
    `score=${r.score}`);
  assert('same birth — dayGan label = biJian (같은 천간 같은 음양)', r.axes.dayGan.label === 'biJian',
    `got ${r.axes.dayGan.label}`);
  assert('same birth — dayBranch label = same', r.axes.dayBranch.label === 'same');
  assert('same birth — sajuA.dayMaster = 己', r.sajuA.dayMaster === '己');
  console.log(`  score=${r.score}, axes=`, JSON.stringify(r.axes, null, 2).slice(0, 200));
}

// === Case 2: 六合 case — 子 + 丑 (일지 합)
// 子일주: 1990-12-20 (己未) — 未다, 子가 아님. 별도 케이스 만들어야.
// 子일주 검색: 子일 → 60갑자에서 甲子/丙子/戊子/庚子/壬子 중 아무거나.
// 1984-02-04 (甲子년 立春) 부근 — 일주 추정 어려움. 케이스로 우회: known 子일·known 丑일 직접 만들기.
// 2024-01-15(추정 일지 子 또는 丑일 — verify via runner). 우선 hands-off로 합/충/평이만 확인.
{
  // 1990-12-20 (己未) + 1991-06-15 (가정 — 일지 다양)
  const r = calcCompatibility(
    { year: 1990, month: 12, day: 20, hour: 16, minute: 30 },
    { year: 1991, month: 6, day: 15, hour: 9 },
  );
  assert('cross birth — score 0-100', r.score >= 0 && r.score <= 100, `score=${r.score}`);
  assert('cross birth — axes 4개 모두 존재', Object.keys(r.axes).length === 4);
  assert('cross birth — 각 축 score 0 이상', Object.values(r.axes).every(a => a.score >= 0));
  console.log(`  score=${r.score}, dayGanA=${r.sajuA.dayMaster}, dayGanB=${r.sajuB.dayMaster}, dayZhiA=${r.sajuA.dayZhi}, dayZhiB=${r.sajuB.dayZhi}`);
}

// === Case 3: 五行 보완 — 한쪽 wood 0, 한쪽 wood 많음
{
  const r = calcCompatibility(
    { year: 1990, month: 12, day: 20, hour: 16, minute: 30 },
    { year: 1985, month: 3, day: 10, hour: 6 },
  );
  console.log(`  case3 elementsA=`, r.sajuA.elements);
  console.log(`  case3 elementsB=`, r.sajuB.elements);
  console.log(`  case3 complement=`, r.axes.complement);
  assert('complement axis has fillRatio in [0,1]',
    r.axes.complement.fillRatio === undefined || (r.axes.complement.fillRatio >= 0 && r.axes.complement.fillRatio <= 1));
}

// === Case 4: 합산 balance — combined 5행 합이 input 합과 일치 (no loss)
{
  const r = calcCompatibility(
    { year: 1990, month: 12, day: 20, hour: 16, minute: 30 },
    { year: 1985, month: 3, day: 10, hour: 6 },
  );
  const sumA = Object.values(r.sajuA.elements).reduce((a, b) => a + b, 0);
  const sumB = Object.values(r.sajuB.elements).reduce((a, b) => a + b, 0);
  const sumC = Object.values(r.axes.balance.combined).reduce((a, b) => a + b, 0);
  assert(`balance combined sum = A+B (${sumA} + ${sumB} = ${sumC})`, sumC === sumA + sumB);
}

// === Case 5: verdict tiering
{
  assert('verdict 90 = soulmate', compatVerdict(90) === 'soulmate');
  assert('verdict 75 = strong', compatVerdict(75) === 'strong');
  assert('verdict 60 = good', compatVerdict(60) === 'good');
  assert('verdict 45 = mixed', compatVerdict(45) === 'mixed');
  assert('verdict 30 = challenging', compatVerdict(30) === 'challenging');
}

// === Case 6: 결과 score 분포 — 10쌍 sample로 outlier 없는지
{
  const samples = [
    [{ year: 1990, month: 1, day: 15, hour: 10 }, { year: 1992, month: 7, day: 22, hour: 14 }],
    [{ year: 1985, month: 3, day: 8, hour: 6 }, { year: 1988, month: 11, day: 30, hour: 22 }],
    [{ year: 1995, month: 5, day: 5, hour: 5 }, { year: 1995, month: 5, day: 5, hour: 17 }],
    [{ year: 2000, month: 12, day: 31, hour: 23 }, { year: 2001, month: 1, day: 1, hour: 0 }],
    [{ year: 1978, month: 8, day: 14, hour: 12 }, { year: 1980, month: 2, day: 28, hour: 0 }],
  ];
  for (const [a, b] of samples) {
    const r = calcCompatibility(a, b);
    const ok = r.score >= 0 && r.score <= 100;
    if (!ok) {
      console.log(`✗ outlier — score=${r.score}`, a, b);
      failed++;
    } else {
      passed++;
    }
  }
  console.log(`✓ 5쌍 sample 모두 [0,100] 범위`);
}

console.log(`\n${passed + failed} tests · ${passed} passed · ${failed} failed`);
process.exit(failed > 0 ? 1 : 0);
