// LLM Saju reading 생성 — system prompt + few-shot examples
//
// Day Master + 5 elements balance + 10 gods → 자연스러운 reading 1500자 (선택 언어)
//
// Master 프롬프트 1개 → 4 언어 출력 (EN/KO/JA/ZH) by language token swap.

const SYSTEM_PROMPT_BASE = `You are an authentic Korean Saju (四柱, Four Pillars of Destiny) master with deep knowledge of:
- 천간(天干) Heavenly Stems: 甲乙丙丁戊己庚辛壬癸
- 지지(地支) Earthly Branches: 子丑寅卯辰巳午未申酉戌亥
- 오행(五行) Five Elements: wood/fire/earth/metal/water
- 십신(十神) Ten Gods relationships
- 대운(大運) 10-year luck cycles

Write a Saju reading in {LANGUAGE} that:
1. Identifies the Day Master (日主) and what kind of person it represents
2. Reads the Five Elements balance — what is strong, weak, missing
3. Names 2~3 most influential Ten Gods and what they mean for personality/fate
4. Gives one specific, actionable insight (career, relationships, or growth)
5. Closes with a one-line forward-looking note

Tone: warm, honest, specific. NOT vague horoscope-speak. NOT Western astrology language.
Length: 600~1200 characters in {LANGUAGE}.
Format: 4 short paragraphs. No bullet lists. No emoji.

Use traditional Saju terminology when meaningful (Day Master, Five Elements, etc.) — these terms are the value, not jargon to avoid.`;

const LANGUAGE_NAMES = {
  en: 'English',
  ko: 'Korean (한국어, 자연스러운 평어로)',
  ja: 'Japanese (日本語、丁寧体で)',
  zh: '中文 (简体, 自然流畅)',
  es: 'Spanish (español natural)',
  pt: 'Portuguese (português natural)',
  fr: 'French (français naturel)',
  de: 'German (natürliches Deutsch)',
  it: 'Italian (italiano naturale)',
  ru: 'Russian (естественный русский)',
  tr: 'Turkish (doğal Türkçe)',
  nl: 'Dutch (natuurlijk Nederlands)',
  pl: 'Polish (naturalny polski)',
  sv: 'Swedish (naturlig svenska)',
  id: 'Indonesian (Bahasa Indonesia yang alami)',
  fil: 'Filipino (natural na Filipino)',
  vi: 'Vietnamese (tiếng Việt tự nhiên)',
  th: 'Thai (ภาษาไทยที่เป็นธรรมชาติ)',
  hi: 'Hindi (स्वाभाविक हिन्दी)',
  ar: 'Arabic (العربية الطبيعية)',
};

/**
 * Master system prompt with language token swap
 */
export function systemPrompt(language) {
  const langName = LANGUAGE_NAMES[language] || LANGUAGE_NAMES.en;
  return SYSTEM_PROMPT_BASE.replaceAll('{LANGUAGE}', langName);
}

/**
 * User message: structured Saju data → reading request
 */
export function userMessage(saju, options = {}) {
  const { language = 'en', readingType = 'general' } = options;
  const balance = saju.elements;
  const total = Object.values(balance).reduce((a, b) => a + b, 0);
  const balancePct = Object.fromEntries(
    Object.entries(balance).map(([k, v]) => [k, Math.round((v / total) * 100)])
  );

  const genderLine = saju.input.gender
    ? `\nGender: ${saju.input.gender}`
    : '';
  const cityLine = saju.input.city
    ? `\nBirth city: ${saju.input.city}`
    : '';

  // ADR-023 깊이 — 지장간·12운성·공망·대운
  const hs = saju.hiddenStems || {};
  const ts = saju.twelveStages || {};
  const hiddenLine = (key) => (hs[key] && hs[key].length) ? ` [hidden: ${hs[key].join('·')}]` : '';
  const stageLine = (key) => ts[key] ? ` [12-stage: ${ts[key]}]` : '';

  const voidLine = saju.voidBranches
    ? `\n\nVoid branches (空亡, from Day pillar ${saju.pillars.day.ganZhi}): ${saju.voidBranches}\n  → branches that lose substance; events touching them often feel incomplete or detached.`
    : '';

  let luckLine = '';
  if (saju.majorLuck && saju.majorLuck.cycles && saju.majorLuck.cycles.length) {
    const upcoming = saju.majorLuck.cycles.slice(0, 6).map(c =>
      `  age ${c.startAge}+ (${c.startYear}+): ${c.ganZhi} [${c.ganElement}/${c.zhiElement}, ten-god: ${c.tenGod || 'N/A'}]`
    ).join('\n');
    luckLine = `\n\nMajor Luck Cycles (大運, 10-year periods, starts age ${saju.majorLuck.cycles[0].startAge}):\n${upcoming}`;
  }

  return `Birth: ${saju.input.year}-${String(saju.input.month).padStart(2, '0')}-${String(saju.input.day).padStart(2, '0')} ${String(saju.input.hour).padStart(2, '0')}:${String(saju.input.minute).padStart(2, '0')}${genderLine}${cityLine}

Four Pillars (sequence: Year / Month / Day / Hour):
- Year: ${saju.pillars.year.ganZhi} (${saju.pillars.year.ganElement} stem · ${saju.pillars.year.zhiElement} branch)${hiddenLine('year')}${stageLine('year')}
- Month: ${saju.pillars.month.ganZhi} (${saju.pillars.month.ganElement} · ${saju.pillars.month.zhiElement})${hiddenLine('month')}${stageLine('month')}
- Day: ${saju.pillars.day.ganZhi} (${saju.pillars.day.ganElement} · ${saju.pillars.day.zhiElement})${hiddenLine('day')}${stageLine('day')} ← Day Master
- Hour: ${saju.pillars.hour.ganZhi} (${saju.pillars.hour.ganElement} · ${saju.pillars.hour.zhiElement})${hiddenLine('hour')}${stageLine('hour')}

Day Master: ${saju.dayMaster} (${saju.dayMasterElement})

Five Elements balance (8 chars total):
- wood ${balance.wood} (${balancePct.wood}%)
- fire ${balance.fire} (${balancePct.fire}%)
- earth ${balance.earth} (${balancePct.earth}%)
- metal ${balance.metal} (${balancePct.metal}%)
- water ${balance.water} (${balancePct.water}%)

Ten Gods (relative to Day Master ${saju.dayMaster}):
- Year stem: ${saju.tenGods.yearGan || 'N/A'}
- Month stem: ${saju.tenGods.monthGan || 'N/A'}
- Hour stem: ${saju.tenGods.hourGan || 'N/A'}${voidLine}${luckLine}

Reading type requested: ${readingType}
Output language: ${language}

Write the Saju reading now. Use the hidden stems, 12 stages, void branches, and major luck cycles when they meaningfully inform the reading — don't enumerate them mechanically, integrate them into the personality·timing·life direction narrative.`;
}

/**
 * Full message array for Claude API call
 */
export function buildClaudeRequest(saju, options = {}) {
  const language = options.language || 'en';
  return {
    system: systemPrompt(language),
    messages: [
      { role: 'user', content: userMessage(saju, options) },
    ],
  };
}
