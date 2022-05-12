import 'reflect-metadata';
import {
  CONFIG_CLASS,
  CONFIG_DEFAULT_VALUE,
  CONFIG_ENV_NAME,
  CONFIG_FIELD_PARSER,
  Constructor,
  IConfigFieldOptions,
} from './defines';
import { changeToConstanceCase, parse } from './utils';

/**
 * Set a class to config class.
 */
export function Config(): ClassDecorator {
  return function <T extends NewableFunction>(target: T) {
    Reflect.defineMetadata(CONFIG_CLASS, true, target);
  };
}

/**
 * Set a class field to config item.
 */
export function ConfigField(options?: IConfigFieldOptions): PropertyDecorator {
  return function (target: object, propertyKey: string | symbol) {
    Reflect.defineMetadata(propertyKey, undefined, target);
    Reflect.defineMetadata(CONFIG_FIELD_PARSER, options?.parser, target, propertyKey);
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
    const environment = name ?? changeToConstanceCase(propertyKey as string);
    Reflect.defineMetadata(CONFIG_ENV_NAME, environment, target, propertyKey);
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

export class BaseConfig {
  /**
   * Init the config class instance.
   *
   * @returns        The instance of config after init
   */
  static init<T extends BaseConfig>(constructor?: Constructor<T>): T {
    return init<T>(constructor ?? (this as unknown as Constructor<T>));
  }
}

/**
 * Init the config instance.
 *
 * @deprecated This function will be delete in version 1.0.
 * Please use `BaseConfig.init` function instead.
 *
 * @returns        The instance of config after init
 */
export function init<T extends object>(constructor: Constructor<T>) {
  if (!Reflect.hasMetadata(CONFIG_CLASS, constructor)) {
    throw new Error(`The class '${constructor.name}' is not a config class.`);
  }
  const instance = new constructor();
  const keys = Reflect.getMetadataKeys(instance) as Array<keyof T>;
  keys.forEach((instanceKey) => {
    const key = instanceKey as string;
    const fieldType = Reflect.getMetadata('design:type', instance, key);
    const valueEnvName = Reflect.getMetadata(CONFIG_ENV_NAME, instance, key);
    const valueFromEnv = process.env[valueEnvName];
    const nativeValue = valueFromEnv ?? Reflect.getMetadata(CONFIG_DEFAULT_VALUE, instance, key);

    if (typeof fieldType === 'function' && Reflect.hasMetadata(CONFIG_CLASS, fieldType)) {
      if (Reflect.hasMetadata(CONFIG_DEFAULT_VALUE, instance, key))
        throw new Error(`Config class field '${key}' can't set default value`);
      if (Reflect.hasMetadata(CONFIG_ENV_NAME, instance, key))
        throw new Error(`Config class field '${key}' can't set environment value`);
      instance[instanceKey] = BaseConfig.init(fieldType);
    } else {
      instance[instanceKey] =
        Reflect.getMetadata(CONFIG_FIELD_PARSER, instance, key)?.(nativeValue) ??
        parse<T>(nativeValue, {
          fieldType,
          fieldName: instanceKey,
        });
    }
  });
  return instance;
}
