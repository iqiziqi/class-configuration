import { expect } from 'chai';
import { ConfigItem, DefaultValue, init } from '../src/main';

describe('Parse config class field', function () {
  class DatabaseConfig {
    @ConfigItem()
    @DefaultValue('localhost')
    host!: string;
    @ConfigItem()
    @DefaultValue(8080)
    port!: number;
  }

  class ConfigClassFieldConfig {
    @ConfigItem()
    public database!: DatabaseConfig;
  }

  class ErrorConfigClassFieldConfig {
    @ConfigItem()
    public error!: never;
  }

  it('should get config class field', function () {
    const config = init(new ConfigClassFieldConfig());
    expect(config.database).deep.equal({
      host: 'localhost',
      port: 8080,
    });
  });

  it('should throw an error when field is not a constructor', function () {
    expect(() => init(new ErrorConfigClassFieldConfig())).throws('Get the type of not support!');
  });
});
