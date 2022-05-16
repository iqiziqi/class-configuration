import { BaseConfig } from './main';

export type UnknownConstructor = new (...args: []) => unknown;
export type Constructor<T> = new (...args: []) => T;

export const CONFIG_CLASS = 'CONFIG_CLASS';
export const CONFIG_DEFAULT_VALUE = 'CONFIG_DEFAULT_VALUE';
export const CONFIG_ENV_NAME = 'CONFIG_ENV_VALUE';
export const CONFIG_FIELD_PARSER = 'CONFIG_FIELD_PARSER';

export interface IParserExt<T extends BaseConfig> {
  fieldType: Constructor<T>;
  fieldName: keyof T;
}

export interface IConfigFieldOptions {
  parser: (value?: string) => unknown;
}
