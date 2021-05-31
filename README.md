# Configs

A Type safe and easy to use config package.

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

```ts
import 'reflect-metadata';
import { DefaultValue, FromEnv, init } from 'configs';

class Configuration {
  /**
   * The server host
   */
  @FromEnv('SERVER_HOST')
  @DefaultValue('localhost')
  public host!: string;

  /**
   * The server port
   */
  @ConfigField('SERVER_PORT')
  @DefaultValue(8080)
  public port!: number;
}

// configuration = { "host": "localhost", "port": 8080 }
const configuration = init(new Configuration());
```
