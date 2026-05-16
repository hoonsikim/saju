// P003 Saju 글로벌 — 4 pillars 계산 엔진
//
// 입력: 생년월일시 (양력 solar) + 시간대(선택)
// 출력: { pillars: { year, month, day, hour }, dayMaster, elements, tenGods }
//
// lunar-javascript wraps Korean/Chinese Saju convention:
//   - 月柱 starts from 立春 (around Feb 4), not Lunar New Year
//   - 時柱 uses 23:00–00:59 = 子時 convention
//
// 천간(天干): 甲乙丙丁戊己庚辛壬癸 (10)
// 지지(地支): 子丑寅卯辰巳午未申酉戌亥 (12)
// 60갑자 = 천간×지지 LCM cycle

import lunarPkg from 'lunar-javascript';
const { Lunar } = lunarPkg;

// 천간 → 오행 매핑
const GAN_ELEMENT = {
  '甲': 'wood', '乙': 'wood',
  '丙': 'fire', '丁': 'fire',
  '戊': 'earth', '己': 'earth',
  '庚': 'metal', '辛': 'metal',
  '壬': 'water', '癸': 'water',
};

// 지지 → 오행 매핑
const ZHI_ELEMENT = {
  '寅': 'wood', '卯': 'wood',
  '巳': 'fire', '午': 'fire',
  '辰': 'earth', '戌': 'earth', '丑': 'earth', '未': 'earth',
  '申': 'metal', '酉': 'metal',
  '子': 'water', '亥': 'water',
};

// 천간 → 음양
const GAN_YINYANG = {
  '甲': 'yang', '乙': 'yin',
  '丙': 'yang', '丁': 'yin',
  '戊': 'yang', '己': 'yin',
  '庚': 'yang', '辛': 'yin',
  '壬': 'yang', '癸': 'yin',
};

// 오행 상생/상극 관계
const ELEMENT_GENERATES = {
  wood: 'fire',
  fire: 'earth',
  earth: 'metal',
  metal: 'water',
  water: 'wood',
};
const ELEMENT_OVERCOMES = {
  wood: 'earth',
  earth: 'water',
  water: 'fire',
  fire: 'metal',
  metal: 'wood',
};

// 10신 라벨 (day master 기준 다른 천간과의 관계)
function tenGodLabel(dayGan, otherGan) {
  if (!dayGan || !otherGan) return null;
  const dayElement = GAN_ELEMENT[dayGan];
  const otherElement = GAN_ELEMENT[otherGan];
  const sameYinYang = GAN_YINYANG[dayGan] === GAN_YINYANG[otherGan];

  if (dayElement === otherElement) {
    return sameYinYang ? '比肩' : '劫財';
  }
  if (ELEMENT_GENERATES[dayElement] === otherElement) {
    return sameYinYang ? '食神' : '傷官';
  }
  if (ELEMENT_OVERCOMES[dayElement] === otherElement) {
    return sameYinYang ? '偏財' : '正財';
  }
  if (ELEMENT_OVERCOMES[otherElement] === dayElement) {
    return sameYinYang ? '七殺' : '正官';
  }
  if (ELEMENT_GENERATES[otherElement] === dayElement) {
    return sameYinYang ? '偏印' : '正印';
  }
  return null;
}

// 단일 pillar 분석
function analyzePillar(ganZhi) {
  if (!ganZhi || ganZhi.length !== 2) return null;
  const gan = ganZhi[0];
  const zhi = ganZhi[1];
  return {
    ganZhi,
    gan,
    zhi,
    ganElement: GAN_ELEMENT[gan] || null,
    zhiElement: ZHI_ELEMENT[zhi] || null,
    yinYang: GAN_YINYANG[gan] || null,
  };
}

/**
 * 생년월일시 → 4 pillars + dayMaster + 5 elements 비율 + 10 gods
 *
 * @param {Object} birth
 * @param {number} birth.year - 양력 연 (e.g. 1990)
 * @param {number} birth.month - 양력 월 1~12
 * @param {number} birth.day - 양력 일 1~31
 * @param {number} birth.hour - 시 0~23 (현지 시각)
 * @param {number} [birth.minute=0] - 분 0~59
 * @param {string} [birth.gender] - 'female' | 'male' | null. 대운 방향·리딩 맥락용.
 * @param {string} [birth.city] - 출생 도시 (자유 입력). 진태양시 보정·리딩 맥락용.
 * @returns {Object} { pillars, dayMaster, elements, tenGods }
 */
