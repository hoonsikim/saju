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

export function birthInfoToFourPillars({ year, month, day, hour, minute = 0, gender = null, city = null }) {
  const jsDate = new Date(year, month - 1, day, hour, minute, 0);
  const lunar = Lunar.fromDate(jsDate);
  const eight = lunar.getEightChar();
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
  // ADR-023 — 무료 path 깊이 (지장간·12운성·공망·대운)
  const hiddenStems = {
    year: eight.getYearHideGan() || [],
    month: eight.getMonthHideGan() || [],
    day: eight.getDayHideGan() || [],
    hour: eight.getTimeHideGan() || [],
  };
  const twelveStages = {
    year: eight.getYearDiShi() || null,
    month: eight.getMonthDiShi() || null,
    day: eight.getDayDiShi() || null,
    hour: eight.getTimeDiShi() || null,
  };
  const voidBranches = eight.getDayXunKong() || '';
  let majorLuck = null;
  if (gender === 'male' || gender === 'female') {
    const genderInt = gender === 'male' ? 1 : 0;
    try {
      const yun = eight.getYun(genderInt);
      const startYear = yun.getStartYear ? yun.getStartYear() : null;
      const startMonth = yun.getStartMonth ? yun.getStartMonth() : null;
      const startDay = yun.getStartDay ? yun.getStartDay() : null;
      const daYun = yun.getDaYun ? yun.getDaYun() : [];
      const cycles = [];
      for (const d of daYun.slice(1, 9)) {
        const gz = d.getGanZhi();
        if (!gz || gz.length !== 2) continue;
        cycles.push({
          ganZhi: gz, gan: gz[0], zhi: gz[1],
          ganElement: GAN_ELEMENT[gz[0]] || null,
          zhiElement: ZHI_ELEMENT[gz[1]] || null,
          tenGod: tenGodLabel(dayMaster, gz[0]),
          startAge: d.getStartAge ? d.getStartAge() : null,
          startYear: d.getStartYear ? d.getStartYear() : null,
        });
      }
      majorLuck = { startYear, startMonth, startDay, cycles };
    } catch {}
  }
  // 신살 + 올해 세운 (ADR-030)
  const shenSha = dayMaster ? computeShenSha(pillars, dayMaster) : { tianyi: [], taohwa: [], yeokma: [] };
  const currentYearPillar = getCurrentYearPillar(new Date(), dayMaster);

  return {
    input: { year, month, day, hour, minute, gender, city },
    pillars, dayMaster, dayMasterElement, elements, tenGods,
    hiddenStems, twelveStages, voidBranches, majorLuck,
    shenSha, currentYearPillar,
  };
}

// 신살 (ADR-030) — 천을귀인·도화살·역마살
const TIANYI_FROM_GAN = {
  '甲': ['丑','未'], '戊': ['丑','未'], '庚': ['丑','未'],
  '乙': ['子','申'], '己': ['子','申'],
  '丙': ['亥','酉'], '丁': ['亥','酉'],
  '壬': ['巳','卯'], '癸': ['巳','卯'],
  '辛': ['寅','午'],
};
const TAOHWA_FROM_BRANCH = {
  '寅':'卯','午':'卯','戌':'卯',
  '申':'酉','子':'酉','辰':'酉',
  '巳':'午','酉':'午','丑':'午',
  '亥':'子','卯':'子','未':'子',
};
const YEOKMA_FROM_BRANCH = {
  '寅':'申','午':'申','戌':'申',
  '申':'寅','子':'寅','辰':'寅',
  '巳':'亥','酉':'亥','丑':'亥',
  '亥':'巳','卯':'巳','未':'巳',
};

export function computeShenSha(pillars, dayMaster) {
  const branches = ['year','month','day','hour'].map(k => pillars[k]?.zhi).filter(Boolean);
  const branchSet = new Set(branches);
  const yearZhi = pillars.year?.zhi;
  const dayZhi = pillars.day?.zhi;
  const tianyi = (TIANYI_FROM_GAN[dayMaster] || []).filter(t => branchSet.has(t));
  const taohwaTargets = new Set();
  if (yearZhi && TAOHWA_FROM_BRANCH[yearZhi]) taohwaTargets.add(TAOHWA_FROM_BRANCH[yearZhi]);
  if (dayZhi && TAOHWA_FROM_BRANCH[dayZhi]) taohwaTargets.add(TAOHWA_FROM_BRANCH[dayZhi]);
  const taohwa = [...taohwaTargets].filter(t => branchSet.has(t));
  const yeokmaTargets = new Set();
  if (yearZhi && YEOKMA_FROM_BRANCH[yearZhi]) yeokmaTargets.add(YEOKMA_FROM_BRANCH[yearZhi]);
  if (dayZhi && YEOKMA_FROM_BRANCH[dayZhi]) yeokmaTargets.add(YEOKMA_FROM_BRANCH[dayZhi]);
  const yeokma = [...yeokmaTargets].filter(t => branchSet.has(t));
  return { tianyi, taohwa, yeokma };
}

export function getCurrentYearPillar(date = new Date(), dayMaster = null) {
  try {
    const lunar = Lunar.fromDate(date);
    const pillar = analyzePillar(lunar.getYearInGanZhi());
    if (!pillar) return null;
    return {
      ...pillar,
      tenGod: dayMaster ? tenGodLabel(dayMaster, pillar.gan) : null,
      year: date.getFullYear(),
    };
  } catch { return null; }
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
