// 룰 기반 reading 생성기 — LLM 없이도 작동.
// 4 pillars + Day Master + 5 elements + 10 gods → 300~500자 reading.
// LLM 도입 전 MVP. 진짜 LLM reading은 D+2 Cloudflare Worker로.

const DAY_MASTER_ARCHETYPE = {
  '甲': { en: 'Yang Wood — the Tall Tree. Upright, growth-oriented, naturally a leader who breaks new ground.', ko: '양목(陽木) — 큰 나무. 곧고 성장 지향적, 자연스럽게 새 길을 여는 리더형.' },
  '乙': { en: 'Yin Wood — the Vine. Adaptive, persistent, finds light in any crack. Quietly unstoppable.', ko: '음목(陰木) — 덩굴. 유연하고 끈질김, 어떤 틈에서도 빛을 찾음. 조용히 멈출 수 없는 힘.' },
  '丙': { en: 'Yang Fire — the Sun. Bright, generous, warms everyone around you. Charisma is your default.', ko: '양화(陽火) — 태양. 밝고 너그러우며 주변을 따뜻하게. 카리스마가 기본.' },
  '丁': { en: 'Yin Fire — the Candle. Focused, refined, illuminates one thing deeply. Quietly powerful.', ko: '음화(陰火) — 촛불. 집중력과 정교함, 한 가지를 깊이 비춤. 조용한 힘.' },
  '戊': { en: 'Yang Earth — the Mountain. Steady, reliable, hard to move once decided. Foundation for others.', ko: '양토(陽土) — 산. 안정적이고 든든함, 결정하면 흔들리지 않음. 타인의 기반.' },
  '己': { en: 'Yin Earth — the Field. Nurturing, fertile, makes things grow around you. Quietly productive.', ko: '음토(陰土) — 밭. 양육적이고 비옥함, 주변을 자라게 함. 조용한 생산성.' },
  '庚': { en: 'Yang Metal — the Sword. Direct, decisive, cuts through what does not serve. Justice-driven.', ko: '양금(陽金) — 칼. 직접적이고 결단력 있음, 불필요한 것을 잘라냄. 정의 지향.' },
  '辛': { en: 'Yin Metal — the Jewel. Refined, beautiful, attracts admiration. Sensitive to detail.', ko: '음금(陰金) — 보석. 세련되고 아름다워 찬사를 받음. 디테일에 민감.' },
  '壬': { en: 'Yang Water — the Ocean. Vast, ambitious, flows around any obstacle. Sees the long horizon.', ko: '양수(陽水) — 바다. 광활하고 야심 있음, 장애를 둘러 흐름. 장기 시야.' },
  '癸': { en: 'Yin Water — the Rain. Gentle, intuitive, nourishes quietly. Deep emotional intelligence.', ko: '음수(陰水) — 비. 부드럽고 직관적, 조용히 키움. 깊은 감성 지능.' },
};

const ELEMENT_TRAIT = {
  wood: { strong: { en: 'plan and grow continuously, always reaching for what is next', ko: '계속 계획하고 자라며, 항상 다음을 향함' }, weak: { en: 'flexibility and the courage to start fresh', ko: '유연성과 처음부터 시작할 용기' } },
  fire: { strong: { en: 'inspire and lead with visible passion', ko: '드러나는 열정으로 영감과 리딩' }, weak: { en: 'expression and the willingness to be seen', ko: '표현과 드러남에 대한 의지' } },
  earth: { strong: { en: 'build trust and create stable foundations', ko: '신뢰를 쌓고 안정적 기반을 만듦' }, weak: { en: 'patience and the ability to commit long-term', ko: '인내와 장기적 헌신 능력' } },
  metal: { strong: { en: 'cut through complexity with sharp judgment', ko: '복잡함을 날카로운 판단으로 자름' }, weak: { en: 'discipline and the willingness to say no', ko: '절제와 거절할 수 있는 의지' } },
  water: { strong: { en: 'see the deeper currents others miss', ko: '남들이 못 보는 깊은 흐름을 봄' }, weak: { en: 'depth, intuition, and emotional flexibility', ko: '깊이, 직관, 감정의 유연성' } },
};

const TEN_GOD_MEANING = {
  '比肩': { en: 'siblings and peers who share your nature — you find strength in equals', ko: '본질을 공유하는 형제·동료 — 동등한 자에게서 힘을 얻음' },
  '劫財': { en: 'rivals who push you to grow but compete for the same resources', ko: '경쟁자 — 성장을 자극하지만 같은 자원을 두고 다툼' },
  '食神': { en: 'creative output and pleasure — you build through what you naturally enjoy', ko: '창조적 출력과 즐거움 — 자연스럽게 즐기는 것으로 빌드' },
  '傷官': { en: 'rebellion and brilliance — your originality may unsettle institutions', ko: '반항과 천재성 — 너의 독창성이 제도를 흔들 수 있음' },
  '偏財': { en: 'unexpected wealth and many ventures — money flows from multiple sources', ko: '예기치 않은 부와 다수의 시도 — 돈이 여러 곳에서 흐름' },
  '正財': { en: 'steady wealth from focused effort — discipline pays directly', ko: '집중에서 오는 안정적 부 — 절제가 곧 보상' },
  '七殺': { en: 'pressure and challenge — you grow under heat that breaks others', ko: '압박과 도전 — 다른 이를 무너뜨리는 열기에서 너는 자람' },
  '正官': { en: 'authority and structure — you thrive within and shape clear systems', ko: '권위와 구조 — 너는 명확한 시스템 안에서 빛나고 그것을 형성' },
  '偏印': { en: 'unconventional learning — your wisdom comes from unusual sources', ko: '비전형 학습 — 지혜는 흔치 않은 출처에서 옴' },
  '正印': { en: 'mentors, books, and inherited support — you grow through what nourishes you', ko: '스승, 책, 물려받은 지원 — 양분을 통해 자람' },
};

