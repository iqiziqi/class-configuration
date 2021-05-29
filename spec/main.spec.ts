import { describe, it } from 'mocha';
import { expect } from 'chai';
import { ConfigField, init } from "../src/main";

class StringFieldConfig {
  @ConfigField({ env: 'SERVER_HOST', default: 'localhost' })
  public host!: string;
}

class NumberFieldConfig {
  @ConfigField({ env: 'SERVER_PORT', default: 8080 })
  public port!: number;
}

class BooleanFieldConfig {
  @ConfigField({ env: 'SERVER_START', default: false })
  public start!: boolean;
}

describe('config', function () {
  it('should get string field', function () {
    const config = init(new StringFieldConfig());
    expect(config.host).equal('localhost');
  });

  it('should get number field', function () {
    const config = init(new NumberFieldConfig());
    expect(config.port).equal(8080);
  });

  it('should get boolean field', function () {
    const config = init(new BooleanFieldConfig());
    expect(config.start).equal(false);
  });
});
