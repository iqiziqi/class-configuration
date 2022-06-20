import { expect } from 'expect';
import { BaseConfig, Config, ConfigField, DefaultValue } from '../src';

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

    const config = await DatabaseConfig.initAsync<DatabaseConfig>();
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

    expect(ErrorNumberConfig.initAsync<ErrorNumberConfig>()).rejects.toThrow(`Can't convert type of '12.a' to number!`);
  });

  it('should throw a error when value is not boolean type', async function () {
    @Config()
    class ErrorBoolConfig extends BaseConfig {
      @ConfigField()
      @DefaultValue('yes')
      public notBoolValue!: boolean;
    }

    expect(ErrorBoolConfig.initAsync<ErrorBoolConfig>()).rejects.toThrow(`Can't convert type of 'yes' to boolean!`);
  });
});
