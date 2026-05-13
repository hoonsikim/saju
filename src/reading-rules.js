// 룰 기반 reading 생성기 — LLM 없이도 작동. EN/KO/JA/ZH/ES/PT 6언어.
// 4 pillars + Day Master + 5 elements + 10 gods → 300~500자 reading.
//
// ADR-014: ES/PT 추가 — 사주 개념 무명 시장 (스페인 500M + 포르투갈/브라질 260M) blue ocean.

const DAY_MASTER_ARCHETYPE = {
  '甲': {
    en: 'Yang Wood — the Tall Tree. Upright, growth-oriented, naturally a leader who breaks new ground.',
    ko: '양목(陽木) — 큰 나무. 곧고 성장 지향적, 자연스럽게 새 길을 여는 리더형.',
    ja: '陽木 — 大樹。まっすぐで成長志向、自然と新しい道を切り開くリーダー型。',
    zh: '阳木 — 大树。正直、追求成长，天然的开拓型领导者。',
    es: 'Madera Yang — el Árbol Alto. Recto, orientado al crecimiento, naturalmente un líder que abre caminos nuevos.',
    pt: 'Madeira Yang — a Árvore Alta. Reto, voltado ao crescimento, naturalmente um líder que abre novos caminhos.',
  },
  '乙': {
    en: 'Yin Wood — the Vine. Adaptive, persistent, finds light in any crack. Quietly unstoppable.',
    ko: '음목(陰木) — 덩굴. 유연하고 끈질김, 어떤 틈에서도 빛을 찾음. 조용히 멈출 수 없는 힘.',
    ja: '陰木 — 蔓。柔軟で粘り強く、どんな隙間にも光を見つける。静かに止まらない力。',
    zh: '阴木 — 藤蔓。柔韧而坚持，从任何缝隙中找到光。静默而无法阻挡。',
    es: 'Madera Yin — la Enredadera. Adaptable, persistente, encuentra luz en cualquier grieta. Imparable en silencio.',
    pt: 'Madeira Yin — a Trepadeira. Adaptável, persistente, encontra luz em qualquer fresta. Silenciosamente imparável.',
  },
  '丙': {
    en: 'Yang Fire — the Sun. Bright, generous, warms everyone around you. Charisma is your default.',
    ko: '양화(陽火) — 태양. 밝고 너그러우며 주변을 따뜻하게. 카리스마가 기본.',
    ja: '陽火 — 太陽。明るく寛大で、周囲を温める。カリスマが基本。',
    zh: '阳火 — 太阳。明亮慷慨，温暖周围。魅力是默认。',
    es: 'Fuego Yang — el Sol. Brillante, generoso, calienta a todos a tu alrededor. El carisma es tu default.',
    pt: 'Fogo Yang — o Sol. Brilhante, generoso, aquece todos ao seu redor. Carisma é o seu padrão.',
  },
  '丁': {
    en: 'Yin Fire — the Candle. Focused, refined, illuminates one thing deeply. Quietly powerful.',
    ko: '음화(陰火) — 촛불. 집중력과 정교함, 한 가지를 깊이 비춤. 조용한 힘.',
    ja: '陰火 — 蝋燭。集中と精緻、一つを深く照らす。静かな力。',
    zh: '阴火 — 蜡烛。专注精细，深照一物。静谧而强大。',
    es: 'Fuego Yin — la Vela. Enfocado, refinado, ilumina una cosa profundamente. Poderoso en silencio.',
    pt: 'Fogo Yin — a Vela. Focado, refinado, ilumina uma coisa profundamente. Silenciosamente poderoso.',
  },
  '戊': {
    en: 'Yang Earth — the Mountain. Steady, reliable, hard to move once decided. Foundation for others.',
    ko: '양토(陽土) — 산. 안정적이고 든든함, 결정하면 흔들리지 않음. 타인의 기반.',
    ja: '陽土 — 山。安定して頼もしく、決めたら揺るがない。他者の基盤。',
    zh: '阳土 — 山。稳健可靠，一旦决定难以动摇。他人的根基。',
    es: 'Tierra Yang — la Montaña. Firme, confiable, difícil de mover una vez decidido. Cimiento para otros.',
    pt: 'Terra Yang — a Montanha. Firme, confiável, difícil de mover depois de decidir. Alicerce para os outros.',
  },
  '己': {
    en: 'Yin Earth — the Field. Nurturing, fertile, makes things grow around you. Quietly productive.',
    ko: '음토(陰土) — 밭. 양육적이고 비옥함, 주변을 자라게 함. 조용한 생산성.',
    ja: '陰土 — 畑。育成的で肥沃、周りを育てる。静かな生産性。',
    zh: '阴土 — 田地。培育肥沃，让周围生长。静默高产。',
    es: 'Tierra Yin — el Campo. Nutridor, fértil, hace crecer lo que está a tu alrededor. Productivo en silencio.',
    pt: 'Terra Yin — o Campo. Nutritivo, fértil, faz crescer o que está ao seu redor. Silenciosamente produtivo.',
  },
  '庚': {
    en: 'Yang Metal — the Sword. Direct, decisive, cuts through what does not serve. Justice-driven.',
    ko: '양금(陽金) — 칼. 직접적이고 결단력 있음, 불필요한 것을 잘라냄. 정의 지향.',
    ja: '陽金 — 剣。直接で決断力があり、不要なものを切り捨てる。正義志向。',
    zh: '阳金 — 剑。直接果断，斩除无用。正义驱动。',
    es: 'Metal Yang — la Espada. Directo, decidido, corta lo que no sirve. Movido por la justicia.',
    pt: 'Metal Yang — a Espada. Direto, decidido, corta o que não serve. Movido pela justiça.',
  },
  '辛': {
    en: 'Yin Metal — the Jewel. Refined, beautiful, attracts admiration. Sensitive to detail.',
    ko: '음금(陰金) — 보석. 세련되고 아름다워 찬사를 받음. 디테일에 민감.',
    ja: '陰金 — 宝石。洗練されて美しく、賞賛を集める。細部に敏感。',
    zh: '阴金 — 珠玉。精致美丽，引人赞叹。对细节敏感。',
    es: 'Metal Yin — la Joya. Refinado, hermoso, atrae admiración. Sensible al detalle.',
    pt: 'Metal Yin — a Joia. Refinado, belo, atrai admiração. Sensível ao detalhe.',
  },
  '壬': {
    en: 'Yang Water — the Ocean. Vast, ambitious, flows around any obstacle. Sees the long horizon.',
    ko: '양수(陽水) — 바다. 광활하고 야심 있음, 장애를 둘러 흐름. 장기 시야.',
    ja: '陽水 — 海。広大で野心的、障害を回って流れる。長期視野。',
    zh: '阳水 — 海洋。辽阔有志，绕过任何障碍。看长远地平。',
    es: 'Agua Yang — el Océano. Vasto, ambicioso, fluye alrededor de cualquier obstáculo. Ve el horizonte lejano.',
    pt: 'Água Yang — o Oceano. Vasto, ambicioso, flui em torno de qualquer obstáculo. Vê o horizonte distante.',
  },
  '癸': {
    en: 'Yin Water — the Rain. Gentle, intuitive, nourishes quietly. Deep emotional intelligence.',
    ko: '음수(陰水) — 비. 부드럽고 직관적, 조용히 키움. 깊은 감성 지능.',
    ja: '陰水 — 雨。優しく直感的、静かに育む。深い感情知性。',
    zh: '阴水 — 雨。温柔直觉，悄然滋养。深刻的情感智慧。',
    es: 'Agua Yin — la Lluvia. Suave, intuitivo, nutre en silencio. Profunda inteligencia emocional.',
    pt: 'Água Yin — a Chuva. Suave, intuitivo, nutre em silêncio. Profunda inteligência emocional.',
  },
};

