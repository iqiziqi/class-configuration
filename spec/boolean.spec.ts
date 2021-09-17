import { expect } from 'chai';
import { ConfigItem, FromEnv, DefaultValue, init } from '../src/main';

process.env.LONG_BOOL_TRUE = 'true';
process.env.SHORT_BOOL_TRUE = 't';
process.env.LONG_BOOL_FALSE = 'FALSE';
process.env.SHORT_BOOL_FALSE = 'f';
process.env.NOT_BOOL_VALUE = 'test';

describe('Parse boolean field', function () {

  class BooleanFieldConfig {
    @ConfigItem()
    @FromEnv('NO_BOOL_VALUE')
    @DefaultValue(false)
    public noBoolValue!: boolean;

    @ConfigItem()
    @FromEnv('LONG_BOOL_TRUE')
    @DefaultValue(false)
    public longBoolTrue!: boolean;

    @ConfigItem()
    @FromEnv('SHORT_BOOL_TRUE')
    @DefaultValue(false)
    public shortBoolTrue!: boolean;

    @ConfigItem()
    @FromEnv('LONG_BOOL_FALSE')
    @DefaultValue(true)
    public longBoolFalse!: boolean;

    @ConfigItem()
    @FromEnv('SHORT_BOOL_FALSE')
    @DefaultValue(true)
    public shortBoolFalse!: boolean;
  }

  class ErrorBoolConfig {
    @ConfigItem()
    @FromEnv('NOT_BOOL_VALUE')
    @DefaultValue(true)
    public notBoolValue!: boolean;
  }

  it('should get boolean field by long string', function () {
    const config = init(new BooleanFieldConfig());
    expect(config.longBoolTrue).equal(true);
    expect(config.longBoolFalse).equal(false);
  });

  it('should get boolean field by short string', function () {
    const config = init(new BooleanFieldConfig());
    expect(config.shortBoolTrue).equal(true);
    expect(config.shortBoolFalse).equal(false);
  });

  it('should get boolean field by default value', function () {
    const config = init(new BooleanFieldConfig());
    expect(config.noBoolValue).equal(false);
  });

  it('should throw a error when value is not boolean type', function () {
    expect(() => init(new ErrorBoolConfig())).throws(
      `Can't convert type of '${process.env.NOT_BOOL_VALUE}' to boolean!`,
    );
  });
});
