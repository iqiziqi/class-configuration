import { BaseConfig, Config, ConfigField, DefaultValue, FromSource } from '@class-config/core';
import { expect } from 'expect';
import { Env } from '../src';

describe('Test load config from environment source', function () {
  it('should get config class field by environment', async function () {
    @Config()
    class DatabaseConfig extends BaseConfig {
      @ConfigField()
      @FromSource(new Env('SERVER_HOST'))
      host!: string;
      @ConfigField()
      @FromSource(new Env('SERVER_PORT'))
      port!: number;
    }

    @Config()
    class RedisConfig extends BaseConfig {
      @ConfigField()
      @FromSource(new Env('REDIS_HOST'))
      host!: string;
      @ConfigField()
      @FromSource(new Env('REDIS_PORT'))
      port!: number;
    }

    @Config()
    class ClassConfig extends BaseConfig {
      @ConfigField()
      public database!: DatabaseConfig;
      @ConfigField()
      public redis!: RedisConfig;
    }

    process.env.SERVER_HOST = 'localhost';
    process.env.SERVER_PORT = '8080';
    process.env.REDIS_HOST = '127.0.0.1';
    process.env.REDIS_PORT = '1188';

    const config = await ClassConfig.init<ClassConfig>();
    expect(config.database.host).toBe('localhost');
    expect(config.database.port).toBe(8080);
    expect(config.redis.host).toBe('127.0.0.1');
    expect(config.redis.port).toBe(1188);
  });

  it('should get number field from environment', async function () {
    @Config()
    class DatabaseConfig extends BaseConfig {
      @ConfigField()
      @FromSource(new Env('SERVER_PORT'))
      public port!: number;
    }

    @Config()
    class PriceConfig extends BaseConfig {
      @ConfigField()
      @FromSource(new Env('PRICE'))
      public price!: number;
    }

    process.env.SERVER_PORT = '8080';
    process.env.PRICE = '12.8';

    const databaseConfig = await DatabaseConfig.init<DatabaseConfig>();
    expect(databaseConfig.port).toBe(8080);
    const priceConfig = await PriceConfig.init<PriceConfig>();
    expect(priceConfig.price).toBe(12.8);
  });

  it('should get string field from environment', async function () {
    @Config()
    class DatabaseConfig extends BaseConfig {
      @ConfigField()
      @FromSource(new Env('SERVER_HOST'))
      public host!: string;
    }

    process.env.SERVER_HOST = 'localhost';

    const databaseConfig = await DatabaseConfig.init<DatabaseConfig>();
    expect(databaseConfig.host).toBe('localhost');
  });

  it('should get boolean field from environment by long string', async function () {
    @Config()
    class DatabaseConfigOne extends BaseConfig {
      @ConfigField()
      @FromSource(new Env('SERVER_1_LOGGING'))
      public logging!: boolean;

      @ConfigField()
      @FromSource(new Env('SERVER_1_PROCESS'))
      public process!: boolean;
    }

    @Config()
    class DatabaseConfigTwo extends BaseConfig {
      @ConfigField()
      @FromSource(new Env('SERVER_2_LOGGING'))
      public logging!: boolean;

      @ConfigField()
      @FromSource(new Env('SERVER_2_PROCESS'))
      public process!: boolean;
    }

    process.env.SERVER_1_LOGGING = 'false';
    process.env.SERVER_1_PROCESS = 'true';
    process.env.SERVER_2_LOGGING = 'FALSE';
    process.env.SERVER_2_PROCESS = 'TRUE';

    const config1 = await DatabaseConfigOne.init<DatabaseConfigOne>();
    expect(config1.logging).toBe(false);
    expect(config1.process).toBe(true);
    const config2 = await DatabaseConfigTwo.init<DatabaseConfigTwo>();
    expect(config2.logging).toBe(false);
    expect(config2.process).toBe(true);
  });

  it('should get boolean field from environment by short string', async function () {
    @Config()
    class DatabaseConfigOne extends BaseConfig {
      @ConfigField()
      @FromSource(new Env('SERVER_1_LOGGING'))
      public logging!: boolean;

      @ConfigField()
      @FromSource(new Env('SERVER_1_PROCESS'))
      public process!: boolean;
    }

    @Config()
    class DatabaseConfigTwo extends BaseConfig {
      @ConfigField()
      @FromSource(new Env('SERVER_2_LOGGING'))
      public logging!: boolean;

      @ConfigField()
      @FromSource(new Env('SERVER_2_PROCESS'))
      public process!: boolean;
    }

    process.env.SERVER_1_LOGGING = 'f';
    process.env.SERVER_1_PROCESS = 't';
    process.env.SERVER_2_LOGGING = 'F';
    process.env.SERVER_2_PROCESS = 'T';

    const config1 = await DatabaseConfigOne.init<DatabaseConfigOne>();
    expect(config1.logging).toBe(false);
    expect(config1.process).toBe(true);
    const config2 = await DatabaseConfigTwo.init<DatabaseConfigTwo>();
    expect(config2.logging).toBe(false);
    expect(config2.process).toBe(true);
  });

  it('should throw a error when value is not number type', async function () {
    @Config()
    class DatabaseConfig extends BaseConfig {
      @ConfigField()
      @FromSource(new Env('SERVER_PORT'))
      public prot!: number;
    }

    process.env.SERVER_PORT = 'localhost';

    expect(DatabaseConfig.init<DatabaseConfig>()).rejects.toThrow(
      `Can't convert type of '${process.env.SERVER_PORT}' to number!`,
    );
  });

  it('should throw a error when value is not boolean type', async function () {
    @Config()
    class DatabaseConfig extends BaseConfig {
      @ConfigField()
      @FromSource(new Env('LOGGING'))
      public logging!: boolean;
    }

    @Config()
    class ProcessConfig extends BaseConfig {
      @ConfigField()
      @FromSource(new Env('PROCESS'))
      public process!: boolean;
    }

    process.env.LOGGING = 'yes';
    process.env.PROCESS = 'no';

    expect(DatabaseConfig.init<DatabaseConfig>()).rejects.toThrow(
      `Can't convert type of '${process.env.LOGGING}' to boolean!`,
    );
    expect(ProcessConfig.init<ProcessConfig>()).rejects.toThrow(
      `Can't convert type of '${process.env.PROCESS}' to boolean!`,
    );
  });

  it('should get config field by default field name', async function () {
    @Config()
    class DatabaseConfig extends BaseConfig {
      @ConfigField()
      @FromSource(new Env())
      public serverName!: string;

      @ConfigField()
      @FromSource(new Env())
      public host!: string;

      @ConfigField()
      @FromSource(new Env())
      public port!: number;

      @ConfigField()
      @FromSource(new Env())
      public logging!: boolean;
    }

    process.env.SERVER_NAME = 'test';
    process.env.HOST = 'localhost';
    process.env.PORT = '8080';
    process.env.LOGGING = 'true';

    const config = await DatabaseConfig.init<DatabaseConfig>();
    expect(config.serverName).toBe('test');
    expect(config.host).toBe('localhost');
    expect(config.port).toBe(8080);
    expect(config.logging).toBe(true);
  });

  it('should be override default value', async function () {
    @Config()
    class DatabaseConfig extends BaseConfig {
      @ConfigField()
      @FromSource(new Env('HOST'))
      @DefaultValue('localhost')
      public host!: string;

      @ConfigField()
      @FromSource(new Env('PORT'))
      @DefaultValue('8080')
      public port!: number;

      @ConfigField()
      @FromSource(new Env('LOGGING'))
      @DefaultValue('true')
      public logging!: boolean;
    }

    process.env.HOST = '0.0.0.0';
    process.env.PORT = '7890';
    process.env.LOGGING = 'false';

    const databaseConfig = await DatabaseConfig.init<DatabaseConfig>();
    expect(databaseConfig.host).toBe('0.0.0.0');
    expect(databaseConfig.port).toBe(7890);
    expect(databaseConfig.logging).toBe(false);
  });

  it('should be get first available environment', async function () {
    @Config()
    class DatabaseConfig extends BaseConfig {
      @ConfigField()
      @FromSource(new Env('HOST'), new Env('SERVER_HOST'))
      @DefaultValue('localhost')
      public host!: string;
    }

    @Config()
    class RedisConfig extends BaseConfig {
      @ConfigField()
      @FromSource(new Env('FIRST_REDIS_HOST_NAME'), new Env('NEXT_REDIS_HOST_NAME'))
      @DefaultValue('9999')
      public hostName!: string;
    }

    process.env.HOST = '0.0.0.0';
    process.env.SERVER_HOST = '127.0.0.1';
    process.env.NEXT_REDIS_HOST_NAME = '9090';

    const databaseConfig = await DatabaseConfig.init<DatabaseConfig>();
    const redisConfig = await RedisConfig.init<RedisConfig>();
    expect(databaseConfig.host).toBe('0.0.0.0');
    expect(redisConfig.hostName).toBe('9090');
  });
});
