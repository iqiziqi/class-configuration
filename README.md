# Class-Configuration

![test](https://github.com/iqiziqi/class-configuration/actions/workflows/test.yml/badge.svg)
[![codecov](https://codecov.io/gh/iqiziqi/class-configuration/branch/dev/graph/badge.svg?token=LL7I9PEF0Y)](https://codecov.io/gh/iqiziqi/class-configuration)

The config package to define and read the configuration

## Prepare

This package just support **Typescript**.

You should install `reflect-metadata` package. And set follow code on `tsconfig.json`.

```json
// tsconfig.json
{
  "compilerOptions": {
    ...
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true,
    ...
  }
}
```

## Usage

### Define a config class

First, You can use `@Config` define your configuration class. Next, use `@ConfigField` defined a configuration field.

```ts
import 'reflect-metadata';
import { BaseConfig, Config, ConfigField, DefaultValue, FromEnv, init } from 'class-configuration';

@Config()
class Configuration extends BaseConfig {
  /**
   * The server host
   */
  @ConfigField()
  public host!: string;

  /**
   * The server port
   */
  @ConfigField()
  public port!: number;
}
```

### Load config with environment

You can use `@FromEnv` load config field from environment.

For example:

```ts
import 'reflect-metadata';
import { BaseConfig Config, ConfigField, DefaultValue, FromEnv } from 'class-configuration';

process.env.SERVER_HOST = 'localhost';
process.env.SERVER_PORT = '8080';

@Config()
class Configuration extends BaseConfig {
  /**
   * The server host
   */
  @ConfigField()
  @FromEnv('SERVER_HOST')
  public host!: string;

  /**
   * The server port
   */
  @ConfigField()
  @FromEnv('SERVER_PORT')
  public port!: number;
}

// configuration = { "host": "localhost", "port": 8080 }
const configuration = await Configuration.init<Configuration>();
```

If have no params set, Will use field name.

```ts
import 'reflect-metadata';
import { BaseConfig, Config, ConfigField, DefaultValue, FromEnv } from 'class-configuration';

process.env.SERVER_HOST = 'localhost';
process.env.SERVER_PORT = '8080';

@Config()
class Configuration {
  /**
   * The server host
   */
  @ConfigField()
  @FromEnv()  // Will load environment by name 'SERVER_HOST'
  public serverHost!: string;

  /**
   * The server port
   */
  @ConfigField()
  @FromEnv()   // Will load environment by name 'SERVER_PORT'
  public serverPort!: number;
}

// configuration = { "host": "localhost", "port": 8080 }
const configuration = await Configuration.init<Configuration>();
```

### Load config with default value

You can use `@DefaultValue` load config field by default value.

For example:

```ts
import 'reflect-metadata';
import { BaseConfig, Config, ConfigField, DefaultValue, FromEnv } from 'class-configuration';

@Config()
class Configuration extends BaseConfig {
  /**
   * The server host
   */
  @ConfigField()
  @DefaultValue('localhost')
  public host!: string;

  /**
   * The server port
   */
  @ConfigField()
  @DefaultValue(8080)
  public port!: number;
}

// configuration = { "host": "localhost", "port": 8080 }
const configuration = await Configuration.init<Configuration>();
```

### Basic

```ts
import 'reflect-metadata';
import { BaseConfig, Config, ConfigField, DefaultValue, FromEnv } from 'class-configuration';

@Config()
class Configuration extends BaseConfig {
  /**
   * The server host
   */
  @ConfigField()
  @FromEnv('SERVER_HOST')
  @DefaultValue('localhost')
  public host!: string;

  /**
   * The server port
   */
  @ConfigField()
  @FromEnv('SERVER_PORT')
  @DefaultValue('8080')
  public port!: number;
}

// configuration = { "host": "localhost", "port": 8080 }
const configuration = await Configuration.init<Configuration>();
```

### Class config

```ts
import 'reflect-metadata';
import { BaseConfig, Config, ConfigField, DefaultValue, FromEnv } from 'class-configuration';

@Config()
class Database extends BaseConfig {
  /**
   * The server host
   */
  @ConfigField()
  @FromEnv('SERVER_HOST')
  @DefaultValue('localhost')
  public host!: string;

  /**
   * The server port
   */
  @ConfigField()
  @FromEnv('SERVER_PORT')
  @DefaultValue('8080')
  public port!: number;
}

@Config()
class Configuration {
  /**
   * Database config
   */
  @ConfigField()
  public database!: Database;
}

// configuration = { "database: { "host": "localhost", "port": 8080 } }
const configuration = await Configuration.init<Configuration>();
```

### Customize parser

You can customize a field's parser by `@ClassField`

```ts
@Config()
class DatabaseConfig extends BaseConfig {
  /**
   * Database hosts
   */
  @ConfigField({
    parser: (value) => value.split(','),
  })
  @FromEnv()
  public hosts!: string[];
}

// configuration = { "hosts": ["127.0.0.1", "127.0.0.2"] }
const configuration = await DatabaseConfig.init<DatabaseConfig>();
```

> Notice: This package does not check the type of the return value of the custom parser.
> If you want change it, please use `class-validator`.
