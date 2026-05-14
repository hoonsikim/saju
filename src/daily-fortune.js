// P003 Saju — 오늘의 운세 (Daily Fortune) 엔진
//
// 사용자의 日干(Day Master)과 오늘의 日辰(day-pillar 干支) 관계로 그날의 운세를 계산.
// 명리학의 일진(日辰) 해석을 코드화 — 점성 horoscope가 아니라 사주 엔진 재활용.
//
// 핵심 로직:
//   1. 오늘 일간 vs 내 일간 → 10신(十神) → 그날의 테마
//        wealth(財)·officer(官)·resource(印)·output(食傷)·peer(比劫)
//   2. 오늘 일지 vs 내 일지 → 六合/相沖/相刑/相害 → 운세 가감
//   3. 테마 + 일지관계 + 干支 jitter → 5개 축(재물·일·애정·건강·인간관계) 0–100
//
// 결정론적: 같은 (생일, 날짜) → 항상 같은 운세. 백엔드 0, stateless.

import { birthInfoToFourPillars } from './saju.js';

const GAN_ELEMENT = {
  '甲': 'wood', '乙': 'wood',
  '丙': 'fire', '丁': 'fire',
  '戊': 'earth', '己': 'earth',
  '庚': 'metal', '辛': 'metal',
  '壬': 'water', '癸': 'water',
};
const GAN_YINYANG = {
  '甲': 'yang', '乙': 'yin',
  '丙': 'yang', '丁': 'yin',
  '戊': 'yang', '己': 'yin',
  '庚': 'yang', '辛': 'yin',
  '壬': 'yang', '癸': 'yin',
};
const ELEMENT_GENERATES = {
  wood: 'fire', fire: 'earth', earth: 'metal', metal: 'water', water: 'wood',
};
const ELEMENT_OVERCOMES = {
  wood: 'earth', earth: 'water', water: 'fire', fire: 'metal', metal: 'wood',
};

const GAN_ORDER = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
const ZHI_ORDER = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];

// 내 일간(dayGan) 기준 오늘 일간(otherGan)의 10신 → 테마 카테고리 키
function tenGodTheme(dayGan, otherGan) {
  if (!dayGan || !otherGan) return 'peer';
  const dayEl = GAN_ELEMENT[dayGan];
  const otherEl = GAN_ELEMENT[otherGan];
  if (dayEl === otherEl) return 'peer';                       // 比肩/劫財 — 동료·경쟁
  if (ELEMENT_GENERATES[dayEl] === otherEl) return 'output';  // 食神/傷官 — 표현·활동
  if (ELEMENT_OVERCOMES[dayEl] === otherEl) return 'wealth';  // 偏財/正財 — 재물·기회
  if (ELEMENT_OVERCOMES[otherEl] === dayEl) return 'officer'; // 七殺/正官 — 직장·책임
  if (ELEMENT_GENERATES[otherEl] === dayEl) return 'resource';// 偏印/正印 — 학습·휴식
  return 'peer';
}

// 일지 합·충·형·해 (compat.js와 동일 명리 테이블, 2지지 관계)
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

// 테마별 baseline 일운 에너지 (명리상 길흉 절대값 아님 — 소비자용 baseline)
const THEME_BASE = {
  wealth: 68, output: 62, resource: 58, peer: 55, officer: 52,
};

// 일지 관계가 그날 전체 운세를 흔드는 폭
const BRANCH_DELTA = {
  sixHarmony: 18, same: 8, neutral: 2, harm: -8, punish: -12, clash: -16,
};

// 테마별 5축 가중치 — score 기준 상대 강조
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
  // 오늘의 일주는 정오 기준으로 뽑아 子時(23–01시) 경계 모호성 회피
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

  // 干支 인덱스로 결정론적 jitter (-6..+6) — 같은 테마라도 날마다 다르게
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

// 일운 점수 → 등급 (lang-agnostic key)
export function fortuneVerdict(score) {
  if (score >= 80) return 'excellent';
  if (score >= 65) return 'good';
  if (score >= 50) return 'fair';
  if (score >= 35) return 'caution';
  return 'rest';
}
