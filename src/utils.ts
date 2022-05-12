import { Constructor, IParserExt } from './defines';

/**
 * Parse a value to boolean.
 */
export function parseBool(value: string) {
  if (value.toLowerCase() === 'true' || value.toLowerCase() === 't') return true;
  if (value.toLowerCase() === 'false' || value.toLowerCase() === 'f') return false;
  throw new TypeError(`Can't convert type of '${value}' to boolean!`);
}

/**
 * Parse a value to number.
 */
export function parseNumber(value: string) {
  const result = Number(value);
  if (!Number.isNaN(result)) return result;
  throw new TypeError(`Can't convert type of '${value}' to number!`);
}

/**
 * Change words from camel to constance case.
 */
export function changeToConstanceCase(source: string) {
  return source
    .replace(/_?([A-Z])/g, (_, str) => `_${str}`)
    .replace(/^_*/, '')
    .toUpperCase();
}

/**
 * The default value parser.
 */
export function parse<T>(value: string, ext: IParserExt<T>) {
  const { fieldType, fieldName } = ext;
  switch (true) {
    case fieldType === (String as Constructor<unknown>):
      return value;
    case fieldType === (Number as Constructor<unknown>):
      return parseNumber(value);
    case fieldType === (Boolean as Constructor<unknown>):
      return parseBool(value);
    default:
      throw new TypeError(`From instance '${fieldName}' get an unsupported type: '${fieldType.name}'.`);
  }
}
