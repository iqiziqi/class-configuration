import { expect } from 'chai';
import { BaseConfig, Config, ConfigField, DefaultValue, FromEnv } from '../src/main';

describe('@DefaultValue', function () {
  it('should get default field', function () {
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

    const config = DatabaseConfig.init<DatabaseConfig>();
    expect(config.host).equal('localhost');
    expect(config.port).equal(8080);
    expect(config.logging).equal(true);
  });

  it('should throw a error when value is not number type', function () {
    @Config()
    class ErrorNumberConfig extends BaseConfig {
      @ConfigField()
      @DefaultValue('12.a')
      public notNumberType!: number;
    }

    expect(() => ErrorNumberConfig.init<ErrorNumberConfig>()).throws(`Can't convert type of '12.a' to number!`);
  });

  it('should throw a error when value is not boolean type', function () {
    @Config()
    class ErrorBoolConfig extends BaseConfig {
      @ConfigField()
      @DefaultValue('yes')
      public notBoolValue!: boolean;
    }

    expect(() => ErrorBoolConfig.init<ErrorBoolConfig>()).throws(`Can't convert type of 'yes' to boolean!`);
  });

  it('should be override by environment', function () {
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

    const databaseConfig = DatabaseConfig.init<DatabaseConfig>();
    expect(databaseConfig.host).equal('0.0.0.0');
    expect(databaseConfig.port).equal(7890);
    expect(databaseConfig.logging).equal(false);
  });
});