const ELEMENT_DIRECTION = {
  wood: { en: 'starting projects, learning new skills, planting seeds for future seasons', ko: '프로젝트 시작, 새 기술 학습, 미래를 위한 씨앗 심기' },
  fire: { en: 'visible action, networking, sharing what you have built', ko: '드러나는 행동, 네트워킹, 만든 것을 공유' },
  earth: { en: 'consolidating what you have, deepening trust, building durable systems', ko: '가진 것을 다지기, 신뢰 깊이기, 견고한 시스템 빌드' },
  metal: { en: 'pruning, deciding what to drop, sharpening one craft', ko: '가지치기, 버릴 것 결정, 한 가지 기술 연마' },
  water: { en: 'reflection, listening, letting ideas marinate before acting', ko: '성찰, 경청, 아이디어를 숙성시키기 전 행동' },
};

function pickTopGod(saju) {
  const gods = Object.values(saju.tenGods).filter(Boolean);
  if (gods.length === 0) return null;
  // 가장 자주 등장한 god (없으면 첫 번째)
  const counts = {};
  for (const g of gods) counts[g] = (counts[g] || 0) + 1;
  return Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0];
}

function pct(saju) {
  const total = Object.values(saju.elements).reduce((a, b) => a + b, 0) || 1;
  const out = {};
  for (const k of Object.keys(saju.elements)) {
    out[k] = Math.round((saju.elements[k] / total) * 100);
  }
  return out;
}

/**
 * 룰 기반 reading 생성 — LLM 없이.
 * @param {Object} saju - birthInfoToFourPillars() 결과
 * @param {string} lang - 'en' | 'ko'
 * @returns {string} 300~500자 reading
 */
export function generateReading(saju, lang = 'en') {
  const L = ['ko'].includes(lang) ? 'ko' : 'en';

  const dayMaster = saju.dayMaster;
  const dayElement = saju.dayMasterElement;
  const archetype = DAY_MASTER_ARCHETYPE[dayMaster]?.[L] || `${dayMaster} (${dayElement})`;

  const balance = pct(saju);
  const sorted = Object.entries(balance).sort((a, b) => b[1] - a[1]);
  const strongest = sorted[0];
  const weakest = sorted[sorted.length - 1];
  const missing = sorted.filter(([, v]) => v === 0).map(([k]) => k);

  const strongTrait = ELEMENT_TRAIT[strongest[0]].strong[L];
  const weakTrait = ELEMENT_TRAIT[weakest[0]].weak[L];

  const topGod = pickTopGod(saju);
  const godMeaning = topGod ? (TEN_GOD_MEANING[topGod]?.[L] || topGod) : null;

  const direction = ELEMENT_DIRECTION[strongest[0]][L];

  if (L === 'en') {
    let out = `Your Day Master is ${dayMaster} — ${archetype}\n\n`;
    out += `Looking at your Five Elements, ${strongest[0]} dominates at ${strongest[1]}%, while ${weakest[0]} sits at ${weakest[1]}%`;
    if (missing.length > 0) out += ` (${missing.join(' and ')} ${missing.length > 1 ? 'are' : 'is'} entirely missing)`;
    out += `. This means you naturally ${strongTrait}, but the path forward asks for ${weakTrait}.\n\n`;
    if (topGod && godMeaning) {
      out += `Your strongest Ten God is ${topGod} — ${godMeaning}. This shapes how others meet you and how your fortune moves.\n\n`;
    }
    out += `Forward note: this season favors ${direction}. Lean into your ${strongest[0]} nature, but consciously practice the ${weakest[0]} side. The combination is where your real power lives.`;
    return out;
  }

  // Korean
  let out = `당신의 일주(日主)는 ${dayMaster} — ${archetype}\n\n`;
  out += `오행을 보면 ${strongest[0]}이(가) ${strongest[1]}%로 가장 강하고, ${weakest[0]}이(가) ${weakest[1]}%로 약합니다`;
  if (missing.length > 0) out += ` (${missing.join('과 ')}이(가) 완전히 부재)`;
  out += `. 즉 자연스럽게 ${strongTrait}, 그러나 앞으로의 길은 ${weakTrait}을(를) 요구합니다.\n\n`;
  if (topGod && godMeaning) {
    out += `가장 강한 십신은 ${topGod} — ${godMeaning}. 이것이 타인이 당신을 만나는 방식과 운의 흐름을 형성합니다.\n\n`;
  }
  out += `앞으로의 한 마디: 이 시기는 ${direction}에 유리합니다. ${strongest[0]}의 본성에 기대되, ${weakest[0]} 면을 의식적으로 연습하세요. 그 조합 안에 진짜 힘이 있습니다.`;
  return out;
}