const ELEMENT_TRAIT = {
  wood: {
    strong: {
      en: 'plan and grow continuously, always reaching for what is next',
      ko: '계속 계획하고 자라며, 항상 다음을 향함',
      ja: '計画し続け成長し、常に次を目指す',
      zh: '不断规划成长，永远向前',
      es: 'planificas y creces continuamente, siempre alcanzando lo que sigue',
      pt: 'planeja e cresce continuamente, sempre buscando o próximo passo',
    },
    weak: {
      en: 'flexibility and the courage to start fresh',
      ko: '유연성과 처음부터 시작할 용기',
      ja: '柔軟性と新しく始める勇気',
      zh: '柔韧与重新开始的勇气',
      es: 'flexibilidad y el coraje de comenzar de nuevo',
      pt: 'flexibilidade e a coragem de começar de novo',
    },
  },
  fire: {
    strong: {
      en: 'inspire and lead with visible passion',
      ko: '드러나는 열정으로 영감과 리딩',
      ja: '見える情熱で導きインスパイア',
      zh: '以可见的热情引领与激励',
      es: 'inspiras y guías con pasión visible',
      pt: 'inspira e lidera com paixão visível',
    },
    weak: {
      en: 'expression and the willingness to be seen',
      ko: '표현과 드러남에 대한 의지',
      ja: '表現と見られる意志',
      zh: '表达与被看见的意愿',
      es: 'expresión y la disposición a ser visto',
      pt: 'expressão e a disposição de ser visto',
    },
  },
  earth: {
    strong: {
      en: 'build trust and create stable foundations',
      ko: '신뢰를 쌓고 안정적 기반을 만듦',
      ja: '信頼を築き安定した基盤を作る',
      zh: '建立信任和稳定的基础',
      es: 'construyes confianza y creas bases estables',
      pt: 'constrói confiança e cria bases estáveis',
    },
    weak: {
      en: 'patience and the ability to commit long-term',
      ko: '인내와 장기적 헌신 능력',
      ja: '忍耐と長期的コミット力',
      zh: '耐心和长期承诺',
      es: 'paciencia y la capacidad de comprometerse a largo plazo',
      pt: 'paciência e a capacidade de se comprometer a longo prazo',
    },
  },
  metal: {
    strong: {
      en: 'cut through complexity with sharp judgment',
      ko: '복잡함을 날카로운 판단으로 자름',
      ja: '鋭い判断で複雑を断つ',
      zh: '用敏锐判断穿透复杂',
      es: 'cortas la complejidad con juicio agudo',
      pt: 'corta a complexidade com julgamento agudo',
    },
    weak: {
      en: 'discipline and the willingness to say no',
      ko: '절제와 거절할 수 있는 의지',
      ja: '規律と「いいえ」と言う意志',
      zh: '自律和拒绝的勇气',
      es: 'disciplina y la disposición de decir no',
      pt: 'disciplina e a disposição de dizer não',
    },
  },
  water: {
    strong: {
      en: 'see the deeper currents others miss',
      ko: '남들이 못 보는 깊은 흐름을 봄',
      ja: '他者が見ない深い流れを見る',
      zh: '看见他人忽略的深层潮流',
      es: 'ves las corrientes profundas que otros pierden',
      pt: 'vê as correntes profundas que outros não veem',
    },
    weak: {
      en: 'depth, intuition, and emotional flexibility',
      ko: '깊이, 직관, 감정의 유연성',
      ja: '深さ、直感、感情の柔軟性',
      zh: '深度、直觉与情感的柔韧',
      es: 'profundidad, intuición y flexibilidad emocional',
      pt: 'profundidade, intuição e flexibilidade emocional',
    },
  },
};

