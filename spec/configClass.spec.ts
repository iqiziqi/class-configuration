import { expect } from 'chai';
import { Config, ConfigItem, DefaultValue, FromEnv, init } from '../src/main';

describe('Parse config class field', function () {

  @Config()
  class DatabaseConfig {
    @ConfigItem()
    @DefaultValue('localhost')
    host!: string;

    @ConfigItem()
    @DefaultValue(8080)
    port!: number;
  }

  @Config()
  class ConfigClassFieldConfig {
    @ConfigItem()
    public database!: DatabaseConfig;
  }

  @Config()
  class ErrorConfigClassFieldOfAnyConfig {
    @ConfigItem()
    public error!: any;
  }

  @Config()
  class ErrorConfigClassFieldOfNeverConfig {
    @ConfigItem()
    public error!: never;
  }

  @Config()
  class ErrorConfigClassFieldOfArrayConfig {
    @ConfigItem()
    public error!: Array<string>;
  }

  @Config()
  class ErrorConfigClassFieldOfPartialConfig {
    @ConfigItem()
    public error!: Partial<DatabaseConfig>;
  }

  @Config()
  class ErrorConfigClassFieldWithDefaultValue {
    @ConfigItem()
    @DefaultValue({
      host: '127.0.0.1',
      port: 9090,
    })
    public database!: DatabaseConfig;
  }

  @Config()
  class ErrorConfigClassFieldWithEnvValue {
    @ConfigItem()
    @FromEnv('test')
    public database!: DatabaseConfig;
  }

  it('should get config class field', function () {
    const config = init(new ConfigClassFieldConfig());
    expect(config.database).deep.equal({
      host: 'localhost',
      port: 8080,
    });
  });

  it('should throw an error when field is not a constructor', function () {
    expect(() => init(new ErrorConfigClassFieldOfNeverConfig())).throws(
      `From instance 'error' get a not support type.`,
    );
  });

  it('should throw an error when field is not a config class', function () {
    expect(() => init(new ErrorConfigClassFieldOfArrayConfig())).throws(
      `From instance 'error' get a not support type: 'Array'.`,
    );
    expect(() => init(new ErrorConfigClassFieldOfAnyConfig())).throws(
      `From instance 'error' get a not support type: 'Object'.`,
    );
    expect(() => init(new ErrorConfigClassFieldOfPartialConfig())).throws(
      `From instance 'error' get a not support type: 'Object'.`,
    );
  });

  it('should throw an error when config class set default value', function () {
    expect(() => init(new ErrorConfigClassFieldWithDefaultValue())).throws(
      `Config class field 'database' can't set default value`,
    );
  });

  it('should throw an error when config class set environment value', function () {
    expect(() => init(new ErrorConfigClassFieldWithEnvValue())).throws(
      `Config class field 'database' can't set environment value`,
    );
  });
});
