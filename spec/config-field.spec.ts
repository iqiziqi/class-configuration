import { expect } from 'chai';
import { BaseConfig, Config, ConfigField, DefaultValue, FromEnv } from '../src/main';

describe('@ConfigField', function () {
  it('should throw an error when field is an unsupported type by default parser', function () {
    @Config()
    class ArrayConfigClass extends BaseConfig {
      @ConfigField()
      public error!: Array<string>;
    }
    expect(() => ArrayConfigClass.init<ArrayConfigClass>()).throws(
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
    expect(() => ObjectConfigClass.init<ObjectConfigClass>()).throws(
      `From instance 'error' get an unsupported type: 'Object'.`,
    );
  });

  it('should throw an error when config class set default value by default parser', function () {
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
    expect(() => ErrorConfigClass.init<ErrorConfigClass>()).throws(
      `Config class field 'database' can't set default value`,
    );
  });

  it('should throw an error when config class set environment value by default parser', function () {
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
    expect(() => ErrorConfigClass.init<ErrorConfigClass>()).throws(
      `Config class field 'database' can't set environment value`,
    );
  });

  it('should get undefined value', function () {
    @Config()
    class DatabaseConfig extends BaseConfig {
      @ConfigField()
      @FromEnv()
      public host?: string;
      @ConfigField()
      @FromEnv()
      public port?: number;
    }
    const databaseConfig = DatabaseConfig.init<DatabaseConfig>();
    expect(databaseConfig.host).equal(undefined);
    expect(databaseConfig.port).equal(undefined);

    @Config()
    class RedisConfig extends BaseConfig {
      @ConfigField()
      @FromEnv()
      public host!: string;
      @ConfigField()
      @FromEnv()
      public port!: number;
    }
    const redisConfig = RedisConfig.init<RedisConfig>();
    expect(redisConfig.host).equal(undefined);
    expect(redisConfig.port).equal(undefined);
  });

  it('should get config field by customized parser', function () {
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

    const databaseConfig = DatabaseConfig.init<DatabaseConfig>();
    expect(databaseConfig.hosts).deep.equal(['192.168.0.2', '192.168.0.3', '192.168.0.4']);
    const redisConfig = RedisConfig.init<RedisConfig>();
    expect(redisConfig.server).deep.equal({ host: 'localhost', port: 8080 });
    const serverConfig = ServerConfig.init<ServerConfig>();
    expect(serverConfig.servers).deep.equal([{ host: 'localhost' }, { host: '127.0.0.1' }]);
  });

  it('should get undefined config field by customized parser', function () {
    @Config()
    class DatabaseConfig extends BaseConfig {
      @ConfigField({
        parser: (value) => value?.split(','),
      })
      public hosts?: string[];
    }

    const databaseConfig = DatabaseConfig.init<DatabaseConfig>();
    expect(databaseConfig.hosts).equal(undefined);
  });

  it('should get config field by customized parser and default parser', function () {
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

    const databaseConfig = DatabaseConfig.init<DatabaseConfig>();
    expect(databaseConfig.hosts).deep.equal(['192.168.0.2', '192.168.0.3', '192.168.0.4']);
    expect(databaseConfig.port).equal(8090);
  });

  it('should ignore the parser return type', function () {
    @Config()
    class DatabaseConfig extends BaseConfig {
      @ConfigField({
        parser: (value) => value?.split(','),
      })
      @FromEnv()
      public hosts!: string;
    }

    process.env.HOSTS = '192.168.0.2,192.168.0.3,192.168.0.4';

    const databaseConfig = DatabaseConfig.init<DatabaseConfig>();
    expect(databaseConfig.hosts).deep.equal(['192.168.0.2', '192.168.0.3', '192.168.0.4']);
  });
});
