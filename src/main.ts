import 'reflect-metadata';
import { parseNumber, parseBool, toConstance } from './utils';

const CONFIG_CLASS = Symbol('CONFIG_CLASS');
const CONFIG_DEFAULT_VALUE = Symbol('CONFIG_DEFAULT_VALUE');
const CONFIG_ENV_VALUE = Symbol('CONFIG_ENV_VALUE');

/**
 * Set a class to config class.
 */
export function Config(): ClassDecorator {
  return function <T extends NewableFunction>(target: T) {
    Reflect.defineMetadata(CONFIG_CLASS, undefined, target);
  };
}

/**
 * Set a class field to config item.
 */
export function ConfigField(): PropertyDecorator {
  return function (target: object, propertyKey: string | symbol) {
    Reflect.defineMetadata(propertyKey, undefined, target);
  };
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
    const environment = name ?? toConstance(propertyKey as string);
    const value = process.env[environment];
    Reflect.defineMetadata(CONFIG_ENV_VALUE, value, target, propertyKey);
  };
}

/**
 * Set default value for a class field.
 * It is't check the type of param.
 *
 * @param value The default value.
 */
export function DefaultValue(value: string): PropertyDecorator {
  return function (target: object, propertyKey: string | symbol): void {
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
      case typeof filedType === 'function' && Reflect.hasMetadata(CONFIG_CLASS, filedType):
        if (Reflect.hasMetadata(CONFIG_DEFAULT_VALUE, instance, key))
          throw new TypeError(`Config class field '${key}' can't set default value`);
        if (Reflect.hasMetadata(CONFIG_ENV_VALUE, instance, key))
          throw new TypeError(`Config class field '${key}' can't set environment value`);
        (instance as any)[key] = init(new filedType());
        break;
      default:
        const typeName = filedType?.name ? `: '${filedType.name}'` : '';
        throw new TypeError(`From instance '${key}' get a not support type${typeName}.`);
    }
  }
  return instance;
}
