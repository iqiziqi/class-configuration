import { expect } from 'chai';
import { Config, ConfigField, DefaultValue, FromEnv, init } from '../src/main';

describe('Parse config class field', function () {
  it('should get config class field by default values', function () {
    @Config()
    class DatabaseConfig {
      @ConfigField()
      @DefaultValue('localhost')
      host!: string;
      @ConfigField()
      @DefaultValue('8080')
      port!: number;
    }

    @Config()
    class RedisConfig {
      @ConfigField()
      @DefaultValue('127.0.0.1')
      host!: string;
      @ConfigField()
      @DefaultValue('1188')
      port!: number;
    }

    @Config()
    class ConfigClassFieldConfig {
      @ConfigField()
      public database!: DatabaseConfig;
      @ConfigField()
      public redis!: RedisConfig;
    }

    const config = init(new ConfigClassFieldConfig());
    expect(config.database).deep.equal({
      host: 'localhost',
      port: 8080,
    });
    expect(config.redis).deep.equal({
      host: '127.0.0.1',
      port: 1188,
    });
  });

  it('should get config class field by environment', function () {
    @Config()
    class DatabaseConfig {
      @ConfigField()
      @FromEnv('SERVER_HOST')
      host!: string;

      @ConfigField()
      @FromEnv('SERVER_PORT')
      port!: number;
    }

    @Config()
    class RedisConfig {
      @ConfigField()
      @FromEnv('REDIS_HOST')
      host!: string;

      @ConfigField()
      @FromEnv('REDIS_PORT')
      port!: number;
    }

    @Config()
    class ConfigClassFieldConfig {
      @ConfigField()
      public database!: DatabaseConfig;
      @ConfigField()
      public redis!: RedisConfig;
    }

    process.env.SERVER_HOST = 'localhost';
    process.env.SERVER_PORT = '8080';
    process.env.REDIS_HOST = '127.0.0.1';
    process.env.REDIS_PORT = '1188';

    const config = init(new ConfigClassFieldConfig());
    expect(config.database).deep.equal({
      host: 'localhost',
      port: 8080,
    });
    expect(config.redis).deep.equal({
      host: '127.0.0.1',
      port: 1188,
    });
  });

  it('should throw an error when field is not a constructor', function () {
    @Config()
    class ErrorConfigClassFieldOfNeverConfig {
      @ConfigField()
      public error!: never;
    }
    expect(() => init(new ErrorConfigClassFieldOfNeverConfig())).throws(
      `From instance 'error' get a not support type.`,
    );
  });

  it('should throw an error when field is not a config class', function () {
    @Config()
    class ErrorConfigClassFieldOfArrayConfig {
      @ConfigField()
      public error!: Array<string>;
    }
    expect(() => init(new ErrorConfigClassFieldOfArrayConfig())).throws(
      `From instance 'error' get a not support type: 'Array'.`,
    );

    @Config()
    class ErrorConfigClassFieldOfAnyConfig {
      @ConfigField()
      public error!: any;
    }
    expect(() => init(new ErrorConfigClassFieldOfAnyConfig())).throws(
      `From instance 'error' get a not support type: 'Object'.`,
    );

    @Config()
    class DatabaseConfig {
      @ConfigField()
      @DefaultValue('localhost')
      host!: string;

      @ConfigField()
      @DefaultValue('8080')
      port!: number;
    }
    @Config()
    class ErrorConfigClassFieldOfPartialConfig {
      @ConfigField()
      public error!: Partial<DatabaseConfig>;
    }
    expect(() => init(new ErrorConfigClassFieldOfPartialConfig())).throws(
      `From instance 'error' get a not support type: 'Object'.`,
    );
  });

  it('should throw an error when config class set default value', function () {
    @Config()
    class DatabaseConfig {
      @ConfigField()
      @DefaultValue('localhost')
      host!: string;

      @ConfigField()
      @DefaultValue('8080')
      port!: number;
    }
    @Config()
    class ErrorConfigClassFieldWithDefaultValue {
      @ConfigField()
      @DefaultValue(`{ host: '127.0.0.1', port: 9090 }`)
      public database!: DatabaseConfig;
    }
    expect(() => init(new ErrorConfigClassFieldWithDefaultValue())).throws(
      `Config class field 'database' can't set default value`,
    );
  });

  it('should throw an error when config class set environment value', function () {
    @Config()
    class DatabaseConfig {
      @ConfigField()
      @DefaultValue('localhost')
      host!: string;

      @ConfigField()
      @DefaultValue('8080')
      port!: number;
    }
    @Config()
    class ErrorConfigClassFieldWithEnvValue {
      @ConfigField()
      @FromEnv('test')
      public database!: DatabaseConfig;
    }
    expect(() => init(new ErrorConfigClassFieldWithEnvValue())).throws(
      `Config class field 'database' can't set environment value`,
    );
  });
});
