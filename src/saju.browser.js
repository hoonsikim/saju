// 브라우저 전용 entry — esm.sh로 lunar-javascript import.
// Node용 src/saju.js와 95% 동일. lunar import 경로만 다름.

import lunarPkg from 'https://esm.sh/lunar-javascript@1.7.7';
const { Lunar } = lunarPkg;

const GAN_ELEMENT = {
  '甲': 'wood', '乙': 'wood', '丙': 'fire', '丁': 'fire',
  '戊': 'earth', '己': 'earth', '庚': 'metal', '辛': 'metal',
  '壬': 'water', '癸': 'water',
};
const ZHI_ELEMENT = {
  '寅': 'wood', '卯': 'wood', '巳': 'fire', '午': 'fire',
  '辰': 'earth', '戌': 'earth', '丑': 'earth', '未': 'earth',
  '申': 'metal', '酉': 'metal', '子': 'water', '亥': 'water',
};
const GAN_YINYANG = {
  '甲': 'yang', '乙': 'yin', '丙': 'yang', '丁': 'yin',
  '戊': 'yang', '己': 'yin', '庚': 'yang', '辛': 'yin',
  '壬': 'yang', '癸': 'yin',
};
const ELEMENT_GENERATES = { wood: 'fire', fire: 'earth', earth: 'metal', metal: 'water', water: 'wood' };
const ELEMENT_OVERCOMES = { wood: 'earth', earth: 'water', water: 'fire', fire: 'metal', metal: 'wood' };

function tenGodLabel(dayGan, otherGan) {
  if (!dayGan || !otherGan) return null;
  const dayElement = GAN_ELEMENT[dayGan];
  const otherElement = GAN_ELEMENT[otherGan];
  const sameYinYang = GAN_YINYANG[dayGan] === GAN_YINYANG[otherGan];
  if (dayElement === otherElement) return sameYinYang ? '比肩' : '劫財';
  if (ELEMENT_GENERATES[dayElement] === otherElement) return sameYinYang ? '食神' : '傷官';
  if (ELEMENT_OVERCOMES[dayElement] === otherElement) return sameYinYang ? '偏財' : '正財';
  if (ELEMENT_OVERCOMES[otherElement] === dayElement) return sameYinYang ? '七殺' : '正官';
  if (ELEMENT_GENERATES[otherElement] === dayElement) return sameYinYang ? '偏印' : '正印';
  return null;
}

function analyzePillar(ganZhi) {
  if (!ganZhi || ganZhi.length !== 2) return null;
  const gan = ganZhi[0];
  const zhi = ganZhi[1];
  return {
    ganZhi, gan, zhi,
    ganElement: GAN_ELEMENT[gan] || null,
    zhiElement: ZHI_ELEMENT[zhi] || null,
    yinYang: GAN_YINYANG[gan] || null,
  };
}

export function birthInfoToFourPillars({ year, month, day, hour, minute = 0 }) {
  const jsDate = new Date(year, month - 1, day, hour, minute, 0);
  const lunar = Lunar.fromDate(jsDate);
  const pillars = {
    year: analyzePillar(lunar.getYearInGanZhi()),
    month: analyzePillar(lunar.getMonthInGanZhi()),
    day: analyzePillar(lunar.getDayInGanZhi()),
    hour: analyzePillar(lunar.getTimeInGanZhi()),
  };
  const dayMaster = pillars.day?.gan || null;
  const dayMasterElement = dayMaster ? GAN_ELEMENT[dayMaster] : null;
  const elements = { wood: 0, fire: 0, earth: 0, metal: 0, water: 0 };
  for (const key of ['year', 'month', 'day', 'hour']) {
    const p = pillars[key];
    if (!p) continue;
    if (p.ganElement) elements[p.ganElement]++;
    if (p.zhiElement) elements[p.zhiElement]++;
  }
  const tenGods = dayMaster ? {
    yearGan: tenGodLabel(dayMaster, pillars.year?.gan),
    monthGan: tenGodLabel(dayMaster, pillars.month?.gan),
    hourGan: tenGodLabel(dayMaster, pillars.hour?.gan),
  } : {};
  return {
    input: { year, month, day, hour, minute },
    pillars, dayMaster, dayMasterElement, elements, tenGods,
  };
}

export function elementBalance(saju) {
  const total = Object.values(saju.elements).reduce((a, b) => a + b, 0) || 1;
  const out = {};
  for (const k of Object.keys(saju.elements)) {
    out[k] = Math.round((saju.elements[k] / total) * 100);
  }
  return out;
}

export function elementStrength(saju) {
  const balance = elementBalance(saju);
  const elements = Object.entries(balance).sort((a, b) => b[1] - a[1]);
  return {
    strongest: elements[0][0],
    weakest: elements[elements.length - 1][0],
    missing: elements.filter(([, v]) => v === 0).map(([k]) => k),
    balance,
  };
}
