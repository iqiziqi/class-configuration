# Class-Configuration

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

### Basic

```ts
import 'reflect-metadata';
import { Config, ConfigField, DefaultValue, FromEnv, init } from 'configs';

@Config()
class Configuration {
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
  @ConfigField('SERVER_PORT')
  @DefaultValue(8080)
  public port!: number;
}

// configuration = { "host": "localhost", "port": 8080 }
const configuration = init(new Configuration());
```

### Class config

```ts
import 'reflect-metadata';
import { Config, ConfigField, DefaultValue, FromEnv, init } from 'configs';

@Config()
class Database {
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
  @ConfigField('SERVER_PORT')
  @DefaultValue(8080)
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
const configuration = init(new Configuration());
```