const TEN_GOD_MEANING = {
  '比肩': {
    en: 'siblings and peers who share your nature — you find strength in equals',
    ko: '본질을 공유하는 형제·동료 — 동등한 자에게서 힘을 얻음',
    ja: '本質を共有する兄弟・仲間 — 対等な者から力を得る',
    zh: '同质的兄弟同伴 — 在平等者中获得力量',
    es: 'hermanos y pares que comparten tu naturaleza — encuentras fuerza en los iguales',
    pt: 'irmãos e pares que compartilham sua natureza — você encontra força em iguais',
  },
  '劫財': {
    en: 'rivals who push you to grow but compete for the same resources',
    ko: '경쟁자 — 성장을 자극하지만 같은 자원을 두고 다툼',
    ja: 'ライバル — 成長を促すが同じ資源を奪い合う',
    zh: '对手 — 推动成长但争夺同样资源',
    es: 'rivales que te empujan a crecer pero compiten por los mismos recursos',
    pt: 'rivais que o impulsionam a crescer mas competem pelos mesmos recursos',
  },
  '食神': {
    en: 'creative output and pleasure — you build through what you naturally enjoy',
    ko: '창조적 출력과 즐거움 — 자연스럽게 즐기는 것으로 빌드',
    ja: '創造的アウトプットと喜び — 自然に楽しむものから築く',
    zh: '创造性输出与喜悦 — 通过自然喜欢的事物建造',
    es: 'producción creativa y placer — construyes a través de lo que disfrutas naturalmente',
    pt: 'produção criativa e prazer — você constrói através do que naturalmente desfruta',
  },
  '傷官': {
    en: 'rebellion and brilliance — your originality may unsettle institutions',
    ko: '반항과 천재성 — 너의 독창성이 제도를 흔들 수 있음',
    ja: '反抗と天才性 — あなたの独創性は制度を揺るがす',
    zh: '叛逆与才华 — 你的原创性可能撼动制度',
    es: 'rebeldía y brillantez — tu originalidad puede sacudir instituciones',
    pt: 'rebeldia e brilhantismo — sua originalidade pode abalar instituições',
  },
  '偏財': {
    en: 'unexpected wealth and many ventures — money flows from multiple sources',
    ko: '예기치 않은 부와 다수의 시도 — 돈이 여러 곳에서 흐름',
    ja: '思いがけぬ富と多くの試み — お金が複数の源から流れる',
    zh: '意外之财与多元尝试 — 钱财从多处流来',
    es: 'riqueza inesperada y muchas aventuras — el dinero fluye desde múltiples fuentes',
    pt: 'riqueza inesperada e muitos empreendimentos — dinheiro flui de várias fontes',
  },
  '正財': {
    en: 'steady wealth from focused effort — discipline pays directly',
    ko: '집중에서 오는 안정적 부 — 절제가 곧 보상',
    ja: '集中から得る安定の富 — 規律がそのまま報酬',
    zh: '专注带来的稳定财富 — 自律直接回报',
    es: 'riqueza estable del esfuerzo enfocado — la disciplina paga directamente',
    pt: 'riqueza estável do esforço focado — a disciplina paga diretamente',
  },
  '七殺': {
    en: 'pressure and challenge — you grow under heat that breaks others',
    ko: '압박과 도전 — 다른 이를 무너뜨리는 열기에서 너는 자람',
    ja: '圧力と挑戦 — 他者を砕く熱の中であなたは育つ',
    zh: '压力与挑战 — 在击垮他人的高温中你反而成长',
    es: 'presión y desafío — creces bajo el calor que rompe a otros',
    pt: 'pressão e desafio — você cresce sob o calor que quebra os outros',
  },
  '正官': {
    en: 'authority and structure — you thrive within and shape clear systems',
    ko: '권위와 구조 — 너는 명확한 시스템 안에서 빛나고 그것을 형성',
    ja: '権威と構造 — 明確なシステムの中で輝き、形作る',
    zh: '权威与架构 — 你在清晰的系统中蓬勃并塑造它',
    es: 'autoridad y estructura — prosperas dentro y das forma a sistemas claros',
    pt: 'autoridade e estrutura — você prospera dentro e molda sistemas claros',
  },
  '偏印': {
    en: 'unconventional learning — your wisdom comes from unusual sources',
    ko: '비전형 학습 — 지혜는 흔치 않은 출처에서 옴',
    ja: '非典型な学び — 知恵は珍しい源から',
    zh: '非传统学习 — 智慧来自不寻常的来源',
    es: 'aprendizaje no convencional — tu sabiduría viene de fuentes inusuales',
    pt: 'aprendizado não convencional — sua sabedoria vem de fontes incomuns',
  },
  '正印': {
    en: 'mentors, books, and inherited support — you grow through what nourishes you',
    ko: '스승, 책, 물려받은 지원 — 양분을 통해 자람',
    ja: '師・書物・受け継がれた支援 — 養分を通して育つ',
    zh: '师长、典籍、传承支持 — 通过滋养而成长',
    es: 'mentores, libros y apoyo heredado — creces a través de lo que te nutre',
    pt: 'mentores, livros e apoio herdado — você cresce através do que te nutre',
  },
};

