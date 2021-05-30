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

class Configuration {
  /**
   * The server host
   */
  @ConfigField({ env: 'SERVER_HOST', default: 'localhost' })
  public host!: string;

  /**
   * The server port
   */
  @ConfigField({ env: 'SERVER_PORT', default: 8080 })
  public port!: number;
}

// configuration = { "host": "localhost", "port": 8080 }
const configuration = init(new Configuration());
```
