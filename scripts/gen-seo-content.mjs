#!/usr/bin/env node
// Day Master 10 archetypes SEO blog generator — EN/KO/JA
// Calls Anthropic Opus 4.8 directly. Writes to blog/day-master-archetypes-{lang}.html
// Run: node scripts/gen-seo-content.mjs

import fs from 'node:fs/promises';
import path from 'node:path';

const KEY = process.env.ANTHROPIC_API_KEY;
if (!KEY) { console.error('ANTHROPIC_API_KEY missing'); process.exit(1); }

const MODEL = 'claude-opus-4-8';
const REPO_ROOT = path.resolve(import.meta.dirname, '..');

const LANGS = [
  { code: 'en', name: 'English', titleSuffix: 'Day Master 10 Archetypes — Korean Saju / BaZi Guide', desc: 'Comprehensive guide to the 10 Heavenly Stems (甲乙丙丁戊己庚辛壬癸) as Day Master archetypes in Korean Saju, Chinese BaZi, and Japanese 四柱推命. Personality traits, strengths, blind spots, real-world examples.' },
  { code: 'ko', name: 'Korean (한국어)', titleSuffix: '일주 10천간 인물론 — 사주 데이마스터 완전 가이드', desc: '갑·을·병·정·무·기·경·신·임·계 — 사주 일간(日干) 10천간의 성격 원형. 강점, 사각지대, 일터·연애·진로 시나리오까지 6,000자 완결.' },
  { code: 'ja', name: 'Japanese (日本語)', titleSuffix: '日干10種類アーキタイプ — 四柱推命の日主完全ガイド', desc: '甲乙丙丁戊己庚辛壬癸 — 四柱推命の日主10種のアーキタイプを徹底解説。性格・強み・盲点、仕事・恋愛・進路シーンまで網羅。' }
];

const STEMS = [
  { c: '甲', name_en: 'Jiǎ (甲, Yang Wood)', name_ko: '갑(甲, 양목)', name_ja: '甲(きのえ・陽の木)' },
  { c: '乙', name_en: 'Yǐ (乙, Yin Wood)', name_ko: '을(乙, 음목)', name_ja: '乙(きのと・陰の木)' },
  { c: '丙', name_en: 'Bǐng (丙, Yang Fire)', name_ko: '병(丙, 양화)', name_ja: '丙(ひのえ・陽の火)' },
  { c: '丁', name_en: 'Dīng (丁, Yin Fire)', name_ko: '정(丁, 음화)', name_ja: '丁(ひのと・陰の火)' },
  { c: '戊', name_en: 'Wù (戊, Yang Earth)', name_ko: '무(戊, 양토)', name_ja: '戊(つちのえ・陽の土)' },
  { c: '己', name_en: 'Jǐ (己, Yin Earth)', name_ko: '기(己, 음토)', name_ja: '기(つちのと・陰の土)' },
  { c: '庚', name_en: 'Gēng (庚, Yang Metal)', name_ko: '경(庚, 양금)', name_ja: '庚(かのえ・陽の金)' },
  { c: '辛', name_en: 'Xīn (辛, Yin Metal)', name_ko: '신(辛, 음금)', name_ja: '辛(かのと・陰の金)' },
  { c: '壬', name_en: 'Rén (壬, Yang Water)', name_ko: '임(壬, 양수)', name_ja: '壬(みずのえ・陽の水)' },
  { c: '癸', name_en: 'Guǐ (癸, Yin Water)', name_ko: '계(癸, 음수)', name_ja: '癸(みずのと・陰の水)' }
];

function buildPrompt(langInfo) {
  const lang = langInfo.code;
  const langName = langInfo.name;
  const stemList = STEMS.map(s => {
    if (lang==='ko') return `- ${s.name_ko}`;
    if (lang==='ja') return `- ${s.name_ja}`;
    return `- ${s.name_en}`;
  }).join('\n');

  const culturalNote = {
    en: 'Use workplace/dating/career scenes that an English-speaking reader relates to (deadlines, 1-on-1s, dating apps, 401k vesting, OKRs, side hustles, burnout, layoffs).',
    ko: '한국 독자가 즉시 공감할 장면을 써라 — 회식, 사내정치, 연차 눈치, 번아웃, n잡, 부모님 잔소리, 결혼 압박, 30대 진로 고민. "~잖아", "~더라" 같은 자연 구어체 OK. 사관체(史官體) 금지.',
    ja: '日本人読者が即共感する場面を描け — 飲み会、空気を読む、忖度、転職、ワーママ、推し活、終電、月曜の朝礼。「です・ます」基調、堅すぎない自然な日本語で。'
  }[lang];

  return `You are an expert in Korean Saju (四柱推命 / BaZi / Four Pillars of Destiny) writing for a global audience. Write a comprehensive, original SEO blog article in ${langName} about the 10 Day Master archetypes (10 Heavenly Stems as the day pillar's heavenly stem).

Stems to cover, IN THIS ORDER, each with its own <h2> section:
${stemList}

Output requirements:

1. Output PURE HTML BODY content only — no <html>, no <head>, no <body> wrapper. Start with <header>, end with </footer>.
2. Structure:
   - <header> with <h1> title + 1-paragraph intro (what is Day Master, why it matters)
   - For each of the 10 stems: <section> with <h2> stem name + 4 paragraphs:
     · paragraph 1: personality core (~200 chars)
     · paragraph 2: strengths (~200 chars)
     · paragraph 3: blind spots / failure modes (~200 chars)
     · paragraph 4: real-world scene — work / love / career decision (~200 chars)
   - <section><h2>How to find your Day Master</h2> — brief explanation of pulling birth date through Saju calculator, link to https://hoonsikim.github.io/saju as "free, solar-term-correct, 20 languages"
   - <footer> with CTA: "Compute your chart free at https://hoonsikim.github.io/saju"
3. Length: each stem section ~800-1000 chars. Total article 8,000-10,000 chars.
4. ${culturalNote}
5. Use <strong> sparingly for key terms. Use <em> for stem name first mention in each section.
6. NO disclaimers like "for entertainment only" — write authoritatively. NO bullet lists in stem sections — use prose paragraphs.
7. Original analysis based on classical Saju methodology (Day Master + Ten Gods framework). Do NOT just translate — write natively in ${langName}.

Start output immediately with <header>. No preamble.`;
}

