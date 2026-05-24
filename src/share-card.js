// 공유 카드 PNG 생성 — 클라이언트 사이드 canvas, zero dep, zero PII to server.
// TikTok/Insta/X 공유용 1080x1080 (square).
// 사주 결과 → branded image → blob → download / clipboard.

const ELEMENT_COLOR = {
  wood: '#4ade80', fire: '#f97316', earth: '#d4a574',
  metal: '#94a3b8', water: '#3b82f6',
};
const ELEMENT_NAME = {
  en: { wood: 'Wood', fire: 'Fire', earth: 'Earth', metal: 'Metal', water: 'Water' },
  ko: { wood: '목', fire: '화', earth: '토', metal: '금', water: '수' },
  ja: { wood: '木', fire: '火', earth: '土', metal: '金', water: '水' },
  zh: { wood: '木', fire: '火', earth: '土', metal: '金', water: '水' },
};
const PILLAR_LABELS = {
  en: ['Year', 'Month', 'Day', 'Hour'],
  ko: ['연주', '월주', '일주', '시주'],
  ja: ['年柱', '月柱', '日柱', '時柱'],
  zh: ['年柱', '月柱', '日柱', '时柱'],
};
const TAGLINE = {
  en: 'My Korean Saju (四柱)',
  ko: '내 사주(四柱)',
  ja: '私の四柱推命',
  zh: '我的四柱八字',
};
const HOOK_BY_ELEMENT = {
  wood: { en: 'Built to grow.', ko: '자라나도록 태어남.', ja: '成長するために生まれた。', zh: '为成长而生。' },
  fire: { en: 'Built to shine.', ko: '빛나도록 태어남.', ja: '輝くために生まれた。', zh: '为闪耀而生。' },
  earth: { en: 'Built to hold.', ko: '머물도록 태어남.', ja: '支えるために生まれた。', zh: '为承载而生。' },
  metal: { en: 'Built to cut.', ko: '결단하도록 태어남.', ja: '断つために生まれた。', zh: '为决断而生。' },
  water: { en: 'Built to flow.', ko: '흐르도록 태어남.', ja: '流れるために生まれた。', zh: '为流动而生。' },
};
const URL_LABEL = 'saju.hoonsikim.github.io';

// Day Master archetype name — TikTok-ready hook (Tom·Lily 페르소나 발견)
// 10 천간 × 4 lang. 영어는 짧고 viral 톤.
const DAY_MASTER_ARCHETYPE = {
  '甲': { en: 'The Tall Tree',    ko: '큰 나무',   ja: '大樹',     zh: '大树' },
  '乙': { en: 'The Vine',         ko: '덩굴',     ja: '蔓',      zh: '藤蔓' },
  '丙': { en: 'The Sun',          ko: '태양',     ja: '太陽',     zh: '太阳' },
  '丁': { en: 'The Candle',       ko: '촛불',     ja: '蝋燭',     zh: '烛火' },
  '戊': { en: 'The Mountain',     ko: '큰 산',    ja: '山',      zh: '高山' },
  '己': { en: 'The Field',        ko: '밭',      ja: '田畑',     zh: '田园' },
  '庚': { en: 'The Sword',        ko: '검',      ja: '刀剣',     zh: '利剑' },
  '辛': { en: 'The Jewel',        ko: '보석',     ja: '宝石',     zh: '珠宝' },
  '壬': { en: 'The Ocean',        ko: '바다',     ja: '大海',     zh: '汪洋' },
  '癸': { en: 'The Stream',       ko: '시냇물',   ja: '小川',     zh: '溪流' },
};

const SIZE = 1080;
const BG = '#0a0a0f';
const BG_CARD = '#14141c';
const TEXT = '#f5f5f7';
const TEXT_SUB = '#a0a0b0';
const ACCENT = '#d4a574';
const ACCENT_GLOW = '#f4d4a4';

