import { expect } from 'chai';
import { Config, ConfigField, FromEnv, DefaultValue, init } from '../src/main';

process.env.SERVER_HOST = 'localhost';
process.env.SERVER_PORT = '8080';

describe('Parse string field', function () {

  @Config()
  class StringFieldConfig {
    @ConfigField()
    @FromEnv('SERVER_HOST')
    @DefaultValue('default')
    public host!: string;

    @ConfigField()
    @FromEnv('NO_STRING_VALUE')
    @DefaultValue('localhost')
    public noStringValue!: string;
  }

  it('should get string field by environments', function () {
    const config = init(new StringFieldConfig());
    expect(config.host).equal('localhost');
  });

  it('should get string field by default value', function () {
    const config = init(new StringFieldConfig());
    expect(config.noStringValue).equal('localhost');
  });
});
