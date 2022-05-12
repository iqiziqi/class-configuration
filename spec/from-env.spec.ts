import { expect } from 'chai';
import { BaseConfig, Config, ConfigField, FromEnv } from '../src/main';

describe('@FromEnv', function () {
  it('should get number field from environment', function () {
    @Config()
    class DatabaseConfig extends BaseConfig {
      @ConfigField()
      @FromEnv('SERVER_PORT')
      public port!: number;
    }

    @Config()
    class PriceConfig extends BaseConfig {
      @ConfigField()
      @FromEnv('PRICE')
      public price!: number;
    }

    process.env.SERVER_PORT = '8080';
    process.env.PRICE = '12.8';

    const databaseConfig = DatabaseConfig.init<DatabaseConfig>();
    expect(databaseConfig.port).equal(8080);
    const priceConfig = PriceConfig.init<PriceConfig>();
    expect(priceConfig.price).equal(12.8);
  });

  it('should get string field from environment', function () {
    @Config()
    class DatabaseConfig extends BaseConfig {
      @ConfigField()
      @FromEnv('SERVER_HOST')
      public host!: string;
    }

    process.env.SERVER_HOST = 'localhost';

    const databaseConfig = DatabaseConfig.init<DatabaseConfig>();
    expect(databaseConfig.host).equal('localhost');
  });

  it('should get boolean field from environment by long string', function () {
    @Config()
    class DatabaseConfigOne extends BaseConfig {
      @ConfigField()
      @FromEnv('SERVER_1_LOGGING')
      public logging!: boolean;

      @ConfigField()
      @FromEnv('SERVER_1_PROCESS')
      public process!: boolean;
    }

    @Config()
    class DatabaseConfigTwo extends BaseConfig {
      @ConfigField()
      @FromEnv('SERVER_2_LOGGING')
      public logging!: boolean;

      @ConfigField()
      @FromEnv('SERVER_2_PROCESS')
      public process!: boolean;
    }

    process.env.SERVER_1_LOGGING = 'false';
    process.env.SERVER_1_PROCESS = 'true';
    process.env.SERVER_2_LOGGING = 'FALSE';
    process.env.SERVER_2_PROCESS = 'TRUE';

    const config1 = DatabaseConfigOne.init<DatabaseConfigOne>();
    expect(config1.logging).equal(false);
    expect(config1.process).equal(true);
    const config2 = DatabaseConfigTwo.init<DatabaseConfigTwo>();
    expect(config2.logging).equal(false);
    expect(config2.process).equal(true);
  });

  it('should get boolean field from environment by short string', function () {
    @Config()
    class DatabaseConfigOne extends BaseConfig {
      @ConfigField()
      @FromEnv('SERVER_1_LOGGING')
      public logging!: boolean;

      @ConfigField()
      @FromEnv('SERVER_1_PROCESS')
      public process!: boolean;
    }

    @Config()
    class DatabaseConfigTwo extends BaseConfig {
      @ConfigField()
      @FromEnv('SERVER_2_LOGGING')
      public logging!: boolean;

      @ConfigField()
      @FromEnv('SERVER_2_PROCESS')
      public process!: boolean;
    }

    process.env.SERVER_1_LOGGING = 'f';
    process.env.SERVER_1_PROCESS = 't';
    process.env.SERVER_2_LOGGING = 'F';
    process.env.SERVER_2_PROCESS = 'T';

    const config1 = DatabaseConfigOne.init<DatabaseConfigOne>();
    expect(config1.logging).equal(false);
    expect(config1.process).equal(true);
    const config2 = DatabaseConfigTwo.init<DatabaseConfigTwo>();
    expect(config2.logging).equal(false);
    expect(config2.process).equal(true);
  });

  it('should throw a error when value is not number type', function () {
    @Config()
    class DatabaseConfig extends BaseConfig {
      @ConfigField()
      @FromEnv('SERVER_PORT')
      public prot!: number;
    }

    process.env.SERVER_PORT = 'localhost';

    expect(() => DatabaseConfig.init<DatabaseConfig>()).throws(
      `Can't convert type of '${process.env.SERVER_PORT}' to number!`,
    );
  });

  it('should throw a error when value is not number type', function () {
    @Config()
    class DatabaseConfig extends BaseConfig {
      @ConfigField()
      @FromEnv('SERVER_PORT')
      public prot!: number;
    }

    process.env.SERVER_PORT = 'localhost';

    expect(() => DatabaseConfig.init<DatabaseConfig>()).throws(
      `Can't convert type of '${process.env.SERVER_PORT}' to number!`,
    );
  });

  it('should throw a error when value is not boolean type', function () {
    @Config()
    class DatabaseConfig extends BaseConfig {
      @ConfigField()
      @FromEnv('LOGGING')
      public logging!: boolean;
    }

    @Config()
    class ProcessConfig extends BaseConfig {
      @ConfigField()
      @FromEnv('PROCESS')
      public process!: boolean;
    }

    process.env.LOGGING = 'yes';
    process.env.PROCESS = 'no';

    expect(() => DatabaseConfig.init<DatabaseConfig>()).throws(
      `Can't convert type of '${process.env.LOGGING}' to boolean!`,
    );
    expect(() => ProcessConfig.init<ProcessConfig>()).throws(
      `Can't convert type of '${process.env.PROCESS}' to boolean!`,
    );
  });

  it('should get config field by default field name', function () {
    @Config()
    class DatabaseConfig extends BaseConfig {
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

    process.env.SERVER_NAME = 'test';
    process.env.HOST = 'localhost';
    process.env.PORT = '8080';
    process.env.LOGGING = 'true';

    const config = DatabaseConfig.init<DatabaseConfig>();
    expect(config.serverName).equal('test');
    expect(config.host).equal('localhost');
    expect(config.port).equal(8080);
    expect(config.logging).equal(true);
  });
});
