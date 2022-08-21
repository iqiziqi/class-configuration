# class-config

![Node.js CI](https://github.com/iqiziqi/class-configuration/actions/workflows/node.yml/badge.svg)
[![codecov](https://codecov.io/gh/iqiziqi/class-configuration/branch/dev/graph/badge.svg?token=LL7I9PEF0Y)](https://codecov.io/gh/iqiziqi/class-configuration)

The config package to define and read the configuration.

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

```typescript
import 'reflect-metadata';
import { BaseConfig, Config, ConfigField } from '@class-config/core';

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

### Config Source

The 'config source' specifies how to load the config data from. Below are some config sources:

*   [@class-config/source-env](packages/source-env)

You can use `@From` load config field from a config source.

For example:

```typescript
import 'reflect-metadata';
import { BaseConfig, Config, ConfigField, From } from '@class-config/core';
import { Env } from '@class-config/source-env';

process.env.SERVER_HOST = 'localhost';
process.env.SERVER_PORT = '8080';

@Config()
class Configuration extends BaseConfig {
  /**
   * The server host
   */
  @ConfigField()
  @From(new Env('SERVER_HOST'))
  public host!: string;

  /**
   * The server port
   */
  @ConfigField()
  @From(new Env('SERVER_PORT'))
  public port!: number;
}

// configuration = { "host": "localhost", "port": 8080 }
const configuration = await Configuration.init<Configuration>();
```

### Default value

You can use `@DefaultValue` load config field by default value.

For example:

```typescript
import 'reflect-metadata';
import { BaseConfig, Config, ConfigField, DefaultValue } from '@class-config/core';

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

### Customize parser

You can customize a field's parser by `@ClassField`

```typescript
@Config()
class DatabaseConfig extends BaseConfig {
  /**
   * Database hosts
   */
  @ConfigField({
    parser: (value) => value.split(','),
  })
  @From(new Env('HOSTS'))
  public hosts!: string[];
}

// configuration = { "hosts": ["127.0.0.1", "127.0.0.2"] }
const configuration = await DatabaseConfig.init<DatabaseConfig>();
```

### Validator

The validator will check if your config file is valid. Below is some validator.

*   [@class-config/validator-class](packages/validator-class)

You can't set validator by `init`.

For example:

```typescript
import 'reflect-metadata';
import { BaseConfig, Config, ConfigField, DefaultValue } from '@class-config/core';
import { ClassValidator } from '@class-config/validator-class';
import { IsString, IsNumber } from 'class-validator';

@Config()
class Database extends BaseConfig {
  /**
   * The server host
   */
  @ConfigField()
  @DefaultValue('localhost')
  @IsString()
  public host!: string;

  /**
   * The server port
   */
  @ConfigField()
  @DefaultValue('8080')
  @IsNumber()
  public port!: number;
}

const config = await Database.init<Database>({
  validator: new ClassValidator(),
});
```

## Example

### Basic

```typescript
import 'reflect-metadata';
import { BaseConfig, Config, ConfigField, DefaultValue, From } from '@class-config/core';
import { Env } from '@class-config/source-env';

@Config()
class Configuration extends BaseConfig {
  /**
   * The server host
   */
  @ConfigField()
  @From(new Env('SERVER_HOST'))
  @DefaultValue('localhost')
  public host!: string;

  /**
   * The server port
   */
  @ConfigField()
  @From(new Env('SERVER_PORT'))
  @DefaultValue('8080')
  public port!: number;
}

// configuration = { "host": "localhost", "port": 8080 }
const configuration = await Configuration.init<Configuration>();
```

### Nested

```typescript
import 'reflect-metadata';
import { BaseConfig, Config, ConfigField, DefaultValue, From } from '@class-config/core';
import { Env } from '@class-config/source-env';

@Config()
class Database extends BaseConfig {
  /**
   * The server host
   */
  @ConfigField()
  @From(new Env('SERVER_HOST'))
  @DefaultValue('localhost')
  public host!: string;

  /**
   * The server port
   */
  @ConfigField()
  @From(new Env('SERVER_PORT'))
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

## More Information

*   [@class-config/core](packages/core/README.md)
*   [@class-config/source-env](packages/source-env/README.md)
*   [@class-config/validator-class](packages/validator-class/README.md)
