import { expect } from 'expect';
import { Config, BaseConfig, ConfigField } from '@class-config/core';
import { IsString, IsPositive, IsInstance, ValidateNested, IsNumber } from 'class-validator';
import { ClassValidator } from '../src';

describe('Test validate config class', function () {
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

    const databaseConfig = await DatabaseConfig.init<DatabaseConfig>({
      validator: new ClassValidator(),
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

    expect(DatabaseConfig.init<DatabaseConfig>({ validator: new ClassValidator() })).rejects.toThrow(
      'port must be a positive number',
    );
  });

  it('should throw an error validate failed with nested object', async function () {
    @Config()
    class DatabaseConfig extends BaseConfig {
      @ConfigField({
        parser: () => 'localhost',
      })
      @IsNumber()
      public host!: number;
      @ConfigField({
        parser: () => '8080',
      })
      @IsPositive()
      public port!: number;
    }

    @Config()
    class Configuration extends BaseConfig {
      @ConfigField()
      @IsInstance(DatabaseConfig)
      @ValidateNested()
      public database!: DatabaseConfig;
    }

    expect(Configuration.init<Configuration>({ validator: new ClassValidator() })).rejects.toThrow(
      `database.host must be a number conforming to the specified constraints
      database.port must be a positive number`,
    );
  });
});
