# @class-config/source-env

![test](https://github.com/iqiziqi/class-configuration/actions/workflows/test.yml/badge.svg)
[![codecov](https://codecov.io/gh/iqiziqi/class-configuration/branch/dev/graph/badge.svg?token=LL7I9PEF0Y)](https://codecov.io/gh/iqiziqi/class-configuration)

This is the class config source. This package provides the ability to get configuration from environment variables.

## Usage

## Example

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
