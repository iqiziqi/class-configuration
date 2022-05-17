import 'reflect-metadata';
import { validateOrReject } from 'class-validator';
import {
  CONFIG_CLASS,
  CONFIG_DEFAULT_VALUE,
  CONFIG_ENV_NAME,
  CONFIG_FIELD_PARSER,
  Constructor,
  IConfigFieldOptions,
  IConfigInitOptions,
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
  public static async init<T extends BaseConfig>(options?: IConfigInitOptions): Promise<T> {
    return await this.from<T>(this as unknown as Constructor<T>, options);
  }

  /**
   * Create the config class instance from a constructor.
   *
   * @returns        The instance of config after init
   */
  public static async from<T extends BaseConfig>(
    constructor: Constructor<T>,
    options?: IConfigInitOptions,
  ): Promise<T> {
    if (!Reflect.hasMetadata(CONFIG_CLASS, constructor)) {
      throw new Error(`The class '${constructor.name}' is not a config class.`);
    }
    const instance = new constructor();
    const fieldNames = Reflect.getMetadataKeys(instance) as Array<keyof T>;
    for (const fieldName of fieldNames) {
      const fieldKey = fieldName as string;
      const fieldType = Reflect.getMetadata('design:type', instance, fieldKey);
      const valueEnvName = Reflect.getMetadata(CONFIG_ENV_NAME, instance, fieldKey);
      const valueFromEnv = process.env[valueEnvName];
      const nativeValue = valueFromEnv ?? Reflect.getMetadata(CONFIG_DEFAULT_VALUE, instance, fieldKey);

      if (typeof fieldType === 'function' && Reflect.hasMetadata(CONFIG_CLASS, fieldType)) {
        if (Reflect.hasMetadata(CONFIG_DEFAULT_VALUE, instance, fieldKey))
          throw new Error(`Config class field '${fieldKey}' can't set default value`);
        if (Reflect.hasMetadata(CONFIG_ENV_NAME, instance, fieldKey))
          throw new Error(`Config class field '${fieldKey}' can't set environment value`);
        instance[fieldName] = await BaseConfig.from(fieldType);
      } else {
        const customizeParser = Reflect.getMetadata(CONFIG_FIELD_PARSER, instance, fieldKey);
        instance[fieldName] = customizeParser
          ? customizeParser(nativeValue)
          : parse<T>(nativeValue, { fieldType, fieldName });
      }
    }
    const { validate, validateOptions } = options || {};
    if (validate) {
      const options = validateOptions ?? { stopAtFirstError: true };
      await validateOrReject(instance, options);
    }
    return instance;
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
export function init<T extends object>(constructor: Constructor<T>): T {
  if (!Reflect.hasMetadata(CONFIG_CLASS, constructor)) {
    throw new Error(`The class '${constructor.name}' is not a config class.`);
  }
  const instance = new constructor();
  const fieldNames = Reflect.getMetadataKeys(instance) as Array<keyof T>;
  fieldNames.forEach((fieldName) => {
    const fieldKey = fieldName as string;
    const fieldType = Reflect.getMetadata('design:type', instance, fieldKey);
    const valueEnvName = Reflect.getMetadata(CONFIG_ENV_NAME, instance, fieldKey);
    const valueFromEnv = process.env[valueEnvName];
    const nativeValue = valueFromEnv ?? Reflect.getMetadata(CONFIG_DEFAULT_VALUE, instance, fieldKey);

    if (typeof fieldType === 'function' && Reflect.hasMetadata(CONFIG_CLASS, fieldType)) {
      if (Reflect.hasMetadata(CONFIG_DEFAULT_VALUE, instance, fieldKey))
        throw new Error(`Config class field '${fieldKey}' can't set default value`);
      if (Reflect.hasMetadata(CONFIG_ENV_NAME, instance, fieldKey))
        throw new Error(`Config class field '${fieldKey}' can't set environment value`);
      instance[fieldName] = init(fieldType) as unknown as T[keyof T];
    } else {
      const customizeParser = Reflect.getMetadata(CONFIG_FIELD_PARSER, instance, fieldKey);
      instance[fieldName] = customizeParser
        ? customizeParser(nativeValue)
        : parse<T>(nativeValue, { fieldType, fieldName });
    }
  });
  return instance;
}