/**
 * Saju 결과 → 1080x1080 PNG canvas → returns Promise<Blob>
 * @param {Object} saju - birthInfoToFourPillars() 결과
 * @param {string} lang - 'en' | 'ko' | 'ja' | 'zh'
 * @returns {Promise<Blob>}
 */
export async function generateShareCard(saju, lang = 'en') {
  const L = ['en', 'ko', 'ja', 'zh'].includes(lang) ? lang : 'en';
  const canvas = document.createElement('canvas');
  canvas.width = SIZE;
  canvas.height = SIZE;
  const ctx = canvas.getContext('2d');

  // Background gradient
  const bgGrad = ctx.createRadialGradient(SIZE / 2, 200, 100, SIZE / 2, SIZE / 2, SIZE);
  bgGrad.addColorStop(0, '#1a1520');
  bgGrad.addColorStop(0.6, BG);
  bgGrad.addColorStop(1, '#000000');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, SIZE, SIZE);

  // Subtle grid texture (gold)
  ctx.strokeStyle = 'rgba(212, 165, 116, 0.04)';
  ctx.lineWidth = 1;
  for (let i = 0; i < SIZE; i += 60) {
    ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, SIZE); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(SIZE, i); ctx.stroke();
  }

  // Top: kicker
  ctx.fillStyle = ACCENT;
  ctx.font = '500 28px -apple-system, "Pretendard", "Hiragino Sans", "Noto Sans KR", sans-serif';
  ctx.textAlign = 'center';
  ctx.letterSpacing = '4px';
  ctx.fillText('사주 · 四柱 · SA-JU', SIZE / 2, 90);

  // Tagline
  ctx.fillStyle = TEXT;
  ctx.font = '600 44px "Noto Serif KR", "Noto Serif", Georgia, serif';
  ctx.fillText(TAGLINE[L], SIZE / 2, 170);

  // Pillars row — center horizontally, 4 columns
  const pillarKeys = ['year', 'month', 'day', 'hour'];
  const labels = PILLAR_LABELS[L];
  const cellW = 200;
  const cellGap = 24;
  const totalW = cellW * 4 + cellGap * 3;
  const startX = (SIZE - totalW) / 2;
  const cellY = 240;
  const cellH = 320;

  pillarKeys.forEach((key, i) => {
    const p = saju.pillars[key];
    const x = startX + i * (cellW + cellGap);
    const isDay = key === 'day';

    // Cell bg
    ctx.fillStyle = BG_CARD;
    ctx.beginPath();
    if (ctx.roundRect) ctx.roundRect(x, cellY, cellW, cellH, 18);
    else ctx.rect(x, cellY, cellW, cellH);
    ctx.fill();

    // Day pillar accent border
    if (isDay) {
      ctx.strokeStyle = ACCENT;
      ctx.lineWidth = 3;
      ctx.beginPath();
      if (ctx.roundRect) ctx.roundRect(x, cellY, cellW, cellH, 18);
      else ctx.rect(x, cellY, cellW, cellH);
      ctx.stroke();
    }

    // Label
    ctx.fillStyle = TEXT_SUB;
    ctx.font = '500 22px -apple-system, "Pretendard", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(labels[i], x + cellW / 2, cellY + 36);

    // Gan (천간)
    ctx.fillStyle = ELEMENT_COLOR[p.ganElement];
    ctx.font = '700 110px "Noto Serif KR", "Noto Serif", serif';
    ctx.fillText(p.gan, x + cellW / 2, cellY + 160);

    // Zhi (지지)
    ctx.fillStyle = ELEMENT_COLOR[p.zhiElement];
    ctx.font = '700 110px "Noto Serif KR", "Noto Serif", serif';
    ctx.fillText(p.zhi, x + cellW / 2, cellY + 290);
  });

  // Day Master big highlight
  const dmY = 640;
  ctx.fillStyle = TEXT_SUB;
  ctx.font = '500 26px -apple-system, "Pretendard", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(`Day Master · 日主 · ${ELEMENT_NAME[L][saju.dayMasterElement]}`, SIZE / 2, dmY);

  ctx.fillStyle = ELEMENT_COLOR[saju.dayMasterElement];
  ctx.font = '800 170px "Noto Serif KR", "Noto Serif", serif';
  ctx.fillText(saju.dayMaster, SIZE / 2, dmY + 150);

  // Archetype name (e.g. "The Sword") — TikTok-ready hook
  const arch = DAY_MASTER_ARCHETYPE[saju.dayMaster]?.[L] || '';
  if (arch) {
    ctx.fillStyle = ACCENT;
    ctx.font = '600 36px "Noto Serif KR", "Noto Serif", serif';
    ctx.fillText(arch, SIZE / 2, dmY + 200);
  }

  // Hook (element-based one-liner)
  const hook = HOOK_BY_ELEMENT[saju.dayMasterElement][L];
  ctx.fillStyle = ACCENT_GLOW;
  ctx.font = '600 38px "Noto Serif KR", "Noto Serif", serif';
  ctx.fillText(hook, SIZE / 2, 930);

  // 5 elements mini bar (small, bottom)
  const total = Object.values(saju.elements).reduce((a, b) => a + b, 0) || 1;
  const elKeys = ['wood', 'fire', 'earth', 'metal', 'water'];
  const barW = 540;
  const barH = 8;
  const barX = (SIZE - barW) / 2;
  const barY = 970;
  let cumX = barX;
  elKeys.forEach(e => {
    const w = (saju.elements[e] / total) * barW;
    ctx.fillStyle = ELEMENT_COLOR[e];
    ctx.fillRect(cumX, barY, w, barH);
    cumX += w;
  });

  // URL footer
  ctx.fillStyle = TEXT_SUB;
  ctx.font = '500 22px -apple-system, "Pretendard", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(URL_LABEL, SIZE / 2, 1030);

  return new Promise(resolve => canvas.toBlob(b => resolve(b), 'image/png', 0.95));
}

