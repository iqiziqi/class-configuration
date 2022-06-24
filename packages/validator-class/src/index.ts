import { BaseConfig, IValidator } from '@class-config/core';
import { validate, ValidationError, ValidatorOptions } from 'class-validator';

function getErrors(errors: ValidationError[]): string[] {
  const messagesList = errors.map((error) => {
    if (error.children?.length) return getErrors(error.children).map((property) => `${error.property}.${property}`);
    else return error.constraints ? Object.values(error.constraints) : [];
  });
  const messages = new Array<string>().concat(...messagesList);
  return messages;
}

export class ClassValidator implements IValidator {
  public constructor(private readonly validatorOptions?: ValidatorOptions) {}
  public async validate(config: BaseConfig): Promise<string[]> {
    const errors = await validate(config, this.validatorOptions);
    const messages = getErrors(errors);
    return messages;
  }
}
