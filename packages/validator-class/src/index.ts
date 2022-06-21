import { BaseConfig, IValidator } from '@class-config/core';
import { validate, ValidatorOptions } from 'class-validator';

export class ClassValidator implements IValidator {
  public constructor(private readonly validatorOptions?: ValidatorOptions) {}
  public async validate(config: BaseConfig): Promise<boolean> {
    const error = await validate(config, this.validatorOptions);
    return !error.length;
  }
}
