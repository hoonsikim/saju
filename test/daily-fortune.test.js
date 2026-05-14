import { dailyFortune, fortuneVerdict, weeklyForecast } from '../src/daily-fortune.js';

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

const BIRTH = { year: 1990, month: 12, day: 20, hour: 16, minute: 30 };
const VALID_THEMES = ['wealth', 'officer', 'resource', 'output', 'peer'];
const VALID_RELATIONS = ['sixHarmony', 'same', 'neutral', 'harm', 'punish', 'clash'];
const AXES = ['wealth', 'career', 'love', 'health', 'social'];

// === Case 1: 기본 출력 형태
{
  const r = dailyFortune(BIRTH, new Date(2026, 4, 15, 12));
  assert('score is number 5-99', typeof r.score === 'number' && r.score >= 5 && r.score <= 99, `score=${r.score}`);
  assert('theme is valid key', VALID_THEMES.includes(r.theme), `got ${r.theme}`);
  assert('branchRelation is valid key', VALID_RELATIONS.includes(r.branchRelation), `got ${r.branchRelation}`);
  assert('dayGanZhi is 2-char 干支', typeof r.dayGanZhi === 'string' && r.dayGanZhi.length === 2, `got ${r.dayGanZhi}`);
  assert('myDayMaster = 己 (1990-12-20)', r.myDayMaster === '己', `got ${r.myDayMaster}`);
  console.log(`  ${r.date} ${r.dayGanZhi} theme=${r.theme} rel=${r.branchRelation} score=${r.score}`);
}

// === Case 2: 5축 모두 존재 + 범위
{
  const r = dailyFortune(BIRTH, new Date(2026, 4, 15, 12));
  assert('axes has 5 keys', Object.keys(r.axes).length === 5);
  assert('all axes in [5,99]', AXES.every(a => r.axes[a] >= 5 && r.axes[a] <= 99),
    JSON.stringify(r.axes));
  assert('luckiest is a valid axis', AXES.includes(r.luckiest), `got ${r.luckiest}`);
  assert('luckiest has max axis value',
    r.axes[r.luckiest] === Math.max(...AXES.map(a => r.axes[a])));
}

// === Case 3: 결정론 — 같은 (생일, 날짜) → 동일 결과
{
  const d = new Date(2026, 4, 15, 12);
  const r1 = dailyFortune(BIRTH, d);
  const r2 = dailyFortune(BIRTH, new Date(2026, 4, 15, 12));
  assert('deterministic — score 동일', r1.score === r2.score);
  assert('deterministic — theme/relation/dayGanZhi 동일',
    r1.theme === r2.theme && r1.branchRelation === r2.branchRelation && r1.dayGanZhi === r2.dayGanZhi);
}

// === Case 4: 날짜가 다르면 일진 干支도 달라짐 (연속 7일)
{
  const ganZhis = new Set();
  const scores = [];
  for (let i = 0; i < 7; i++) {
    const r = dailyFortune(BIRTH, new Date(2026, 4, 15 + i, 12));
    ganZhis.add(r.dayGanZhi);
    scores.push(r.score);
  }
  assert('연속 7일 干支 7종 모두 다름', ganZhis.size === 7, `got ${ganZhis.size}종`);
  assert('연속 7일 score 모두 [5,99]', scores.every(s => s >= 5 && s <= 99), JSON.stringify(scores));
  console.log(`  7-day scores: ${scores.join(', ')}`);
}

// === Case 5: 같은 날도 사람마다 운세가 다름
{
  const d = new Date(2026, 4, 15, 12);
  const a = dailyFortune({ year: 1990, month: 12, day: 20, hour: 16 }, d);
  const b = dailyFortune({ year: 1985, month: 3, day: 10, hour: 6 }, d);
  assert('같은 날 다른 생일 → theme 또는 score 다름',
    a.theme !== b.theme || a.score !== b.score || a.branchRelation !== b.branchRelation,
    `a=${a.theme}/${a.score} b=${b.theme}/${b.score}`);
  assert('같은 날 dayGanZhi는 동일 (일진은 사람 무관)', a.dayGanZhi === b.dayGanZhi);
}

// === Case 6: fortuneVerdict 등급
{
  assert('verdict 85 = excellent', fortuneVerdict(85) === 'excellent');
  assert('verdict 70 = good', fortuneVerdict(70) === 'good');
  assert('verdict 55 = fair', fortuneVerdict(55) === 'fair');
  assert('verdict 40 = caution', fortuneVerdict(40) === 'caution');
  assert('verdict 20 = rest', fortuneVerdict(20) === 'rest');
}

