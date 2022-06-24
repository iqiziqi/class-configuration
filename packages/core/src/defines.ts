export type Constructor = new (...args: []) => unknown;

export const CONFIG_CLASS = 'CONFIG_CLASS';
export const CONFIG_DEFAULT_VALUE = 'CONFIG_DEFAULT_VALUE';
export const CONFIG_FIELD_PARSER = 'CONFIG_FIELD_PARSER';
export const CONFIG_SOURCES = 'CONFIG_SOURCES';

export interface IFieldExt {
  fieldType: Constructor;
  fieldName: string | symbol;
}

export interface IConfigFieldOptions {
  parser: (value?: string) => unknown;
}

export interface IConfigSource<T> {
  getValue: (filedExt: IFieldExt) => T | undefined;
}

export interface IValidator {
  validate: (config: object) => string[] | Promise<string[]>;
}

export interface IConfigOptions {
  /**
   * The config validator
   */
  validator?: IValidator;
}
