import { expect } from 'expect';
import { BaseConfig, Config, ConfigField, DefaultValue, FromEnv } from '../src/main';

describe('@ConfigField', function () {
  it('should throw an error when field is an unsupported type by default parser', async function () {
    @Config()
    class ArrayConfigClass extends BaseConfig {
      @ConfigField()
      public error!: Array<string>;
    }
    expect(ArrayConfigClass.init<ArrayConfigClass>()).rejects.toThrow(
      `From instance 'error' get an unsupported type: 'Array'.`,
    );

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
    class ObjectConfigClass extends BaseConfig {
      @ConfigField()
      public error!: Partial<DatabaseConfig>;
    }
    expect(ObjectConfigClass.init<ObjectConfigClass>()).rejects.toThrow(
      `From instance 'error' get an unsupported type: 'Object'.`,
    );
  });

  it('should throw an error when config class set default value by default parser', async function () {
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
    class ErrorConfigClass extends BaseConfig {
      @ConfigField()
      @DefaultValue(`{ host: '127.0.0.1', port: 9090 }`)
      public database!: DatabaseConfig;
    }
    expect(ErrorConfigClass.init<ErrorConfigClass>()).rejects.toThrow(
      `Config class field 'database' can't set default value`,
    );
  });

  it('should throw an error when config class set environment value by default parser', async function () {
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
    class ErrorConfigClass extends BaseConfig {
      @ConfigField()
      @FromEnv('TEST')
      public database!: DatabaseConfig;
    }
    expect(ErrorConfigClass.init<ErrorConfigClass>()).rejects.toThrow(
      `Config class field 'database' can't set environment value`,
    );
  });

  it('should get undefined value', async function () {
    @Config()
    class DatabaseConfig extends BaseConfig {
      @ConfigField()
      @FromEnv()
      public host?: string;
      @ConfigField()
      @FromEnv()
      public port?: number;
    }
    const databaseConfig = await DatabaseConfig.init<DatabaseConfig>();
    expect(databaseConfig.host).toBe(undefined);
    expect(databaseConfig.port).toBe(undefined);

    @Config()
    class RedisConfig extends BaseConfig {
      @ConfigField()
      @FromEnv()
      public host!: string;
      @ConfigField()
      @FromEnv()
      public port!: number;
    }
    const redisConfig = await RedisConfig.init<RedisConfig>();
    expect(redisConfig.host).toBe(undefined);
    expect(redisConfig.port).toBe(undefined);
  });

  it('should get config field by customized parser', async function () {
    @Config()
    class DatabaseConfig extends BaseConfig {
      @ConfigField({
        parser: (value) => value?.split(','),
      })
      @FromEnv()
      public hosts!: string[];
    }

    @Config()
    class RedisConfig extends BaseConfig {
      @ConfigField({
        parser: (value) => (value ? JSON.parse(value) : undefined),
      })
      @FromEnv()
      public server!: { host: string; port: number };
    }

    @Config()
    class ServerConfig extends BaseConfig {
      @ConfigField({
        parser: (value) => (value ? JSON.parse(value) : undefined),
      })
      @FromEnv()
      public servers!: { host: string }[];
    }

    process.env.HOSTS = '192.168.0.2,192.168.0.3,192.168.0.4';
    process.env.SERVER = '{"host":"localhost","port":8080}';
    process.env.SERVERS = '[{"host":"localhost"},{"host":"127.0.0.1"}]';

    const databaseConfig = await DatabaseConfig.init<DatabaseConfig>();
    expect(databaseConfig.hosts).toStrictEqual(['192.168.0.2', '192.168.0.3', '192.168.0.4']);
    const redisConfig = await RedisConfig.init<RedisConfig>();
    expect(redisConfig.server).toStrictEqual({ host: 'localhost', port: 8080 });
    const serverConfig = await ServerConfig.init<ServerConfig>();
    expect(serverConfig.servers).toStrictEqual([{ host: 'localhost' }, { host: '127.0.0.1' }]);
  });

  it('should get undefined config field by customized parser', async function () {
    @Config()
    class DatabaseConfig extends BaseConfig {
      @ConfigField({
        parser: (value) => value?.split(','),
      })
      public hosts?: string[];
    }

    const databaseConfig = await DatabaseConfig.init<DatabaseConfig>();
    expect(databaseConfig.hosts).toBeUndefined();
  });

  it('should get config field by customized parser and default parser', async function () {
    @Config()
    class DatabaseConfig extends BaseConfig {
      @ConfigField({
        parser: (value) => value?.split(','),
      })
      @FromEnv()
      public hosts!: string[];

      @ConfigField()
      @FromEnv()
      public port!: number;
    }

    process.env.HOSTS = '192.168.0.2,192.168.0.3,192.168.0.4';
    process.env.PORT = '8090';

    const databaseConfig = await DatabaseConfig.init<DatabaseConfig>();
    expect(databaseConfig.hosts).toStrictEqual(['192.168.0.2', '192.168.0.3', '192.168.0.4']);
    expect(databaseConfig.port).toBe(8090);
  });

  it('should ignore the parser return type', async function () {
    @Config()
    class DatabaseConfig extends BaseConfig {
      @ConfigField({
        parser: (value) => value?.split(','),
      })
      @FromEnv()
      public hosts!: string;
    }

    process.env.HOSTS = '192.168.0.2,192.168.0.3,192.168.0.4';

    const databaseConfig = await DatabaseConfig.init<DatabaseConfig>();
    expect(databaseConfig.hosts).toStrictEqual(['192.168.0.2', '192.168.0.3', '192.168.0.4']);
  });
});