export function birthInfoToFourPillars({ year, month, day, hour, minute = 0, gender = null, city = null }) {
  // lunar-javascript: Lunar.fromDate(jsDate) 또는 Solar 변환
  const jsDate = new Date(year, month - 1, day, hour, minute, 0);
  const lunar = Lunar.fromDate(jsDate);
  const eight = lunar.getEightChar();

  const pillars = {
    year: analyzePillar(lunar.getYearInGanZhi()),
    month: analyzePillar(lunar.getMonthInGanZhi()),
    day: analyzePillar(lunar.getDayInGanZhi()),
    hour: analyzePillar(lunar.getTimeInGanZhi()),
  };

  // Day Master = 일주의 천간 (日干)
  const dayMaster = pillars.day?.gan || null;
  const dayMasterElement = dayMaster ? GAN_ELEMENT[dayMaster] : null;

  // 5 elements 카운트 (8 chars: 4 gan + 4 zhi)
  const elements = { wood: 0, fire: 0, earth: 0, metal: 0, water: 0 };
  for (const key of ['year', 'month', 'day', 'hour']) {
    const p = pillars[key];
    if (!p) continue;
    if (p.ganElement) elements[p.ganElement]++;
    if (p.zhiElement) elements[p.zhiElement]++;
  }

  // 10 gods (Day Master 기준 다른 3개 천간 + 4개 지지의 본기)
  const tenGods = dayMaster ? {
    yearGan: tenGodLabel(dayMaster, pillars.year?.gan),
    monthGan: tenGodLabel(dayMaster, pillars.month?.gan),
    hourGan: tenGodLabel(dayMaster, pillars.hour?.gan),
  } : {};

  // 지장간 (支藏干) — 지지 속 숨은 천간 (정기·중기·여기 순)
  // ADR-023 — 무료 path 깊이
  const hiddenStems = {
    year: eight.getYearHideGan() || [],
    month: eight.getMonthHideGan() || [],
    day: eight.getDayHideGan() || [],
    hour: eight.getTimeHideGan() || [],
  };

  // 12운성 (十二運星) — 일간 기준 각 지지의 강약 12단계
  // 长生·沐浴·冠带·临官·帝旺·衰·病·死·墓·绝·胎·养
  const twelveStages = {
    year: eight.getYearDiShi() || null,
    month: eight.getMonthDiShi() || null,
    day: eight.getDayDiShi() || null,
    hour: eight.getTimeDiShi() || null,
  };

  // 공망 (空亡) — 일주가 속한 순(旬)의 끝 2개 지지
  const voidBranches = eight.getDayXunKong() || '';

  // 대운 (大運) — 양남음녀 순행 / 음남양녀 역행. 10년 단위 8개.
  // gender: 'female' = 0, 'male' = 1. null이면 majorLuck = null.
  let majorLuck = null;
  if (gender === 'male' || gender === 'female') {
    const genderInt = gender === 'male' ? 1 : 0;
    try {
      const yun = eight.getYun(genderInt);
      const startYear = yun.getStartYear ? yun.getStartYear() : null;
      const startMonth = yun.getStartMonth ? yun.getStartMonth() : null;
      const startDay = yun.getStartDay ? yun.getStartDay() : null;
      const daYun = yun.getDaYun ? yun.getDaYun() : [];
      // 첫 원소는 출생~첫대운 사이 小運 (ganZhi 비어있음) → 건너뜀
      const cycles = [];
      for (const d of daYun.slice(1, 9)) {
        const gz = d.getGanZhi();
        if (!gz || gz.length !== 2) continue;
        cycles.push({
          ganZhi: gz,
          gan: gz[0],
          zhi: gz[1],
          ganElement: GAN_ELEMENT[gz[0]] || null,
          zhiElement: ZHI_ELEMENT[gz[1]] || null,
          tenGod: tenGodLabel(dayMaster, gz[0]),
          startAge: d.getStartAge ? d.getStartAge() : null,
          startYear: d.getStartYear ? d.getStartYear() : null,
        });
      }
      majorLuck = { startYear, startMonth, startDay, cycles };
    } catch (e) {
      // lunar-javascript 호출 실패 시 silent — majorLuck = null
    }
  }

  return {
    input: { year, month, day, hour, minute, gender, city },
    pillars,
    dayMaster,
    dayMasterElement,
    elements,
    tenGods,
    hiddenStems,
    twelveStages,
    voidBranches,
    majorLuck,
  };
}

// 5 elements 비율 (백분율)
export function elementBalance(saju) {
  const total = Object.values(saju.elements).reduce((a, b) => a + b, 0) || 1;
  const out = {};
  for (const k of Object.keys(saju.elements)) {
    out[k] = Math.round((saju.elements[k] / total) * 100);
  }
  return out;
}

// 약하거나 강한 오행 (균형 진단)
export function elementStrength(saju) {
  const balance = elementBalance(saju);
  const elements = Object.entries(balance).sort((a, b) => b[1] - a[1]);
  return {
    strongest: elements[0][0],
    weakest: elements[elements.length - 1][0],
    missing: elements.filter(([_, v]) => v === 0).map(([k]) => k),
    balance,
  };
}
