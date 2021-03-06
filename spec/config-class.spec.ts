import { IsPositive, IsString } from 'class-validator';
import { expect } from 'expect';
import { BaseConfig, Config, ConfigField, DefaultValue, FromEnv } from '../src/main';

describe('@Config', function () {
  it('should get config class field by default values asynchronously', async function () {
    @Config()
    class DatabaseConfig extends BaseConfig {
      @ConfigField()
      @DefaultValue('localhost')
      host!: string;
      @ConfigField()
      @DefaultValue('8080')
      port!: number;
    }

    @Config()
    class RedisConfig extends BaseConfig {
      @ConfigField()
      @DefaultValue('127.0.0.1')
      host!: string;
      @ConfigField()
      @DefaultValue('1188')
      port!: number;
    }

    @Config()
    class ConfigClassFieldConfig extends BaseConfig {
      @ConfigField()
      public database!: DatabaseConfig;
      @ConfigField()
      public redis!: RedisConfig;
    }

    const config = await ConfigClassFieldConfig.initAsync<ConfigClassFieldConfig>();
    expect(config.database.host).toBe('localhost');
    expect(config.database.port).toBe(8080);
    expect(config.redis.host).toBe('127.0.0.1');
    expect(config.redis.port).toBe(1188);
  });

  it('should get config class field by default values synchronously', async function () {
    @Config()
    class DatabaseConfig extends BaseConfig {
      @ConfigField()
      @DefaultValue('localhost')
      host!: string;
      @ConfigField()
      @DefaultValue('8080')
      port!: number;
    }

    @Config()
    class RedisConfig extends BaseConfig {
      @ConfigField()
      @DefaultValue('127.0.0.1')
      host!: string;
      @ConfigField()
      @DefaultValue('1188')
      port!: number;
    }

    @Config()
    class ConfigClassFieldConfig extends BaseConfig {
      @ConfigField()
      public database!: DatabaseConfig;
      @ConfigField()
      public redis!: RedisConfig;
    }

    const config = ConfigClassFieldConfig.init<ConfigClassFieldConfig>();
    expect(config.database.host).toBe('localhost');
    expect(config.database.port).toBe(8080);
    expect(config.redis.host).toBe('127.0.0.1');
    expect(config.redis.port).toBe(1188);
  });

  it('should get config class field by environment asynchronously', async function () {
    @Config()
    class DatabaseConfig extends BaseConfig {
      @ConfigField()
      @FromEnv('SERVER_HOST')
      host!: string;
      @ConfigField()
      @FromEnv('SERVER_PORT')
      port!: number;
    }

    @Config()
    class RedisConfig extends BaseConfig {
      @ConfigField()
      @FromEnv('REDIS_HOST')
      host!: string;
      @ConfigField()
      @FromEnv('REDIS_PORT')
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

    const config = await ClassConfig.initAsync<ClassConfig>();
    expect(config.database.host).toBe('localhost');
    expect(config.database.port).toBe(8080);
    expect(config.redis.host).toBe('127.0.0.1');
    expect(config.redis.port).toBe(1188);
  });

  it('should get config class field by environment synchronously', async function () {
    @Config()
    class DatabaseConfig extends BaseConfig {
      @ConfigField()
      @FromEnv('SERVER_HOST')
      host!: string;
      @ConfigField()
      @FromEnv('SERVER_PORT')
      port!: number;
    }

    @Config()
    class RedisConfig extends BaseConfig {
      @ConfigField()
      @FromEnv('REDIS_HOST')
      host!: string;
      @ConfigField()
      @FromEnv('REDIS_PORT')
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

    const config = ClassConfig.init<ClassConfig>();
    expect(config.database.host).toBe('localhost');
    expect(config.database.port).toBe(8080);
    expect(config.redis.host).toBe('127.0.0.1');
    expect(config.redis.port).toBe(1188);
  });

  it('should throw an error when class is not a config class', async function () {
    class ErrorConfig extends BaseConfig {
      @ConfigField()
      public name!: string;
    }
    expect(ErrorConfig.initAsync<ErrorConfig>()).rejects.toThrow(`The class 'ErrorConfig' is not a config class.`);
  });

  it('should throw an error when field is not a config class', async function () {
    class DatabaseConfig {
      @ConfigField()
      public host!: string;
      @ConfigField()
      public port!: string;
    }

    @Config()
    class ErrorConfig extends BaseConfig {
      @ConfigField()
      public database!: DatabaseConfig;
    }
    expect(ErrorConfig.initAsync<ErrorConfig>()).rejects.toThrow(
      `From instance 'database' get an unsupported type: 'DatabaseConfig'.`,
    );
  });

  it('should validate the config file', async function () {
    @Config()
    class DatabaseConfig extends BaseConfig {
      @ConfigField({
        parser: () => 'localhost',
      })
      @IsString()
      public host!: string;
      @ConfigField({
        parser: () => 8080,
      })
      @IsPositive()
      public port!: number;
    }

    const databaseConfig = await DatabaseConfig.initAsync<DatabaseConfig>({
      validate: true,
    });
    expect(databaseConfig.host).toBe('localhost');
    expect(databaseConfig.port).toBe(8080);
  });

  it('should throw an error validate failed', async function () {
    @Config()
    class DatabaseConfig extends BaseConfig {
      @ConfigField({
        parser: () => 'localhost',
      })
      @IsString()
      public host!: string;
      @ConfigField({
        parser: () => '8080',
      })
      @IsPositive()
      public port!: number;
    }

    expect(
      DatabaseConfig.initAsync<DatabaseConfig>({
        validate: true,
      }),
    ).rejects.toThrow();
    expect(() => DatabaseConfig.init<DatabaseConfig>({ validate: true })).toThrow();
  });
});