async function callOpus(prompt, lang) {
  console.log(`[${lang}] calling Opus 4.8...`);
  const start = Date.now();
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': KEY,
      'anthropic-version': '2023-06-01',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: 16000,
      messages: [{ role: 'user', content: prompt }]
    })
  });
  const data = await res.json();
  const elapsed = ((Date.now()-start)/1000).toFixed(1);
  if (!data.content) {
    console.error(`[${lang}] FAIL after ${elapsed}s:`, JSON.stringify(data).slice(0, 500));
    return null;
  }
  const html = data.content[0].text;
  const u = data.usage || {};
  console.log(`[${lang}] OK ${elapsed}s · ${html.length} chars · tokens in:${u.input_tokens} out:${u.output_tokens}`);
  return html;
}

function wrapHtml(bodyHtml, langInfo) {
  const lang = langInfo.code;
  const title = langInfo.titleSuffix;
  const desc = langInfo.desc;
  const url = `https://hoonsikim.github.io/saju/blog/day-master-archetypes-${lang}.html`;
  const dateIso = '2026-06-23T00:00:00+09:00';
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description: desc,
    inLanguage: lang,
    datePublished: dateIso,
    dateModified: dateIso,
    author: { '@type': 'Person', name: 'Hoonsi Kim', url: 'https://hoonsikim.github.io/saju/about/' },
    publisher: { '@type': 'Organization', name: 'Saju', url: 'https://hoonsikim.github.io/saju/' },
    mainEntityOfPage: { '@type': 'WebPage', '@id': url }
  };
  return `<!DOCTYPE html>
<html lang="${lang}">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${title}</title>
<meta name="description" content="${desc}">
<link rel="canonical" href="${url}">
<link rel="alternate" hreflang="en" href="https://hoonsikim.github.io/saju/blog/day-master-archetypes-en.html">
<link rel="alternate" hreflang="ko" href="https://hoonsikim.github.io/saju/blog/day-master-archetypes-ko.html">
<link rel="alternate" hreflang="ja" href="https://hoonsikim.github.io/saju/blog/day-master-archetypes-ja.html">
<link rel="alternate" hreflang="x-default" href="https://hoonsikim.github.io/saju/blog/day-master-archetypes-en.html">
<meta property="og:type" content="article">
<meta property="og:title" content="${title}">
<meta property="og:description" content="${desc}">
<meta property="og:url" content="${url}">
<meta property="og:locale" content="${lang}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${title}">
<meta name="twitter:description" content="${desc}">
<script type="application/ld+json">${JSON.stringify(jsonLd)}</script>
<style>
body{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,"Apple SD Gothic Neo","Noto Sans KR","Noto Sans JP",sans-serif;max-width:720px;margin:2rem auto;padding:0 1.2rem;line-height:1.7;color:#222;background:#fafafa}
header h1{font-size:1.8rem;line-height:1.3;margin-bottom:.4rem}
header p{color:#555;font-size:1rem}
section{margin-top:2.4rem}
section h2{font-size:1.35rem;border-bottom:1px solid #e5e5e5;padding-bottom:.3rem;margin-bottom:.8rem}
p{margin:.8rem 0}
em{font-style:normal;font-weight:600;color:#7a4a2b}
strong{color:#222}
footer{margin-top:3rem;padding-top:1.2rem;border-top:1px solid #e5e5e5;color:#555;font-size:.95rem}
footer a{color:#7a4a2b}
nav.lang{margin-top:1rem;font-size:.85rem;color:#888}
nav.lang a{color:#888;text-decoration:none;margin:0 .3rem}
nav.lang a:hover{color:#7a4a2b}
</style>
</head>
<body>
${bodyHtml}
<nav class="lang">Languages: <a href="day-master-archetypes-en.html">EN</a> · <a href="day-master-archetypes-ko.html">한국어</a> · <a href="day-master-archetypes-ja.html">日本語</a></nav>
</body>
</html>`;
}

const results = await Promise.allSettled(LANGS.map(async langInfo => {
  const prompt = buildPrompt(langInfo);
  const body = await callOpus(prompt, langInfo.code);
  if (!body) return { lang: langInfo.code, status: 'fail' };
  const full = wrapHtml(body, langInfo);
  const outPath = path.join(REPO_ROOT, 'blog', `day-master-archetypes-${langInfo.code}.html`);
  await fs.writeFile(outPath, full);
  return { lang: langInfo.code, status: 'ok', path: outPath, size: full.length };
}));

console.log('\n=== RESULT ===');
results.forEach((r,i) => {
  if (r.status === 'fulfilled') console.log(`${LANGS[i].code}:`, r.value);
  else console.log(`${LANGS[i].code}: REJECTED`, r.reason?.message || r.reason);
});
