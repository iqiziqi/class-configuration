import { expect } from 'expect';
import { BaseConfig, Config, ConfigField, DefaultValue, FromEnv } from '../src/main';

describe('@DefaultValue', function () {
  it('should get default field', async function () {
    @Config()
    class DatabaseConfig extends BaseConfig {
      @ConfigField()
      @DefaultValue('localhost')
      public host!: string;

      @ConfigField()
      @DefaultValue('8080')
      public port!: number;

      @ConfigField()
      @DefaultValue('true')
      public logging!: boolean;
    }

    process.env.SERVER_PORT = '8080';

    const config = await DatabaseConfig.init<DatabaseConfig>();
    expect(config.host).toBe('localhost');
    expect(config.port).toBe(8080);
    expect(config.logging).toBe(true);
  });

  it('should throw a error when value is not number type', async function () {
    @Config()
    class ErrorNumberConfig extends BaseConfig {
      @ConfigField()
      @DefaultValue('12.a')
      public notNumberType!: number;
    }

    expect(ErrorNumberConfig.init<ErrorNumberConfig>()).rejects.toThrow(`Can't convert type of '12.a' to number!`);
  });

  it('should throw a error when value is not boolean type', async function () {
    @Config()
    class ErrorBoolConfig extends BaseConfig {
      @ConfigField()
      @DefaultValue('yes')
      public notBoolValue!: boolean;
    }

    expect(ErrorBoolConfig.init<ErrorBoolConfig>()).rejects.toThrow(`Can't convert type of 'yes' to boolean!`);
  });

  it('should be override by environment', async function () {
    @Config()
    class DatabaseConfig extends BaseConfig {
      @ConfigField()
      @FromEnv('HOST')
      @DefaultValue('localhost')
      public host!: string;

      @ConfigField()
      @FromEnv('PORT')
      @DefaultValue('8080')
      public port!: number;

      @ConfigField()
      @FromEnv('LOGGING')
      @DefaultValue('true')
      public logging!: boolean;
    }

    process.env.HOST = '0.0.0.0';
    process.env.PORT = '7890';
    process.env.LOGGING = 'false';

    const databaseConfig = await DatabaseConfig.init<DatabaseConfig>();
    expect(databaseConfig.host).toBe('0.0.0.0');
    expect(databaseConfig.port).toBe(7890);
    expect(databaseConfig.logging).toBe(false);
  });
});
