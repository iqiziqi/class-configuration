import 'reflect-metadata';

interface IFrom {
  env?: string;
  default?: any;
}

const CONFIG_VALUE = Symbol('CONFIG_VALUE');

/**
 * Parse a value to boolean.
 */
function parseBool(value: any) {
  if (typeof value !== 'string') return Boolean(value);
  if (value.toLowerCase() === 'true' || value.toLowerCase() === 't') return true;
  if (value.toLowerCase() === 'false' || value.toLowerCase() === 'f') return false;
  throw new TypeError(`Can't convert type of '${value}' to boolean!`);
}

export function ConfigField(from: IFrom) {
  return function(target: any, propertyKey: string) {
    const filedType = Reflect.getMetadata('design:type', target, propertyKey);
    const env_value = from.env ? process.env[from.env] : process.env[propertyKey];
    const value = env_value ?? from.default;

    if (value === undefined) throw new TypeError(`Can't find default value!`);
    if (filedType === String) {
      Reflect.defineMetadata(propertyKey, undefined, target)
      Reflect.defineMetadata(CONFIG_VALUE, value, target, propertyKey);
      return;
    }
    if (filedType === Number) {
      Reflect.defineMetadata(propertyKey, undefined, target)
      Reflect.defineMetadata(CONFIG_VALUE, Number.parseInt(value, 10), target, propertyKey);
      return;
    }
    if (filedType === Boolean) {
      Reflect.defineMetadata(propertyKey, undefined, target)
      Reflect.defineMetadata(CONFIG_VALUE, parseBool(value), target, propertyKey);
      return;
    }
    throw new TypeError('Get the type of not support!');
  }
}

export function init<T>(instance: T) {
  const keys =  Reflect.getMetadataKeys(instance);
  for (const key of keys) {
    (instance as any)[key] = Reflect.getMetadata(CONFIG_VALUE, instance, key);
  }
  return instance;
}
