import { IConfigSource } from '../src';

export class ValueSource<T> implements IConfigSource<T> {
  public constructor(private readonly value: T) {}
  public getValue() {
    return this.value;
  }
}
