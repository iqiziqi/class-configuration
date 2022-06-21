import 'reflect-metadata';

import {
  CONFIG_CLASS,
  CONFIG_DEFAULT_VALUE,
  CONFIG_FIELD_PARSER,
  CONFIG_SOURCES,
  Constructor,
  IConfigFieldOptions,
  IConfigOptions,
  IConfigSource,
  IFieldExt,
} from './defines';
import { parse } from './parser';

export { IConfigSource, IValidator, IFieldExt } from './defines';

/**
 * Get the first value of source list.
 *
 * @param sources Config source list
 */
function getSourcesValue<T>(sources: IConfigSource<T>[] = [], ext: IFieldExt) {
  for (const source of sources) {
    const value = source.getValue(ext);
    if (value !== undefined) return value;
  }
}

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
 * Set config source for a class field.
 *
 * @param sources The source of want to set.
 */
export function From<T>(...sources: IConfigSource<T>[]): PropertyDecorator {
  return function (target: object, propertyKey: string | symbol): void {
    Reflect.defineMetadata(CONFIG_SOURCES, sources, target, propertyKey);
  };
}

export class BaseConfig {
  /**
   * Create instance by constructor.
   */
  private static instantiate<T extends BaseConfig>(constructor: Constructor): T {
    if (!Reflect.hasMetadata(CONFIG_CLASS, constructor)) {
      throw new Error(`The class '${constructor.name}' is not a config class.`);
    }
    const instance = new constructor() as T;
    const fieldNames = Reflect.getMetadataKeys(instance) as Array<keyof T>;
    for (const fieldName of fieldNames) {
      const fieldKey = fieldName as string | symbol;
      const fieldType = Reflect.getMetadata('design:type', instance, fieldKey) as Constructor;
      const sources = Reflect.getMetadata(CONFIG_SOURCES, instance, fieldKey) as IConfigSource<unknown>[];
      const ext = { fieldName, fieldType } as IFieldExt;
      const sourceValue = getSourcesValue(sources, ext) as string;
      const value = sourceValue ?? Reflect.getMetadata(CONFIG_DEFAULT_VALUE, instance, fieldKey);

      if (typeof fieldType === 'function' && Reflect.hasMetadata(CONFIG_CLASS, fieldType)) {
        if (Reflect.hasMetadata(CONFIG_DEFAULT_VALUE, instance, fieldKey))
          throw new Error(`Config class field '${fieldKey.toString()}' can't set default value`);
        if (Reflect.hasMetadata(CONFIG_SOURCES, instance, fieldKey))
          throw new Error(`Config class field '${fieldKey.toString()}' can't set config source`);
        instance[fieldName] = this.instantiate(fieldType);
      } else {
        const customizeParser = Reflect.getMetadata(CONFIG_FIELD_PARSER, instance, fieldKey);
        instance[fieldName] = customizeParser ? customizeParser(value) : parse(value, ext);
      }
    }
    return instance;
  }

  /**
   * Init the config class instance.
   *
   * @returns        The instance of config after init
   */
  public static async init<T extends BaseConfig>(options?: IConfigOptions): Promise<T> {
    return await this.from<T>(this as Constructor, options);
  }

  /**
   * Create the config class instance from a constructor.
   *
   * @returns        The instance of config after init
   */
  public static async from<T extends BaseConfig>(constructor: Constructor, options?: IConfigOptions): Promise<T> {
    const instance = this.instantiate<T>(constructor);
    const { validator } = options || {};
    if (validator) await validator.validate(instance);
    return instance;
  }
}
