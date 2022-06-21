import { expect } from 'expect';
import { BaseConfig, Config, ConfigField, DefaultValue } from '../src';

describe('Test @Config Decorator', function () {
  it('should get config class field by default values', async function () {
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

    const config = await ConfigClassFieldConfig.init<ConfigClassFieldConfig>();
    expect(config.database.host).toBe('localhost');
    expect(config.database.port).toBe(8080);
    expect(config.redis.host).toBe('127.0.0.1');
    expect(config.redis.port).toBe(1188);
  });

  it('should throw an error when class is not a config class', async function () {
    class ErrorConfig extends BaseConfig {
      @ConfigField()
      public name!: string;
    }
    expect(ErrorConfig.init<ErrorConfig>()).rejects.toThrow(`The class 'ErrorConfig' is not a config class.`);
  });

  it('should throw an error when field is not a config class', async function () {
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
    expect(ErrorConfig.init<ErrorConfig>()).rejects.toThrow(
      `From instance 'database' get an unsupported type: 'DatabaseConfig'.`,
    );
  });
});
