import { appendAttributionToUrl } from './attribution.js';

export const DIRECT_CHECKOUT_QUERY_FIELDS = Object.freeze([
  'birth',
  'gender',
  'lang',
  'readingType',
]);

export const DIRECT_CHECKOUT_OMITTED_FIELDS = Object.freeze([
  'city',
]);

const ALLOWED_GENDERS = new Set(['female', 'male']);
const ALLOWED_READING_TYPES = new Set(['general', 'career', 'love', 'wealth']);

function validInteger(value, minimum, maximum) {
  return Number.isInteger(value) && value >= minimum && value <= maximum;
}

function isValidDate(year, month, day) {
  if (!validInteger(year, 1900, 2030) || !validInteger(month, 1, 12) || !validInteger(day, 1, 31)) {
    return false;
  }
  const date = new Date(Date.UTC(year, month - 1, day));
  return date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 && date.getUTCDate() === day;
}

function normalizedInput(input) {
  if (!input || typeof input !== 'object') return null;
  const year = Number(input.year);
  const month = Number(input.month);
  const day = Number(input.day);
  const hour = Number(input.hour);
  const minute = Number(input.minute ?? 0);
  const gender = typeof input.gender === 'string' ? input.gender : '';
  const language = typeof input.language === 'string' ? input.language.trim().toLowerCase() : '';
  const readingType = typeof input.readingType === 'string' ? input.readingType : '';

  if (!isValidDate(year, month, day)) return null;
  if (!validInteger(hour, 0, 23) || !validInteger(minute, 0, 59)) return null;
  if (!ALLOWED_GENDERS.has(gender)) return null;
  if (!/^[a-z]{2,8}(?:-[a-z0-9]{2,8})?$/u.test(language)) return null;
  if (!ALLOWED_READING_TYPES.has(readingType)) return null;

  return { year, month, day, hour, minute, gender, language, readingType };
}

function pad(value) {
  return String(value).padStart(2, '0');
}

/**
 * Builds the current direct-fulfillment handoff without retaining a second
 * browser copy of the reading input. Birth city is deliberately excluded: it
 * is optional context and is not required by the current paid fulfillment.
 *
 * The remaining four query fields are the minimum accepted by the existing
 * Gumroad -> Cloudflare fulfillment contract. Moving them into Gumroad native custom
 * fields requires a separately authorized product/workflow migration.
 */
export function buildDirectCheckoutUrl(baseUrl, input, attribution = {}) {
  let checkout;
  try {
    checkout = new URL(baseUrl);
  } catch {
    return appendAttributionToUrl(baseUrl, attribution);
  }
  checkout.searchParams.delete('city');

  const fallback = appendAttributionToUrl(checkout.toString(), attribution);
  const safe = normalizedInput(input);
  if (!safe) return fallback;

  checkout.searchParams.set(
    'birth',
    `${safe.year}${pad(safe.month)}${pad(safe.day)}${pad(safe.hour)}${pad(safe.minute)}`,
  );
  checkout.searchParams.set('gender', safe.gender);
  checkout.searchParams.set('lang', safe.language);
  checkout.searchParams.set('readingType', safe.readingType);
  return appendAttributionToUrl(checkout.toString(), attribution);
}
