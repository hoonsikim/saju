// Funnel attribution shared by the browser and the Worker.
//
// Analytics attribution is intentionally a closed registry. Public query
// parameters are attacker-controlled, so accepting arbitrary slugs would turn
// a supposedly low-cardinality metric into a PII/dimension sink. Checkout URL
// propagation remains a separate, bounded compatibility helper; the Worker
// independently enforces the closed analytics registry.

export const ATTRIBUTION_KEYS = Object.freeze([
  'source',
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_content',
  'utm_term',
]);

export const ATTRIBUTION_REGISTRY = Object.freeze({
  indexnow_saju_vs_bazi_001: Object.freeze({
    campaign: 'indexnow_saju_vs_bazi_001',
    acceptedQuery: Object.freeze({
      utm_source: 'indexnow',
      utm_medium: 'organic-search',
      utm_campaign: 'indexnow_saju_vs_bazi_001',
    }),
  }),
  reddit_chinesezodiac_001: Object.freeze({
    campaign: 'reddit_chinesezodiac_001',
    acceptedQuery: Object.freeze({
      utm_source: 'reddit',
      utm_medium: 'organic-social',
      utm_campaign: 'reddit_chinesezodiac_001',
    }),
  }),
  reddit_chineseastrology_001: Object.freeze({
    campaign: 'reddit_chineseastrology_001',
    acceptedQuery: Object.freeze({
      utm_source: 'reddit',
      utm_medium: 'organic-social',
      utm_campaign: 'reddit_chineseastrology_001',
    }),
  }),
  fivearts_001: Object.freeze({
    campaign: 'fivearts_001',
    acceptedQuery: Object.freeze({
      utm_source: 'fivearts',
      utm_medium: 'forum',
      utm_campaign: 'fivearts_001',
    }),
  }),
  gumroad_discover_001: Object.freeze({
    campaign: 'gumroad_discover_001',
    acceptedQuery: Object.freeze({
      utm_source: 'gumroad',
      utm_medium: 'marketplace',
      utm_campaign: 'gumroad_discover_001',
    }),
  }),
  threads_saju_ko_001: Object.freeze({
    campaign: 'threads_saju_ko_001',
    acceptedQuery: Object.freeze({
      utm_source: 'threads',
      utm_medium: 'organic-social',
      utm_campaign: 'threads_saju_ko_001',
    }),
  }),
  threads_saju_ja_001: Object.freeze({
    campaign: 'threads_saju_ja_001',
    acceptedQuery: Object.freeze({
      utm_source: 'threads',
      utm_medium: 'organic-social',
      utm_campaign: 'threads_saju_ja_001',
    }),
  }),
  threads_saju_en_001: Object.freeze({
    campaign: 'threads_saju_en_001',
    acceptedQuery: Object.freeze({
      utm_source: 'threads',
      utm_medium: 'organic-social',
      utm_campaign: 'threads_saju_en_001',
    }),
  }),
});

const CHECKOUT_MAX_LENGTH = Object.freeze({
  source: 48,
  utm_source: 48,
  utm_medium: 32,
  utm_campaign: 64,
  utm_content: 64,
  utm_term: 64,
});
const SESSION_PATTERN = /^sess_[a-f0-9]{32}$/;

function isRecord(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function inputGetter(input) {
  if (typeof input === 'string' || input instanceof URLSearchParams) {
    const params = input instanceof URLSearchParams
      ? input
      : new URLSearchParams(input.startsWith('?') ? input.slice(1) : input);
    return key => params.get(key);
  }
  if (isRecord(input)) {
    return key => Object.prototype.hasOwnProperty.call(input, key) ? input[key] : null;
  }
  return null;
}

function decoded(value) {
  let current = value;
  for (let index = 0; index < 2 && current.includes('%'); index += 1) {
    try {
      const next = decodeURIComponent(current);
      if (next === current) break;
      current = next;
    } catch {
      break;
    }
  }
  return current;
}

function looksLikePii(value) {
  const raw = decoded(value).normalize('NFKC').trim();
  if (/[^\s@]+@[^\s@]+\.[^\s@]+/.test(raw)) return true;
  if (/\b(?:19|20)\d{2}[-/.](?:0?[1-9]|1[0-2])[-/.](?:0?[1-9]|[12]\d|3[01])\b/.test(raw)) return true;
  if (/^\+?[\d\s().-]+$/.test(raw) && (raw.match(/\d/g) || []).length >= 7) return true;
  return false;
}

export function normalizeAttributionValue(value, maxLength = 64) {
  if (typeof value !== 'string') return null;
  const raw = value.normalize('NFKC').trim();
  if (!raw || looksLikePii(raw)) return null;

  const slug = raw
    .normalize('NFKD')
    .toLowerCase()
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9_-]+/g, '-')
    .replace(/^[-_]+|[-_]+$/g, '')
    .replace(/-{2,}/g, '-')
    .replace(/_{2,}/g, '_')
    .slice(0, Math.max(1, maxLength))
    .replace(/[-_]+$/g, '');

  return slug || null;
}

