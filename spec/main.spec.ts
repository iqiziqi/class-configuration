import { describe, it } from 'mocha';
import { expect } from 'chai';
import { DefaultValue, FromEnv, init } from '../src/main';

process.env.SERVER_HOST = 'localhost';
process.env.SERVER_PORT = '8080';

process.env.LONG_BOOL_TRUE = 'true';
process.env.SHORT_BOOL_TRUE = 't';
process.env.LONG_BOOL_FALSE = 'FALSE';
process.env.SHORT_BOOL_FALSE = 'f';

process.env.NOT_NUMBER_VALUE = 'test';
process.env.NOT_BOOL_VALUE = 'test';

class StringFieldConfig {
  @FromEnv('SERVER_HOST')
  @DefaultValue('default')
  public host!: string;

  @FromEnv('NO_STRING_VALUE')
  @DefaultValue('localhost')
  public noStringValue!: string;
}

class NumberFieldConfig {
  @FromEnv('SERVER_PORT')
  @DefaultValue(1000)
  public port!: number;

  @FromEnv('NO_NUMBER_VALUE')
  @DefaultValue(8080)
  public noNumberValue!: number;
}

class BooleanFieldConfig {
  @FromEnv('NO_BOOL_VALUE')
  @DefaultValue(false)
  public noBoolValue!: boolean;

  @FromEnv('LONG_BOOL_TRUE')
  @DefaultValue(false)
  public longBoolTrue!: boolean;

  @FromEnv('SHORT_BOOL_TRUE')
  @DefaultValue(false)
  public shortBoolTrue!: boolean;

  @FromEnv('LONG_BOOL_FALSE')
  @DefaultValue(true)
  public longBoolFalse!: boolean;

  @FromEnv('SHORT_BOOL_FALSE')
  @DefaultValue(true)
  public shortBoolFalse!: boolean;
}

class ErrorNumberConfig {
  @FromEnv('NOT_NUMBER_VALUE')
  @DefaultValue(12)
  public notNumberType!: number;
}

class ErrorBoolConfig {
  @FromEnv('NOT_BOOL_VALUE')
  @DefaultValue(true)
  public notBoolValue!: boolean;
}

class NoDefaultConfig {
  @FromEnv('NO_DEFAULT_VALUE')
  public noDefaultValue!: string;
}

class NotDefaultConfig {
  @FromEnv('NOT_SUPPORTED_TYPE')
  @DefaultValue(Symbol('not-support'))
  public noDefaultValue!: Symbol;
}

describe('config', function () {
  it('should get string field by environments', function () {
    const config = init(new StringFieldConfig());
    expect(config.host).equal('localhost');
  });

  it('should get string field by default value', function () {
    const config = init(new StringFieldConfig());
    expect(config.noStringValue).equal('localhost');
  });

  it('should get number field by environments', function () {
    const config = init(new NumberFieldConfig());
    expect(config.port).equal(8080);
  });

  it('should get number field by default value', function () {
    const config = init(new NumberFieldConfig());
    expect(config.noNumberValue).equal(8080);
  });

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

  it('should throw a error when value is not number type', function () {
    expect(() => init(new ErrorNumberConfig())).throws(
      `Can't convert type of '${process.env.NOT_NUMBER_VALUE}' to number!`,
    );
  });

  it('should throw a error when value is not boolean type', function () {
    expect(() => init(new ErrorBoolConfig())).throws(
      `Can't convert type of '${process.env.NOT_BOOL_VALUE}' to boolean!`,
    );
  });

  it('should throw a error when value is not default value', function () {
    expect(() => init(new NoDefaultConfig())).throws(
      `Can't find default value!`,
    );
  });

  it('should throw a error when value type is not supported', function () {
    expect(() => init(new NotDefaultConfig())).throws(
      `Get the type of not support!`,
    );
  });
});
