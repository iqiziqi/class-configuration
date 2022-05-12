import { expect } from 'chai';
import { BaseConfig, Config, ConfigField, DefaultValue, FromEnv } from '../src/main';

describe('@Config', function () {
  it('should get config class field by default values', function () {
    @Config()
    class DatabaseConfig extends BaseConfig {
      @ConfigField()
      @DefaultValue('localhost')
      host!: string;
      @ConfigField()
      @DefaultValue('8080')
      port!: number;
    }

    @Config()
    class RedisConfig extends BaseConfig {
      @ConfigField()
      @DefaultValue('127.0.0.1')
      host!: string;
      @ConfigField()
      @DefaultValue('1188')
      port!: number;
    }

    @Config()
    class ConfigClassFieldConfig extends BaseConfig {
      @ConfigField()
      public database!: DatabaseConfig;
      @ConfigField()
      public redis!: RedisConfig;
    }

    const config = ConfigClassFieldConfig.init<ConfigClassFieldConfig>();
    expect(config.database.host).equal('localhost');
    expect(config.database.port).equal(8080);
    expect(config.redis.host).equal('127.0.0.1');
    expect(config.redis.port).equal(1188);
  });

  it('should get config class field by environment', function () {
    @Config()
    class DatabaseConfig extends BaseConfig {
      @ConfigField()
      @FromEnv('SERVER_HOST')
      host!: string;
      @ConfigField()
      @FromEnv('SERVER_PORT')
      port!: number;
    }

    @Config()
    class RedisConfig extends BaseConfig {
      @ConfigField()
      @FromEnv('REDIS_HOST')
      host!: string;
      @ConfigField()
      @FromEnv('REDIS_PORT')
      port!: number;
    }

    @Config()
    class ClassConfig extends BaseConfig {
      @ConfigField()
      public database!: DatabaseConfig;
      @ConfigField()
      public redis!: RedisConfig;
    }

    process.env.SERVER_HOST = 'localhost';
    process.env.SERVER_PORT = '8080';
    process.env.REDIS_HOST = '127.0.0.1';
    process.env.REDIS_PORT = '1188';

    const config = ClassConfig.init<ClassConfig>();
    expect(config.database.host).equal('localhost');
    expect(config.database.port).equal(8080);
    expect(config.redis.host).equal('127.0.0.1');
    expect(config.redis.port).equal(1188);
  });

  it('should throw an error when class is not a config class', function () {
    class ErrorConfig extends BaseConfig {
      @ConfigField()
      public name!: string;
    }
    expect(() => ErrorConfig.init<ErrorConfig>()).throw(`The class 'ErrorConfig' is not a config class.`);
  });

  it('should throw an error when field is not a config class', function () {
    class DatabaseConfig {
      @ConfigField()
      public host!: string;
      @ConfigField()
      public port!: string;
    }

    @Config()
    class ErrorConfig extends BaseConfig {
      @ConfigField()
      public database!: DatabaseConfig;
    }
    expect(() => ErrorConfig.init<ErrorConfig>()).throw(
      `From instance 'database' get an unsupported type: 'DatabaseConfig'.`,
    );
  });
});
