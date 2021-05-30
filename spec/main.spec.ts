import { describe, it } from 'mocha';
import { expect } from 'chai';
import { ConfigField, init } from "../src/main";

process.env.SERVER_HOST = 'localhost';
process.env.SERVER_PORT = '8080';

process.env.LONG_BOOL_TRUE = 'true';
process.env.SHORT_BOOL_TRUE = 't';
process.env.LONG_BOOL_FALSE = 'FALSE';
process.env.SHORT_BOOL_FALSE = 'f';

process.env.NOT_NUMBER_VALUE = 'test';
process.env.NOT_BOOL_VALUE = 'test';

class StringFieldConfig {
  @ConfigField({ env: 'SERVER_HOST', default: 'default' })
  public host!: string;

  @ConfigField({ env: 'NO_STRING_VALUE', default: 'localhost' })
  public noStringValue!: string;
}

class NumberFieldConfig {
  @ConfigField({ env: 'SERVER_PORT', default: 1000 })
  public port!: number;

  @ConfigField({ env: 'NO_NUMBER_VALUE', default: 8080 })
  public noNumberValue!: number;
}

class BooleanFieldConfig {
  @ConfigField({ env: 'NO_BOOL_VALUE', default: false })
  public noBoolValue!: boolean;

  @ConfigField({ env: 'LONG_BOOL_TRUE', default: false })
  public longBoolTrue!: boolean;

  @ConfigField({ env: 'SHORT_BOOL_TRUE', default: false })
  public shortBoolTrue!: boolean;

  @ConfigField({ env: 'LONG_BOOL_FALSE', default: true })
  public longBoolFalse!: boolean;

  @ConfigField({ env: 'SHORT_BOOL_FALSE', default: true })
  public shortBoolFalse!: boolean;
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
    expect(() => {
      class ErrorNumberConfig {
        @ConfigField({ env: 'NOT_NUMBER_VALUE', default: 12 })
        public notNumberType!: number;
      }
    }).throws(`Can't convert type of '${process.env.NOT_NUMBER_VALUE}' to number!`);
  });

  it('should throw a error when value is not boolean type', function () {
    expect(() => {
      class ErrorBoolConfig {
        @ConfigField({ env: 'NOT_BOOL_VALUE', default: true })
        public notBoolValue!: boolean;
      }
    }).throws(`Can't convert type of '${process.env.NOT_BOOL_VALUE}' to boolean!`);
  });

  it('should throw a error when value is not default value', function () {
    expect(() => {
      class NoDefaultConfig {
        @ConfigField({ env: 'NO_DEFAULT_VALUE '})
        public noDefaultValue!: string;
      }
    }).throws(`Can't find default value!`);
  });

  it('should throw a error when value type is not supported', function () {
    expect(() => {
      class NoDefaultConfig {
        @ConfigField({ env: 'NOT_SUPPORTED_TYPE', default: Symbol('not-support') })
        public noDefaultValue!: Symbol;
      }
    }).throws(`Get the type of not support!`);
  });
});
