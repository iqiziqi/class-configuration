/**
 * Parse a value to boolean.
 */
export function parseBool(value: any) {
  if (typeof value !== 'string') return Boolean(value);
  if (value.toLowerCase() === 'true' || value.toLowerCase() === 't') return true;
  if (value.toLowerCase() === 'false' || value.toLowerCase() === 'f') return false;
  throw new TypeError(`Can't convert type of '${value}' to boolean!`);
}

/**
 * Parse a value to number.
 */
export function parseNumber(value: any) {
  const result = Number(value);
  if (!Number.isNaN(result)) return result;
  throw new TypeError(`Can't convert type of '${value}' to number!`);
}

/**
 * Change a work from camel to constance.
 */
export function toConstance(source: string) {
  return source
    .replace(/_?([A-Z])/g, (_, str) => `_${str}`)
    .replace(/^_*/, '')
    .toUpperCase();
}
