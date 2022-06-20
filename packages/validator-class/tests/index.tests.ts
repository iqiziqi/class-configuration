import { expect } from 'expect';
import { Config, BaseConfig, ConfigField } from '@class-config/core';
import { IsString, IsPositive } from 'class-validator';

describe('', function () {
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
