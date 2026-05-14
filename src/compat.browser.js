// Browser entry — saju.browser.js를 import해 lunar-javascript esm.sh 경로를 공유.
// 로직은 src/compat.js와 동일.

import { birthInfoToFourPillars } from './saju.browser.js';

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

function dayGanCompatScore(ganA, ganB) {
  if (!ganA || !ganB) return { score: 0, label: 'unknown' };
  const elA = GAN_ELEMENT[ganA];
  const elB = GAN_ELEMENT[ganB];
  const sameYY = GAN_YINYANG[ganA] === GAN_YINYANG[ganB];
  if (elA === elB) {
    return sameYY
      ? { score: 18, label: 'biJian', desc: '同氣' }
      : { score: 24, label: 'jieCai', desc: '陰陽 보완' };
  }
  if (ELEMENT_GENERATES[elA] === elB || ELEMENT_GENERATES[elB] === elA) {
    return sameYY
      ? { score: 22, label: 'generate', desc: '相生' }
      : { score: 28, label: 'generate-yy', desc: '相生 + 陰陽' };
  }
  if (ELEMENT_OVERCOMES[elA] === elB || ELEMENT_OVERCOMES[elB] === elA) {
    return sameYY
      ? { score: 10, label: 'overcome', desc: '相剋' }
      : { score: 16, label: 'overcome-yy', desc: '相剋 + 陰陽' };
  }
  return { score: 12, label: 'neutral', desc: '중립' };
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

function dayBranchCompatScore(zhiA, zhiB) {
  if (!zhiA || !zhiB) return { score: 0, label: 'unknown' };
  if (zhiA === zhiB) return { score: 18, label: 'same', desc: '同支' };
  const pair = zhiA + zhiB;
  if (BRANCH_SIX_HARMONY.has(pair)) return { score: 25, label: 'sixHarmony', desc: '六合' };
  if (BRANCH_CLASH.has(pair)) return { score: 8, label: 'clash', desc: '相沖' };
  if (BRANCH_PUNISH.has(pair)) return { score: 10, label: 'punish', desc: '相刑' };
  if (BRANCH_HARM.has(pair)) return { score: 11, label: 'harm', desc: '相害' };
  return { score: 15, label: 'neutral', desc: '평이' };
}

function elementComplementScore(elementsA, elementsB) {
  const missingA = Object.keys(elementsA).filter(k => elementsA[k] === 0);
  const missingB = Object.keys(elementsB).filter(k => elementsB[k] === 0);
  let filled = 0;
  for (const m of missingA) if ((elementsB[m] || 0) >= 2) filled += 1;
  for (const m of missingB) if ((elementsA[m] || 0) >= 2) filled += 1;
  const totalMissing = missingA.length + missingB.length;
  if (totalMissing === 0) {
    return { score: 18, fillRatio: 1, desc: '자기 완결' };
  }
  const fillRatio = filled / totalMissing;
  return {
    score: Math.round(15 + 10 * fillRatio),
    fillRatio, filled, totalMissing,
    desc: filled > 0 ? '서로 보완' : '같이 부족',
  };
}

function combinedBalanceScore(elementsA, elementsB) {
  const combined = { wood: 0, fire: 0, earth: 0, metal: 0, water: 0 };
  for (const k of Object.keys(combined)) {
    combined[k] = (elementsA[k] || 0) + (elementsB[k] || 0);
  }
  const total = Object.values(combined).reduce((a, b) => a + b, 0) || 1;
  const ideal = total / 5;
  let deviation = 0;
  for (const k of Object.keys(combined)) deviation += Math.abs(combined[k] - ideal);
  const normDev = deviation / (2 * total);
  const score = Math.round(20 * (1 - normDev));
  return { score: Math.max(0, score), combined, deviation: Math.round(normDev * 100) / 100 };
}

export function calcCompatibility(birthA, birthB) {
  const sajuA = birthInfoToFourPillars(birthA);
  const sajuB = birthInfoToFourPillars(birthB);
  const ganAxis = dayGanCompatScore(sajuA.dayMaster, sajuB.dayMaster);
  const branchAxis = dayBranchCompatScore(sajuA.pillars.day?.zhi, sajuB.pillars.day?.zhi);
  const complementAxis = elementComplementScore(sajuA.elements, sajuB.elements);
  const balanceAxis = combinedBalanceScore(sajuA.elements, sajuB.elements);
  const score = ganAxis.score + branchAxis.score + complementAxis.score + balanceAxis.score;
  return {
    score: Math.min(100, score),
    axes: { dayGan: ganAxis, dayBranch: branchAxis, complement: complementAxis, balance: balanceAxis },
    sajuA: { dayMaster: sajuA.dayMaster, dayZhi: sajuA.pillars.day?.zhi, elements: sajuA.elements },
    sajuB: { dayMaster: sajuB.dayMaster, dayZhi: sajuB.pillars.day?.zhi, elements: sajuB.elements },
  };
}

export function compatVerdict(score) {
  if (score >= 85) return 'soulmate';
  if (score >= 70) return 'strong';
  if (score >= 55) return 'good';
  if (score >= 40) return 'mixed';
  return 'challenging';
}
