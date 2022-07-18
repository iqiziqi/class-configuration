import { BaseConfig } from '@class-config/core';
import { DynamicModule, Global, Module } from '@nestjs/common';

@Global()
@Module({})
export class ConfigurationModule {
  public static async forRootAsync(constructor: new (...args: []) => BaseConfig): Promise<DynamicModule> {
    return {
      global: true,
      module: ConfigurationModule,
      providers: [
        {
          provide: constructor,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          useValue: await (constructor as any).init(),
        },
      ],
      exports: [constructor],
    };
  }
}
