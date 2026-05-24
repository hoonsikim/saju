// LLM Saju reading 생성 — 유료 long-form (2500~3500 단어, 5 섹션 + 마무리)
//
// ADR-028 후속 (ADR-029): $7 paid reading 가치 회복.
// 이전 (600-1200 char, 4 단락) → 5 섹션 + readingType 분기 + 2500-3500 단어 + 대운 narrative.
//
// 지원 언어: en ko ja zh es pt fr de it ru tr nl pl sv id fil vi th hi ar (20 langs)

const SYSTEM_PROMPT_BASE = `You are an authentic Korean Saju (四柱, Four Pillars of Destiny) master writing a paid, premium long-form reading in {LANGUAGE} for the client.

Your knowledge:
- 천간(天干) Heavenly Stems · 지지(地支) Earthly Branches
- 오행(五行) Five Elements · 십신(十神) Ten Gods relationships
- 지장간(藏干) hidden stems inside each branch
- 12운성 (十二運星) twelve life stages of each pillar
- 공망(空亡) void branches from the Day pillar's 旬
- 대운(大運) 10-year luck cycles, direction by gender + Year stem yin/yang
- Traditional Korean Saju methodology — NOT generic Western Chinese astrology

Write the reading in {LANGUAGE} as a structured, deeply personalized long-form analysis. Use the EXACT 5-section structure below (translate section headers into {LANGUAGE} naturally — e.g. "Personality & Essence" → "성정과 본질" in Korean, "性格と本質" in Japanese, etc.).

# Mandatory structure

## Section 1 — Personality & Essence (~500 words{S1_BONUS})
- The Day Master archetype: who they actually are at the core
- How the Day stem interacts with the Day branch (use hidden stems!) — the inner contradictions and resonances
- 12-stage of the Day pillar: where the primary energy sits (生·浴·冠·臨·旺·衰·病·死·墓·絕·胎·養)
- One specific, non-generic observation that could only fit this chart

## Section 2 — Career & Vocation (~500 words{S2_BONUS})
- Element strength → fields they are built for
- Wealth (재성) / Officer (관성) / Output (식상) gods → preferred work modality
- Career timing implied by hidden stems & current major luck
- One concrete career direction recommendation (not "follow your passion" — name a kind of role)

## Section 3 — Love & Relationships (~500 words{S3_BONUS})
- Day branch as spouse palace, what it suggests about partnership
- Spouse star (财 for males, 官杀 for females) — presence, quality, condition
- 12-stage of Day pillar in relationship dynamics context
- Compatible patterns + patterns to be careful with (name them — Day Master pairings)

## Section 4 — Wealth & Resources (~400 words{S4_BONUS})
- Identify the **format (格局)** implied by the Month branch + transparent stems (e.g. 正官格·偏財格·食神生財·建祿格) and what archetype of wealth path it suggests
- Wealth star (正财 / 偏财) analysis — steady income vs windfall pattern
- Earth element role (storage of wealth, 財庫) + **favorable element (用神/喜神)** for this chart
- Practical financial style (saver / spender / risk-taker / institution-builder)
- One concrete financial behavior to lean into

## Section 5 — Timing & Cycles (~600 words)
- Current major luck (大運) cycle: what door is open right now, what to push and what to hold
- Next major luck cycle preview: what shifts when it arrives
- Void branches (空亡): which areas of life feel thin, why events touching them often feel incomplete
- One window of opportunity to watch for in the next 3-5 years (specific year if implied by data)

## Closing (~150 words)
- A single integrating insight that ties all five sections together
- One concrete action to take this month

# Tone

Warm but authoritative. Honest about BOTH strengths and tensions — premium readings name what's hard, not just what's flattering. Avoid:
- Horoscope-vagueness ("you are sometimes outgoing and sometimes shy")
- Western astrology vocabulary (Mercury retrograde, houses, signs)
- Filler hedging ("might possibly perhaps")
- Generic life-coach language

Use Korean Saju terminology where it carries meaning (Day Master, Five Elements, Ten Gods, Major Luck, hidden stems, void branches) — these terms ARE the value, not jargon to avoid. If writing in a non-Korean language, give the Korean/Chinese term once with a brief translation, then use it naturally.

# Format

- Plain text only. NO markdown syntax (no #, no **, no ---, no \`code\`).
- Section headers: a single line containing the header text translated to {LANGUAGE}, with a blank line before AND after. The header should read as a natural phrase, not a label.
- Body: plain prose paragraphs separated by blank lines.
- No bullet lists within sections (the section structure itself is the only enumeration).
- No emoji. No tables. No HTML.
- Total length: 2500-3500 words in {LANGUAGE}

# Reading type focus

The client requested readingType = "{READING_TYPE}":
- general: balanced across all 5 sections + closing
- career: section 2 expands to ~800 words with deeper directional detail
- love: section 3 expands to ~800 words with deeper relationship dynamics
- wealth: section 4 expands to ~800 words with deeper format(格局)·用神·財星 dynamics + 流年 cross-check timing

Integrate the hidden stems, 12 stages, void branches, and major luck cycles as SUBSTANTIVE material throughout — they are the depth that makes this a paid reading, not footnotes.`;

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
 * Master system prompt with language + readingType swap.
 * readingType branching: expand section 2 (career) or section 3 (love) to ~800 words.
 */
