// Browser entry — saju.browser.js를 import해 lunar-javascript esm.sh 경로를 공유.
// 로직은 src/daily-fortune.js와 동일.

import { birthInfoToFourPillars } from './saju.browser.js';

const GAN_ELEMENT = {
  '甲': 'wood', '乙': 'wood',
  '丙': 'fire', '丁': 'fire',
  '戊': 'earth', '己': 'earth',
  '庚': 'metal', '辛': 'metal',
  '壬': 'water', '癸': 'water',
};
const ELEMENT_GENERATES = {
  wood: 'fire', fire: 'earth', earth: 'metal', metal: 'water', water: 'wood',
};
const ELEMENT_OVERCOMES = {
  wood: 'earth', earth: 'water', water: 'fire', fire: 'metal', metal: 'wood',
};

const GAN_ORDER = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
const ZHI_ORDER = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];

function tenGodTheme(dayGan, otherGan) {
  if (!dayGan || !otherGan) return 'peer';
  const dayEl = GAN_ELEMENT[dayGan];
  const otherEl = GAN_ELEMENT[otherGan];
  if (dayEl === otherEl) return 'peer';
  if (ELEMENT_GENERATES[dayEl] === otherEl) return 'output';
  if (ELEMENT_OVERCOMES[dayEl] === otherEl) return 'wealth';
  if (ELEMENT_OVERCOMES[otherEl] === dayEl) return 'officer';
  if (ELEMENT_GENERATES[otherEl] === dayEl) return 'resource';
  return 'peer';
}

const BRANCH_SIX_HARMONY = new Set([
  '子丑', '丑子', '寅亥', '亥寅', '卯戌', '戌卯',
  '辰酉', '酉辰', '巳申', '申巳', '午未', '未午',
]);
const BRANCH_CLASH = new Set([
  '子午', '午子', '丑未', '未丑', '寅申', '申寅',
  '卯酉', '酉卯', '辰戌', '戌辰', '巳亥', '亥巳',
]);
const BRANCH_PUNISH = new Set([
  '寅巳', '巳申', '申寅', '丑戌', '戌未', '未丑',
  '子卯', '卯子', '辰辰', '午午', '酉酉', '亥亥',
]);
const BRANCH_HARM = new Set([
  '子未', '未子', '丑午', '午丑', '寅巳', '巳寅',
  '卯辰', '辰卯', '申亥', '亥申', '酉戌', '戌酉',
]);

function branchRelation(zhiA, zhiB) {
  if (!zhiA || !zhiB) return 'neutral';
  if (zhiA === zhiB) return 'same';
  const pair = zhiA + zhiB;
  if (BRANCH_SIX_HARMONY.has(pair)) return 'sixHarmony';
  if (BRANCH_CLASH.has(pair)) return 'clash';
  if (BRANCH_PUNISH.has(pair)) return 'punish';
  if (BRANCH_HARM.has(pair)) return 'harm';
  return 'neutral';
}

const THEME_BASE = {
  wealth: 68, output: 62, resource: 58, peer: 55, officer: 52,
};

const BRANCH_DELTA = {
  sixHarmony: 18, same: 8, neutral: 2, harm: -8, punish: -12, clash: -16,
};

const THEME_AXIS = {
  wealth:   { wealth: 12, career: 4, love: 0, health: -4, social: 2 },
  officer:  { wealth: 2, career: 14, love: -2, health: -6, social: 0 },
  output:   { wealth: 4, career: 2, love: 10, health: 2, social: 12 },
  resource: { wealth: -4, career: 0, love: 2, health: 12, social: -2 },
  peer:     { wealth: -6, career: 2, love: 0, health: 4, social: 12 },
};

const AXES = ['wealth', 'career', 'love', 'health', 'social'];

function clamp(n, lo, hi) {
  return Math.max(lo, Math.min(hi, n));
}

function isoDate(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/**
 * 사용자 생일 + 날짜 → 오늘의 운세.
 *
 * @param {Object} birth - 생년월일시 ({year, month, day, hour, minute?})
 * @param {Date} [date] - 운세를 볼 날짜 (기본: 오늘)
 * @returns {Object} { date, dayGanZhi, theme, branchRelation, score, axes, luckiest, myDayMaster }
 */
export function dailyFortune(birth, date = new Date()) {
  const mySaju = birthInfoToFourPillars(birth);
  const todaySaju = birthInfoToFourPillars({
    year: date.getFullYear(),
    month: date.getMonth() + 1,
    day: date.getDate(),
    hour: 12,
  });
  const todayDay = todaySaju.pillars.day;
  const myDayGan = mySaju.dayMaster;
  const myDayZhi = mySaju.pillars.day?.zhi;

  const theme = tenGodTheme(myDayGan, todayDay?.gan);
  const relation = branchRelation(myDayZhi, todayDay?.zhi);

  const ganIdx = GAN_ORDER.indexOf(todayDay?.gan);
  const zhiIdx = ZHI_ORDER.indexOf(todayDay?.zhi);
  const jitter = ganIdx >= 0 && zhiIdx >= 0
    ? (((ganIdx + 1) * (zhiIdx + 1)) % 13) - 6
    : 0;

  const score = clamp((THEME_BASE[theme] ?? 55) + (BRANCH_DELTA[relation] ?? 0) + jitter, 5, 99);

  const axes = {};
  for (const ax of AXES) {
    axes[ax] = clamp(score + (THEME_AXIS[theme]?.[ax] ?? 0), 5, 99);
  }
  const luckiest = Object.entries(axes).sort((a, b) => b[1] - a[1])[0][0];

  return {
    date: isoDate(date),
    dayGanZhi: todayDay?.ganZhi || null,
    theme,
    branchRelation: relation,
    score,
    axes,
    luckiest,
    myDayMaster: myDayGan,
  };
}

export function fortuneVerdict(score) {
  if (score >= 80) return 'excellent';
  if (score >= 65) return 'good';
  if (score >= 50) return 'fair';
  if (score >= 35) return 'caution';
  return 'rest';
}

/**
 * 사용자 생일 + 시작일 → 7일간의 일운 미리보기. (src/daily-fortune.js와 동일 로직)
 *
 * @param {Object} birth - 생년월일시 ({year, month, day, hour, minute?})
 * @param {Date} [fromDate] - 7일 구간의 첫날 (기본: 오늘)
 * @returns {Object} { days: Array<dailyFortune & {weekday, offset}>, best: {date, score, index} }
 */
export function weeklyForecast(birth, fromDate = new Date()) {
  const days = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(fromDate.getFullYear(), fromDate.getMonth(), fromDate.getDate() + i);
    days.push({ ...dailyFortune(birth, d), weekday: d.getDay(), offset: i });
  }
  let best = days[0];
  for (const day of days) {
    if (day.score > best.score) best = day;
  }
  return {
    days,
    best: { date: best.date, score: best.score, index: best.offset },
  };
}
