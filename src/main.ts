import 'reflect-metadata';

const CONFIG_DEFAULT_VALUE = Symbol('CONFIG_DEFAULT_VALUE');
const CONFIG_ENV_VALUE = Symbol('CONFIG_ENV_VALUE');

/**
 * Parse a value to boolean.
 */
function parseBool(value: any) {
  if (typeof value !== 'string') return Boolean(value);
  if (value.toLowerCase() === 'true' || value.toLowerCase() === 't') return true;
  if (value.toLowerCase() === 'false' || value.toLowerCase() === 'f') return false;
  throw new TypeError(`Can't convert type of '${value}' to boolean!`);
}

/**
 * Parse a value to number.
 */
function parseNumber(value: any) {
  const result = Number.parseFloat(value);
  if (!Number.isNaN(result)) return result;
  throw new TypeError(`Can't convert type of '${value}' to number!`);
}

/**
 * Parse a value from config class.
 */
function parseConfigClass(value: any) {
  try {
    return init(new value());
  } catch(e) {
    throw new TypeError('Get the type of not support!')
  }
}

/**
 * Set a class field to config item.
 */
export function ConfigItem() {
  return function (target: any, propertyKey: string) {
    Reflect.defineMetadata(propertyKey, undefined, target);
  }
}

export function FromEnv(name?: string) {
  return function (target: any, propertyKey: string) {
    const value = name ? process.env[name] : process.env[propertyKey];
    Reflect.defineMetadata(CONFIG_ENV_VALUE, value, target, propertyKey);
  };
}

export function DefaultValue(value: any) {
  return function (target: any, propertyKey: string) {
    Reflect.defineMetadata(CONFIG_DEFAULT_VALUE, value, target, propertyKey);
  };
}

/**
 * Init the config instance.
 *
 * @param instance The instance of config
 * @returns        The instance of config after init
 */
export function init<T>(instance: T) {
  const keys = Reflect.getMetadataKeys(instance);
  for (const key of keys) {
    const filedType = Reflect.getMetadata('design:type', instance, key);
    const valueFromEnv = Reflect.getMetadata(CONFIG_ENV_VALUE, instance, key);
    const valueFromDefault = Reflect.getMetadata(CONFIG_DEFAULT_VALUE, instance, key);
    const nativeValue = valueFromEnv ?? valueFromDefault;
    switch (true) {
      case filedType === String:
        (instance as any)[key] = nativeValue;
        break;
      case filedType === Number:
        (instance as any)[key] = parseNumber(nativeValue);
        break;
      case filedType === Boolean:
        (instance as any)[key] = parseBool(nativeValue);
        break;
      case typeof filedType === 'function':
        (instance as any)[key] = parseConfigClass(filedType);
        break;
      default:
        throw new TypeError('Get the type of not support!');
    }
  }
  return instance;
}