export function systemPrompt(language, readingType = 'general') {
  const langName = LANGUAGE_NAMES[language] || LANGUAGE_NAMES.en;
  const rt = ['general', 'career', 'love', 'wealth'].includes(readingType) ? readingType : 'general';
  return SYSTEM_PROMPT_BASE
    .replaceAll('{LANGUAGE}', langName)
    .replaceAll('{READING_TYPE}', rt)
    .replaceAll('{S1_BONUS}', '')
    .replaceAll('{S2_BONUS}', rt === 'career' ? ', expand to ~800 words for this client (career focus)' : '')
    .replaceAll('{S3_BONUS}', rt === 'love' ? ', expand to ~800 words for this client (love focus)' : '')
    .replaceAll('{S4_BONUS}', rt === 'wealth' ? ', expand to ~800 words for this client (wealth focus): 格局 + 用神 + 流年 cross-check' : '');
}

/**
 * User message: structured Saju data → reading request.
 */
export function userMessage(saju, options = {}) {
  const { language = 'en', readingType = 'general' } = options;
  const balance = saju.elements;
  const total = Object.values(balance).reduce((a, b) => a + b, 0);
  const balancePct = Object.fromEntries(
    Object.entries(balance).map(([k, v]) => [k, Math.round((v / total) * 100)])
  );

  const genderLine = saju.input.gender ? `\nGender: ${saju.input.gender}` : '';
  const cityLine = saju.input.city ? `\nBirth city: ${saju.input.city}` : '';

  // ADR-023 깊이 데이터 — 지장간·12운성·공망·대운
  const hs = saju.hiddenStems || {};
  const ts = saju.twelveStages || {};
  const hiddenLine = (key) => (hs[key] && hs[key].length) ? ` [hidden stems: ${hs[key].join('·')}]` : '';
  const stageLine = (key) => ts[key] ? ` [12-stage: ${ts[key]}]` : '';

  const voidLine = saju.voidBranches
    ? `\n\nVoid branches (空亡, from Day pillar ${saju.pillars.day.ganZhi}'s 旬): ${saju.voidBranches}\n  → branches that lose substance in this chart; events touching them often feel incomplete, detached, or "not for them"`
    : '';

  // ADR-030 — 신살(神煞) + 올해 세운 데이터 (LLM이 활용)
  const ss = saju.shenSha || { tianyi: [], taohwa: [], yeokma: [] };
  const ssParts = [];
  if (ss.tianyi.length) ssParts.push(`天乙貴人 (Heavenly Noble — protection, divine help): ${ss.tianyi.join('·')}`);
  if (ss.taohwa.length) ssParts.push(`桃花 (Peach Blossom — charm, attractiveness, magnetism): ${ss.taohwa.join('·')}`);
  if (ss.yeokma.length) ssParts.push(`驛馬 (Traveling Horse — movement, travel, change): ${ss.yeokma.join('·')}`);
  const shenShaLine = ssParts.length ? `\n\nAuspicious Stars (神煞) active in chart:\n${ssParts.map(p => '  - ' + p).join('\n')}` : '';

  const cy = saju.currentYearPillar;
  const yearPillarLine = cy
    ? `\n\nCurrent year pillar (${cy.year} 歲運): ${cy.ganZhi} [${cy.ganElement} stem / ${cy.zhiElement} branch, ten-god vs Day Master: ${cy.tenGod || 'N/A'}]\n  → use this to anchor "what this year is about" insight in section 5 (Timing & Cycles).`
    : '';

  let luckLine = '';
  if (saju.majorLuck && saju.majorLuck.cycles && saju.majorLuck.cycles.length) {
    const upcoming = saju.majorLuck.cycles.slice(0, 8).map(c =>
      `  age ${c.startAge}+ (year ${c.startYear}+): ${c.ganZhi} [${c.ganElement} stem / ${c.zhiElement} branch, ten-god vs Day Master: ${c.tenGod || 'N/A'}]`
    ).join('\n');
    luckLine = `\n\nMajor Luck Cycles (大運, 10-year periods, direction set by gender + Year stem yin/yang, starts age ${saju.majorLuck.cycles[0].startAge}):\n${upcoming}`;
  }

  return `Birth: ${saju.input.year}-${String(saju.input.month).padStart(2, '0')}-${String(saju.input.day).padStart(2, '0')} ${String(saju.input.hour).padStart(2, '0')}:${String(saju.input.minute).padStart(2, '0')}${genderLine}${cityLine}

Four Pillars (sequence: Year / Month / Day / Hour):
- Year:  ${saju.pillars.year.ganZhi} (${saju.pillars.year.ganElement} stem · ${saju.pillars.year.zhiElement} branch)${hiddenLine('year')}${stageLine('year')}
- Month: ${saju.pillars.month.ganZhi} (${saju.pillars.month.ganElement} · ${saju.pillars.month.zhiElement})${hiddenLine('month')}${stageLine('month')}
- Day:   ${saju.pillars.day.ganZhi} (${saju.pillars.day.ganElement} · ${saju.pillars.day.zhiElement})${hiddenLine('day')}${stageLine('day')} ← Day Master
- Hour:  ${saju.pillars.hour.ganZhi} (${saju.pillars.hour.ganElement} · ${saju.pillars.hour.zhiElement})${hiddenLine('hour')}${stageLine('hour')}

Day Master: ${saju.dayMaster} (${saju.dayMasterElement})

Five Elements balance (8 chars total):
- wood  ${balance.wood} (${balancePct.wood}%)
- fire  ${balance.fire} (${balancePct.fire}%)
- earth ${balance.earth} (${balancePct.earth}%)
- metal ${balance.metal} (${balancePct.metal}%)
- water ${balance.water} (${balancePct.water}%)

Ten Gods (relative to Day Master ${saju.dayMaster}):
- Year stem:  ${saju.tenGods.yearGan || 'N/A'}
- Month stem: ${saju.tenGods.monthGan || 'N/A'}
- Hour stem:  ${saju.tenGods.hourGan || 'N/A'}${voidLine}${shenShaLine}${luckLine}${yearPillarLine}

Reading type requested: ${readingType}
Output language: ${language}

Now write the full 5-section + closing reading (2500-3500 words in ${language}). Translate section headers into ${language} naturally. Integrate hidden stems, 12 stages, void branches, and major luck cycles as substantive material — don't enumerate mechanically, weave them into personality·career·relationships·timing.`;
}

/**
 * Full message array for Claude API call.
 */
export function buildClaudeRequest(saju, options = {}) {
  const language = options.language || 'en';
  const readingType = options.readingType || 'general';
  return {
    system: systemPrompt(language, readingType),
    messages: [
      { role: 'user', content: userMessage(saju, { language, readingType }) },
    ],
  };
}
