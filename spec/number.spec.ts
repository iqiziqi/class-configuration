import { expect } from 'chai';
import { ConfigItem, FromEnv, DefaultValue, init } from '../src/main';

process.env.SERVER_HOST = 'localhost';
process.env.SERVER_PORT = '8080';
process.env.NOT_NUMBER_VALUE = 'test';

describe('Parse number field', function () {
  class NumberFieldConfig {
    @ConfigItem()
    @FromEnv('SERVER_PORT')
    @DefaultValue(1000)
    public port!: number;

    @ConfigItem()
    @FromEnv('NO_NUMBER_VALUE')
    @DefaultValue(8080)
    public noNumberValue!: number;
  }

  class ErrorNumberConfig {
    @ConfigItem()
    @FromEnv('NOT_NUMBER_VALUE')
    @DefaultValue(12)
    public notNumberType!: number;
  }

  it('should get number field by environments', function () {
    const config = init(new NumberFieldConfig());
    expect(config.port).equal(8080);
  });

  it('should get number field by default value', function () {
    const config = init(new NumberFieldConfig());
    expect(config.noNumberValue).equal(8080);
  });

  it('should throw a error when value is not number type', function () {
    expect(() => init(new ErrorNumberConfig())).throws(
      `Can't convert type of '${process.env.NOT_NUMBER_VALUE}' to number!`,
    );
  });
});