// === Case 7: 기본 date 인자 — 인자 생략 시 오늘
{
  const r = dailyFortune(BIRTH);
  const today = new Date();
  assert('date 생략 시 오늘 날짜', r.date === `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`,
    `got ${r.date}`);
}

// === Case 8: 1년 sweep — 어떤 날도 깨지지 않음
{
  let allValid = true;
  for (let i = 0; i < 365; i++) {
    const r = dailyFortune(BIRTH, new Date(2026, 0, 1 + i, 12));
    if (typeof r.score !== 'number' || r.score < 5 || r.score > 99
        || !VALID_THEMES.includes(r.theme) || !AXES.includes(r.luckiest)) {
      allValid = false;
      console.log(`✗ 365-sweep outlier day ${i}:`, JSON.stringify(r));
      break;
    }
  }
  assert('365일 sweep 모두 유효', allValid);
}

// === Case 9: weeklyForecast — 7일 구조 + 각 날 유효한 dailyFortune 형태
{
  const w = weeklyForecast(BIRTH, new Date(2026, 4, 15, 12));
  assert('weeklyForecast.days 길이 7', w.days.length === 7, `got ${w.days.length}`);
  assert('각 날 score [5,99]', w.days.every(d => d.score >= 5 && d.score <= 99),
    JSON.stringify(w.days.map(d => d.score)));
  assert('각 날 theme/luckiest 유효', w.days.every(d => VALID_THEMES.includes(d.theme) && AXES.includes(d.luckiest)));
  assert('offset 0..6 순서대로', w.days.every((d, i) => d.offset === i));
  assert('weekday 0..6 범위', w.days.every(d => d.weekday >= 0 && d.weekday <= 6));
  console.log(`  week scores: ${w.days.map(d => d.score).join(', ')}`);
}

// === Case 10: weeklyForecast — 연속 7일이라 첫날 dailyFortune과 정렬
{
  const from = new Date(2026, 4, 15, 12);
  const w = weeklyForecast(BIRTH, from);
  const day0 = dailyFortune(BIRTH, from);
  assert('days[0] = 시작일 dailyFortune', w.days[0].date === day0.date && w.days[0].score === day0.score);
  const expectedDates = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(2026, 4, 15 + i, 12);
    expectedDates.push(dailyFortune(BIRTH, d).date);
  }
  assert('7일 날짜 연속·정확', w.days.every((d, i) => d.date === expectedDates[i]),
    JSON.stringify(w.days.map(d => d.date)));
  assert('weekday 연속 (각 = (이전+1)%7)',
    w.days.every((d, i) => i === 0 || d.weekday === (w.days[i - 1].weekday + 1) % 7));
}

// === Case 11: weeklyForecast.best — 7일 중 최고 score 정확히 지목
{
  const w = weeklyForecast(BIRTH, new Date(2026, 4, 15, 12));
  const maxScore = Math.max(...w.days.map(d => d.score));
  assert('best.score = 7일 최대값', w.best.score === maxScore, `best=${w.best.score} max=${maxScore}`);
  assert('best.index가 그 날을 가리킴', w.days[w.best.index].score === w.best.score && w.days[w.best.index].date === w.best.date);
}

// === Case 12: weeklyForecast — 월 경계 overflow 정규화 (5/28 시작 → 6월로 넘어감)
{
  const w = weeklyForecast(BIRTH, new Date(2026, 4, 28, 12));
  assert('월말 시작도 7일 모두 유효', w.days.length === 7 && w.days.every(d => d.score >= 5 && d.score <= 99));
  assert('5/28 시작 → 6/03 종료 (월 경계 정규화)',
    w.days[0].date === '2026-05-28' && w.days[6].date === '2026-06-03',
    `${w.days[0].date} .. ${w.days[6].date}`);
}

// === Case 13: weeklyForecast — 결정론
{
  const d = new Date(2026, 4, 15, 12);
  const w1 = weeklyForecast(BIRTH, d);
  const w2 = weeklyForecast(BIRTH, new Date(2026, 4, 15, 12));
  assert('weeklyForecast 결정론 — days score 동일',
    w1.days.every((day, i) => day.score === w2.days[i].score && day.date === w2.days[i].date));
  assert('weeklyForecast 결정론 — best 동일',
    w1.best.score === w2.best.score && w1.best.index === w2.best.index);
}

console.log(`\n${passed + failed} tests · ${passed} passed · ${failed} failed`);
process.exit(failed > 0 ? 1 : 0);
