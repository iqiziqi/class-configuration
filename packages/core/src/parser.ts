import { Constructor, IFieldExt } from './defines';

/**
 * Parse a value to boolean.
 */
export function parseBool(value?: string) {
  if (value === undefined) return undefined;
  if (value.toLowerCase() === 'true' || value.toLowerCase() === 't') return true;
  if (value.toLowerCase() === 'false' || value.toLowerCase() === 'f') return false;
  throw new TypeError(`Can't convert type of '${value}' to boolean!`);
}

/**
 * Parse a value to number.
 */
export function parseNumber(value?: string) {
  if (value === undefined) return undefined;
  const result = Number(value);
  if (!Number.isNaN(result)) return result;
  throw new TypeError(`Can't convert type of '${value}' to number!`);
}

/**
 * The default value parser.
 */
export function parse(value: string | undefined, ext: IFieldExt) {
  const { fieldType, fieldName } = ext;
  switch (true) {
    case fieldType === (String as Constructor):
      return value;
    case fieldType === (Number as Constructor):
      return parseNumber(value);
    case fieldType === (Boolean as Constructor):
      return parseBool(value);
    default:
      throw new TypeError(`From instance '${fieldName.toString()}' get an unsupported type: '${fieldType.name}'.`);
  }
}
