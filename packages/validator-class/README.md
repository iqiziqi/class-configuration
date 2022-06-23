# @class-config/validator-class

![Node.js CI](https://github.com/iqiziqi/class-configuration/actions/workflows/node.yml/badge.svg)
[![codecov](https://codecov.io/gh/iqiziqi/class-configuration/branch/dev/graph/badge.svg?token=LL7I9PEF0Y)](https://codecov.io/gh/iqiziqi/class-configuration)

This is a class config validator. This package provides the ability to check the configuration by `class-validator`.

## Usage

## Example

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

> More information: [class-validator](https://github.com/typestack/class-validator)
