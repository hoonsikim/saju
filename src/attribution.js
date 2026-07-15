// Funnel attribution shared by the browser and the Worker.
//
// Only these low-cardinality campaign fields may cross from a landing-page
// query string into analytics or checkout links. Event-specific properties
// (for example `product` or `hasBirth`) are preserved separately.

export const ATTRIBUTION_KEYS = Object.freeze([
  'source',
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_content',
  'utm_term',
]);

const MAX_LENGTH = Object.freeze({
  source: 48,
  utm_source: 48,
  utm_medium: 32,
  utm_campaign: 64,
  utm_content: 64,
  utm_term: 64,
});

function isRecord(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function decoded(value) {
  if (!value.includes('%')) return value;
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

// Reject common direct identifiers before slugging. This deliberately runs on
// the decoded input so an encoded email/phone cannot become an apparently safe
// campaign slug.
function looksLikePii(value) {
  const raw = decoded(value).trim();
  if (/[^\s@]+@[^\s@]+\.[^\s@]+/.test(raw)) return true;

  // Treat an entirely phone-shaped value with 7+ digits as an identifier, but
  // do not reject campaign names that merely contain a date or sequence.
  if (/^\+?[\d\s().-]+$/.test(raw) && (raw.match(/\d/g) || []).length >= 7) return true;
  return false;
}

export function normalizeAttributionValue(value, maxLength = 64) {
  if (typeof value !== 'string') return null;
  const raw = value.trim();
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

export function sanitizeAttribution(input) {
  const result = {};
  if (!input) return result;

  let getter;
  if (typeof input === 'string' || input instanceof URLSearchParams) {
    const params = input instanceof URLSearchParams
      ? input
      : new URLSearchParams(input.startsWith('?') ? input.slice(1) : input);
    getter = key => params.get(key);
  } else if (isRecord(input)) {
    getter = key => Object.prototype.hasOwnProperty.call(input, key) ? input[key] : null;
  } else {
    return result;
  }

  for (const key of ATTRIBUTION_KEYS) {
    const normalized = normalizeAttributionValue(getter(key), MAX_LENGTH[key]);
    if (normalized) result[key] = normalized;
  }
  return result;
}

export function mergeAttribution(extra, attribution) {
  const merged = isRecord(extra) ? { ...extra } : {};

  // Never trust attribution-looking fields already present in an event. They
  // are removed first, then reintroduced only through the shared validator.
  for (const key of ATTRIBUTION_KEYS) delete merged[key];
  return { ...merged, ...sanitizeAttribution(attribution) };
}

export function attributionSource(attribution) {
  const safe = sanitizeAttribution(attribution);
  return safe.source || safe.utm_source || null;
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

  for (const [key, value] of Object.entries(sanitizeAttribution(attribution))) {
    target.searchParams.set(key, value);
  }

  if (absolute) return target.toString();
  return `${target.pathname}${target.search}${target.hash}`;
}
