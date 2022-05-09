import { expect } from 'chai';
import { Config, ConfigField, FromEnv, DefaultValue, init } from '../src/main';

describe('@FromEnv', function () {
  it('should get number field from environment', function () {
    process.env.SERVER_PORT = '8080';
    process.env.PRICE = '12.8';

    @Config()
    class DatabaseConfig {
      @ConfigField()
      @FromEnv('SERVER_PORT')
      public port!: number;
    }

    @Config()
    class PriceConfig {
      @ConfigField()
      @FromEnv('PRICE')
      public price!: number;
    }

    const databaseConfig = init(new DatabaseConfig());
    expect(databaseConfig.port).equal(8080);
    const priceConfig = init(new PriceConfig());
    expect(priceConfig.price).equal(12.8);
  });

  it('should get string field from environment', function () {
    process.env.SERVER_HOST = 'localhost';

    @Config()
    class DatabaseConfig {
      @ConfigField()
      @FromEnv('SERVER_HOST')
      public host!: string;
    }

    const databaseConfig = init(new DatabaseConfig());
    expect(databaseConfig.host).equal('localhost');
  });

  it('should get boolean field from environment by long string', function () {
    process.env.SERVER_1_LOGGING = 'false';
    process.env.SERVER_1_PROCESS = 'true';
    process.env.SERVER_2_LOGGING = 'FALSE';
    process.env.SERVER_2_PROCESS = 'TRUE';

    @Config()
    class DatabaseConfigOne {
      @ConfigField()
      @FromEnv('SERVER_1_LOGGING')
      public logging!: boolean;

      @ConfigField()
      @FromEnv('SERVER_1_PROCESS')
      public process!: boolean;
    }

    @Config()
    class DatabaseConfigTwo {
      @ConfigField()
      @FromEnv('SERVER_2_LOGGING')
      public logging!: boolean;

      @ConfigField()
      @FromEnv('SERVER_2_PROCESS')
      public process!: boolean;
    }

    const config1 = init(new DatabaseConfigOne());
    expect(config1.logging).equal(false);
    expect(config1.process).equal(true);
    const config2 = init(new DatabaseConfigTwo());
    expect(config2.logging).equal(false);
    expect(config2.process).equal(true);
  });

  it('should get boolean field from environment by short string', function () {
    process.env.SERVER_1_LOGGING = 'f';
    process.env.SERVER_1_PROCESS = 't';
    process.env.SERVER_2_LOGGING = 'F';
    process.env.SERVER_2_PROCESS = 'T';

    @Config()
    class DatabaseConfigOne {
      @ConfigField()
      @FromEnv('SERVER_1_LOGGING')
      public logging!: boolean;

      @ConfigField()
      @FromEnv('SERVER_1_PROCESS')
      public process!: boolean;
    }

    @Config()
    class DatabaseConfigTwo {
      @ConfigField()
      @FromEnv('SERVER_2_LOGGING')
      public logging!: boolean;

      @ConfigField()
      @FromEnv('SERVER_2_PROCESS')
      public process!: boolean;
    }

    const config1 = init(new DatabaseConfigOne());
    expect(config1.logging).equal(false);
    expect(config1.process).equal(true);
    const config2 = init(new DatabaseConfigTwo());
    expect(config2.logging).equal(false);
    expect(config2.process).equal(true);
  });

  it('should throw a error when value is not number type', function () {
    process.env.SERVER_PORT = 'localhost';

    @Config()
    class DatabaseConfig {
      @ConfigField()
      @FromEnv('SERVER_PORT')
      public prot!: number;
    }

    expect(() => init(new DatabaseConfig())).throws(`Can't convert type of '${process.env.SERVER_PORT}' to number!`);
  });

  it('should throw a error when value is not number type', function () {
    process.env.SERVER_PORT = 'localhost';

    @Config()
    class DatabaseConfig {
      @ConfigField()
      @FromEnv('SERVER_PORT')
      public prot!: number;
    }

    expect(() => init(new DatabaseConfig())).throws(`Can't convert type of '${process.env.SERVER_PORT}' to number!`);
  });

  it('should throw a error when value is not boolean type', function () {
    process.env.LOGGING = 'yes';
    process.env.PROCESS = 'no';

    @Config()
    class DatabaseConfig {
      @ConfigField()
      @FromEnv('LOGGING')
      public logging!: boolean;
    }

    @Config()
    class ProcessConfig {
      @ConfigField()
      @FromEnv('PROCESS')
      public process!: boolean;
    }

    expect(() => init(new DatabaseConfig())).throws(`Can't convert type of '${process.env.LOGGING}' to boolean!`);
    expect(() => init(new ProcessConfig())).throws(`Can't convert type of '${process.env.PROCESS}' to boolean!`);
  });

  it('should get config field by default field name', function () {
    process.env.SERVER_NAME = 'test';
    process.env.HOST = 'localhost';
    process.env.PORT = '8080';
    process.env.LOGGING = 'true';

    @Config()
    class DatabaseConfig {
      @ConfigField()
      @FromEnv()
      public serverName!: string;

      @ConfigField()
      @FromEnv()
      public host!: string;

      @ConfigField()
      @FromEnv()
      public port!: number;

      @ConfigField()
      @FromEnv()
      public logging!: boolean;
    }

    const config = init(new DatabaseConfig());
    expect(config.serverName).equal('test');
    expect(config.host).equal('localhost');
    expect(config.port).equal(8080);
    expect(config.logging).equal(true);
  });
});
