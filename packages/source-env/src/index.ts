import 'reflect-metadata';

export const CONFIG_ENV_NAME = 'CONFIG_ENV_VALUE';

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
 * Set environment value for a class field.
 * If the field type is not string,
 * it will try convert to target type
 * It will override the default value.
 *
 * @param name The environment name.
 */
export function FromEnv(name?: string): PropertyDecorator {
  return function (target: object, propertyKey: string | symbol) {
    const environment = name ?? changeToConstanceCase(propertyKey as string);
    Reflect.defineMetadata(CONFIG_ENV_NAME, environment, target, propertyKey);
  };
}