const ELEMENT_DIRECTION = {
  wood: {
    en: 'starting projects, learning new skills, planting seeds for future seasons',
    ko: '프로젝트 시작, 새 기술 학습, 미래를 위한 씨앗 심기',
    ja: 'プロジェクトの開始、新スキル習得、未来の季節への種まき',
    zh: '启动项目、学习新技能、为未来播种',
    es: 'iniciar proyectos, aprender nuevas habilidades, plantar semillas para futuras estaciones',
    pt: 'iniciar projetos, aprender novas habilidades, plantar sementes para estações futuras',
  },
  fire: {
    en: 'visible action, networking, sharing what you have built',
    ko: '드러나는 행동, 네트워킹, 만든 것을 공유',
    ja: '見える行動、ネットワーキング、築いたものの共有',
    zh: '可见的行动、社交、分享所建成果',
    es: 'acción visible, conectar con otros, compartir lo que has construido',
    pt: 'ação visível, conectar-se com outros, compartilhar o que você construiu',
  },
  earth: {
    en: 'consolidating what you have, deepening trust, building durable systems',
    ko: '가진 것을 다지기, 신뢰 깊이기, 견고한 시스템 빌드',
    ja: '持つものを固める、信頼を深める、堅牢なシステム構築',
    zh: '巩固已有、深化信任、构筑持久系统',
    es: 'consolidar lo que tienes, profundizar la confianza, construir sistemas duraderos',
    pt: 'consolidar o que você tem, aprofundar a confiança, construir sistemas duradouros',
  },
  metal: {
    en: 'pruning, deciding what to drop, sharpening one craft',
    ko: '가지치기, 버릴 것 결정, 한 가지 기술 연마',
    ja: '剪定、捨てる決断、一つの技を磨く',
    zh: '修剪、决定舍弃、专精一项技艺',
    es: 'podar, decidir qué soltar, afinar un oficio',
    pt: 'podar, decidir o que descartar, aperfeiçoar um ofício',
  },
  water: {
    en: 'reflection, listening, letting ideas marinate before acting',
    ko: '성찰, 경청, 아이디어를 숙성시키기 전 행동',
    ja: '内省、傾聴、行動前のアイデア熟成',
    zh: '反思、倾听、行动前让想法发酵',
    es: 'reflexión, escuchar, dejar madurar las ideas antes de actuar',
    pt: 'reflexão, escutar, deixar as ideias amadurecerem antes de agir',
  },
};