/**
 * 9:16 story variant — IG/TikTok story (1080x1920).
 * 페르소나 QA P6 (Lily decisive · Tom·민지·Aisha cross-confirm).
 */
export async function generateShareCardStory(saju, lang = 'en') {
  const L = ['en', 'ko', 'ja', 'zh'].includes(lang) ? lang : 'en';
  const W = 1080, H = 1920;
  const canvas = document.createElement('canvas');
  canvas.width = W; canvas.height = H;
  const ctx = canvas.getContext('2d');

  // Background gradient
  const bgGrad = ctx.createRadialGradient(W / 2, 300, 200, W / 2, H / 2, H);
  bgGrad.addColorStop(0, '#1a1520');
  bgGrad.addColorStop(0.55, BG);
  bgGrad.addColorStop(1, '#000000');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, W, H);

  // Subtle grid
  ctx.strokeStyle = 'rgba(212, 165, 116, 0.04)';
  ctx.lineWidth = 1;
  for (let i = 0; i < W; i += 60) { ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, H); ctx.stroke(); }
  for (let i = 0; i < H; i += 60) { ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(W, i); ctx.stroke(); }

  // Top kicker
  ctx.fillStyle = ACCENT;
  ctx.font = '500 32px -apple-system, "Pretendard", "Hiragino Sans", "Noto Sans KR", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('사주 · 四柱 · SA-JU', W / 2, 200);

  // Tagline
  ctx.fillStyle = TEXT;
  ctx.font = '600 52px "Noto Serif KR", "Noto Serif", Georgia, serif';
  ctx.fillText(TAGLINE[L], W / 2, 290);

  // 4 pillars row — compact
  const labels = PILLAR_LABELS[L];
  const cellW = 200, cellGap = 24, totalW = cellW * 4 + cellGap * 3;
  const startX = (W - totalW) / 2;
  const cellY = 380, cellH = 320;
  ['year', 'month', 'day', 'hour'].forEach((key, i) => {
    const p = saju.pillars[key];
    const x = startX + i * (cellW + cellGap);
    ctx.fillStyle = BG_CARD;
    ctx.beginPath();
    if (ctx.roundRect) ctx.roundRect(x, cellY, cellW, cellH, 18); else ctx.rect(x, cellY, cellW, cellH);
    ctx.fill();
    if (key === 'day') {
      ctx.strokeStyle = ACCENT; ctx.lineWidth = 3;
      ctx.beginPath();
      if (ctx.roundRect) ctx.roundRect(x, cellY, cellW, cellH, 18); else ctx.rect(x, cellY, cellW, cellH);
      ctx.stroke();
    }
    ctx.fillStyle = TEXT_SUB;
    ctx.font = '500 22px -apple-system, "Pretendard", sans-serif';
    ctx.fillText(labels[i], x + cellW / 2, cellY + 36);
    ctx.fillStyle = ELEMENT_COLOR[p.ganElement];
    ctx.font = '700 110px "Noto Serif KR", "Noto Serif", serif';
    ctx.fillText(p.gan, x + cellW / 2, cellY + 160);
    ctx.fillStyle = ELEMENT_COLOR[p.zhiElement];
    ctx.fillText(p.zhi, x + cellW / 2, cellY + 290);
  });

  // Day Master — center, BIG (story format hero)
  const dmY = 900;
  ctx.fillStyle = TEXT_SUB;
  ctx.font = '500 28px -apple-system, "Pretendard", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(`Day Master · 日主 · ${ELEMENT_NAME[L][saju.dayMasterElement]}`, W / 2, dmY);

  ctx.fillStyle = ELEMENT_COLOR[saju.dayMasterElement];
  ctx.font = '800 280px "Noto Serif KR", "Noto Serif", serif';
  ctx.fillText(saju.dayMaster, W / 2, dmY + 230);

  // Archetype name (e.g. "The Sword") — TikTok-ready one-liner hook
  const arch = DAY_MASTER_ARCHETYPE[saju.dayMaster]?.[L] || '';
  if (arch) {
    ctx.fillStyle = ACCENT;
    ctx.font = '700 56px "Noto Serif KR", "Noto Serif", serif';
    ctx.fillText(arch, W / 2, dmY + 320);
  }

  // Element hook (savage one-liner)
  const hook = HOOK_BY_ELEMENT[saju.dayMasterElement][L];
  ctx.fillStyle = ACCENT_GLOW;
  ctx.font = '600 44px "Noto Serif KR", "Noto Serif", serif';
  ctx.fillText(hook, W / 2, dmY + 420);

  // 5 elements bar
  const total = Object.values(saju.elements).reduce((a, b) => a + b, 0) || 1;
  const barW = 720, barH = 12;
  const barX = (W - barW) / 2, barY = 1700;
  let cumX = barX;
  ['wood', 'fire', 'earth', 'metal', 'water'].forEach(e => {
    const w = (saju.elements[e] / total) * barW;
    ctx.fillStyle = ELEMENT_COLOR[e];
    ctx.fillRect(cumX, barY, w, barH);
    cumX += w;
  });

  // Footer URL
  ctx.fillStyle = TEXT_SUB;
  ctx.font = '500 26px -apple-system, "Pretendard", sans-serif';
  ctx.fillText(URL_LABEL, W / 2, 1820);

  return new Promise(resolve => canvas.toBlob(b => resolve(b), 'image/png', 0.95));
}

/**
 * Blob → 다운로드 트리거
 */
export function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/**
 * Blob → 클립보드 (지원 브라우저만)
 */
export async function copyBlobToClipboard(blob) {
  if (!navigator.clipboard?.write) return false;
  try {
    await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
    return true;
  } catch {
    return false;
  }
}
