import 'reflect-metadata';
import { IConfigSource, IFieldExt } from '@class-config/core';

/**
 * Change words from camel to constance case.
 */
export function changeToConstanceCase(source: string | symbol) {
  return source
    .toString()
    .replace(/_?([A-Z])/g, (_, str) => `_${str}`)
    .replace(/^_*/, '')
    .toUpperCase();
}

/**
 * Get config value from system environment.
 */
export class Env implements IConfigSource<string> {
  public constructor(private readonly name?: string) {}
  public getValue(ext: IFieldExt) {
    const environmentName = this.name ?? changeToConstanceCase(ext.fieldName);
    return process.env[environmentName];
  }
}