const ELEMENT_LOCAL = {
  en: { wood: 'wood', fire: 'fire', earth: 'earth', metal: 'metal', water: 'water' },
  ko: { wood: '목', fire: '화', earth: '토', metal: '금', water: '수' },
  ja: { wood: '木', fire: '火', earth: '土', metal: '金', water: '水' },
  zh: { wood: '木', fire: '火', earth: '土', metal: '金', water: '水' },
  es: { wood: 'madera', fire: 'fuego', earth: 'tierra', metal: 'metal', water: 'agua' },
  pt: { wood: 'madeira', fire: 'fogo', earth: 'terra', metal: 'metal', water: 'água' },
};

const MISSING_JOIN = { en: ' and ', ko: '과 ', ja: 'と', zh: '和', es: ' y ', pt: ' e ' };

const SUPPORTED = new Set(['en', 'ko', 'ja', 'zh', 'es', 'pt']);

function pickTopGod(saju) {
  const gods = Object.values(saju.tenGods).filter(Boolean);
  if (gods.length === 0) return null;
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
 * @param {string} lang - 'en' | 'ko' | 'ja' | 'zh' | 'es' | 'pt'
 * @returns {string} 300~500자 reading
 */
export function generateReading(saju, lang = 'en') {
  const L = SUPPORTED.has(lang) ? lang : 'en';
  const E = ELEMENT_LOCAL[L];

  const dayMaster = saju.dayMaster;
  const dayElement = saju.dayMasterElement;
  const archetype = DAY_MASTER_ARCHETYPE[dayMaster]?.[L] || `${dayMaster} (${dayElement})`;

  const balance = pct(saju);
  const sorted = Object.entries(balance).sort((a, b) => b[1] - a[1]);
  const strongest = sorted[0];
  const weakest = sorted[sorted.length - 1];
  const missingKeys = sorted.filter(([, v]) => v === 0).map(([k]) => k);
  const missing = missingKeys.map(k => E[k]).join(MISSING_JOIN[L]);

  const strongTrait = ELEMENT_TRAIT[strongest[0]].strong[L];
  const weakTrait = ELEMENT_TRAIT[weakest[0]].weak[L];

  const topGod = pickTopGod(saju);
  const godMeaning = topGod ? (TEN_GOD_MEANING[topGod]?.[L] || topGod) : null;

  const direction = ELEMENT_DIRECTION[strongest[0]][L];
  const strongName = E[strongest[0]];
  const weakName = E[weakest[0]];

  if (L === 'en') {
    let out = `Your Day Master is ${dayMaster} — ${archetype}\n\n`;
    out += `Looking at your Five Elements, ${strongName} dominates at ${strongest[1]}%, while ${weakName} sits at ${weakest[1]}%`;
    if (missingKeys.length > 0) out += ` (${missing} ${missingKeys.length > 1 ? 'are' : 'is'} entirely missing)`;
    out += `. This means you naturally ${strongTrait}, but the path forward asks for ${weakTrait}.\n\n`;
    if (topGod && godMeaning) {
      out += `Your strongest Ten God is ${topGod} — ${godMeaning}. This shapes how others meet you and how your fortune moves.\n\n`;
    }
    out += `Forward note: this season favors ${direction}. Lean into your ${strongName} nature, but consciously practice the ${weakName} side. The combination is where your real power lives.`;
    return out;
  }

  if (L === 'ko') {
    let out = `당신의 일주(日主)는 ${dayMaster} — ${archetype}\n\n`;
    out += `오행을 보면 ${strongName}이(가) ${strongest[1]}%로 가장 강하고, ${weakName}이(가) ${weakest[1]}%로 약합니다`;
    if (missingKeys.length > 0) out += ` (${missing}이(가) 완전히 부재)`;
    out += `. 즉 자연스럽게 ${strongTrait}, 그러나 앞으로의 길은 ${weakTrait}을(를) 요구합니다.\n\n`;
    if (topGod && godMeaning) {
      out += `가장 강한 십신은 ${topGod} — ${godMeaning}. 이것이 타인이 당신을 만나는 방식과 운의 흐름을 형성합니다.\n\n`;
    }
    out += `앞으로의 한 마디: 이 시기는 ${direction}에 유리합니다. ${strongName}의 본성에 기대되, ${weakName} 면을 의식적으로 연습하세요. 그 조합 안에 진짜 힘이 있습니다.`;
    return out;
  }

  if (L === 'ja') {
    let out = `あなたの日主は ${dayMaster} — ${archetype}\n\n`;
    out += `五行を見ると、${strongName}が${strongest[1]}%で最も強く、${weakName}が${weakest[1]}%で弱いです`;
    if (missingKeys.length > 0) out += ` (${missing}が完全に不在)`;
    out += `。つまり自然に${strongTrait}ですが、これから進む道は${weakTrait}を求めます。\n\n`;
    if (topGod && godMeaning) {
      out += `最も強い十神は${topGod} — ${godMeaning}。これが他者があなたと出会う仕方と運の流れを形作ります。\n\n`;
    }
    out += `これからの一言: この時期は${direction}に有利です。${strongName}の本性に頼りつつ、${weakName}の側を意識的に練習してください。その組み合わせの中に真の力があります。`;
    return out;
  }

  if (L === 'zh') {
    let out = `你的日主是 ${dayMaster} — ${archetype}\n\n`;
    out += `观察五行,${strongName}最强为${strongest[1]}%,${weakName}最弱为${weakest[1]}%`;
    if (missingKeys.length > 0) out += `(${missing}完全缺失)`;
    out += `。这意味着你天然${strongTrait},而前路要求${weakTrait}。\n\n`;
    if (topGod && godMeaning) {
      out += `最强的十神是${topGod} — ${godMeaning}。这塑造了他人遇见你的方式以及运势的流向。\n\n`;
    }
    out += `前路一句: 此时机有利于${direction}。倚仗${strongName}的本性,同时刻意练习${weakName}的一面。两者的结合处,才是真正的力量所在。`;
    return out;
  }

  if (L === 'es') {
    let out = `Tu Maestro del Día es ${dayMaster} — ${archetype}\n\n`;
    out += `Mirando tus Cinco Elementos, ${strongName} domina con ${strongest[1]}%, mientras ${weakName} está en ${weakest[1]}%`;
    if (missingKeys.length > 0) out += ` (${missing} ${missingKeys.length > 1 ? 'están' : 'está'} completamente ausente${missingKeys.length > 1 ? 's' : ''})`;
    out += `. Esto significa que naturalmente ${strongTrait}, pero el camino por delante pide ${weakTrait}.\n\n`;
    if (topGod && godMeaning) {
      out += `Tu Dios más fuerte de los Diez es ${topGod} — ${godMeaning}. Esto da forma a cómo otros te encuentran y cómo se mueve tu fortuna.\n\n`;
    }
    out += `Nota hacia adelante: esta temporada favorece ${direction}. Apóyate en tu naturaleza de ${strongName}, pero practica conscientemente el lado de ${weakName}. La combinación es donde vive tu verdadero poder.`;
    return out;
  }

  // pt
  let out = `Seu Mestre do Dia é ${dayMaster} — ${archetype}\n\n`;
  out += `Olhando os seus Cinco Elementos, ${strongName} domina com ${strongest[1]}%, enquanto ${weakName} fica em ${weakest[1]}%`;
  if (missingKeys.length > 0) out += ` (${missing} ${missingKeys.length > 1 ? 'estão' : 'está'} completamente ausente${missingKeys.length > 1 ? 's' : ''})`;
  out += `. Isso significa que você naturalmente ${strongTrait}, mas o caminho à frente pede ${weakTrait}.\n\n`;
  if (topGod && godMeaning) {
    out += `Seu Deus mais forte dos Dez é ${topGod} — ${godMeaning}. Isso molda como os outros encontram você e como sua fortuna se move.\n\n`;
  }
  out += `Nota para o futuro: esta temporada favorece ${direction}. Apoie-se na sua natureza de ${strongName}, mas pratique conscientemente o lado de ${weakName}. A combinação é onde vive o seu verdadeiro poder.`;
  return out;
}