export function validateRegisteredAttribution(input) {
  const getter = inputGetter(input);
  if (!getter) return { value: {} };

  const rawSource = getter('source');
  const suppliedAttribution = ATTRIBUTION_KEYS.filter(key => getter(key) !== null);
  if (rawSource === null || rawSource === '') {
    return suppliedAttribution.length === 0
      ? { value: {} }
      : { error: 'registered source is required for attribution' };
  }

  const source = normalizeAttributionValue(rawSource, 48);
  const registration = source ? ATTRIBUTION_REGISTRY[source] : null;
  if (!registration) return { error: 'unknown attribution source' };

  for (const key of suppliedAttribution) {
    if (key === 'source') continue;
    const expected = registration.acceptedQuery[key];
    if (!expected) return { error: `unsupported attribution field: ${key}` };
    const actual = normalizeAttributionValue(getter(key), CHECKOUT_MAX_LENGTH[key]);
    if (actual !== expected) return { error: `unregistered attribution value: ${key}` };
  }

  // Campaign is deliberately not trusted from the caller. The Worker derives
  // it from this source registry.
  return { value: { source } };
}

export function sanitizeAttribution(input) {
  return validateRegisteredAttribution(input).value || {};
}

function canonicalRegisteredAttribution(input) {
  const result = validateRegisteredAttribution(input);
  if (result.error) return {};
  const source = result.value.source;
  if (!source) return {};
  const registration = ATTRIBUTION_REGISTRY[source];
  return {
    source,
    ...registration.acceptedQuery,
  };
}

export function mergeAttribution(extra, attribution) {
  const merged = isRecord(extra) ? { ...extra } : {};
  for (const key of ATTRIBUTION_KEYS) delete merged[key];
  return { ...merged, ...sanitizeAttribution(attribution) };
}

export function attributionSource(attribution) {
  return sanitizeAttribution(attribution).source || null;
}

export function appendAttributionToUrl(url, attribution) {
  if (typeof url !== 'string' || !url) return '';

  const absolute = /^[a-z][a-z\d+.-]*:/i.test(url);
  let target;
  try {
    target = new URL(url, 'https://attribution.invalid');
  } catch {
    return url;
  }

  for (const [key, value] of Object.entries(canonicalRegisteredAttribution(attribution))) {
    target.searchParams.set(key, value);
  }

  if (absolute) return target.toString();
  return `${target.pathname}${target.search}${target.hash}`;
}

export function createAnalyticsSessionId(cryptoProvider = globalThis.crypto) {
  if (!cryptoProvider || typeof cryptoProvider.getRandomValues !== 'function') return null;
  const bytes = new Uint8Array(16);
  cryptoProvider.getRandomValues(bytes);
  return `sess_${[...bytes].map(byte => byte.toString(16).padStart(2, '0')).join('')}`;
}

export function createAnalyticsSessionProvider({
  storage = null,
  cryptoProvider = globalThis.crypto,
  storageKey = 'saju.sess',
} = {}) {
  let memorySession = null;

  return function getAnalyticsSessionId() {
    try {
      const stored = storage?.getItem(storageKey);
      if (typeof stored === 'string' && SESSION_PATTERN.test(stored)) return stored;
    } catch {
      // A blocked/throwing sessionStorage falls through to page-memory state.
    }

    if (!memorySession) memorySession = createAnalyticsSessionId(cryptoProvider);
    if (!memorySession) return null;

    try {
      storage?.setItem(storageKey, memorySession);
    } catch {
      // The cryptographically random page-memory ID remains stable this load.
    }
    return memorySession;
  };
}
