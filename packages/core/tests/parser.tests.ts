import { expect } from 'expect';
import { parseBool, parseNumber } from '../src/parser';

describe('Test default value parser', function () {
  describe('Test number value parser', function () {
    it('should parse a string to number', function () {
      expect(parseNumber('12.0')).toBe(12);
      expect(parseNumber('1000')).toBe(1000);
      expect(parseNumber('12.5')).toBe(12.5);
      expect(parseNumber('0')).toBe(0);
      expect(parseNumber('-100')).toBe(-100);
      expect(parseNumber('-1.2')).toBe(-1.2);
      expect(parseNumber('-0.08')).toBe(-0.08);
      expect(parseNumber('0')).toBe(0);
      expect(parseNumber('1')).toBe(1);
      expect(parseNumber('100')).toBe(100);
      expect(parseNumber('-1')).toBe(-1);
    });

    it('should throw error when string is invalidate', function () {
      expect(() => parseNumber('test')).toThrow(`Can't convert type of 'test' to number!`);
      expect(() => parseNumber('^%#@')).toThrow(`Can't convert type of '^%#@' to number!`);
      expect(() => parseNumber('a.12')).toThrow(`Can't convert type of 'a.12' to number!`);
      expect(() => parseNumber('12.a')).toThrow(`Can't convert type of '12.a' to number!`);
    });

    it('should parse undefined value', function () {
      expect(parseNumber(undefined)).toBe(undefined);
    });
  });

  describe('Test boolean value parser', function () {
    it('should parse a string to boolean', function () {
      expect(parseBool('true')).toBe(true);
      expect(parseBool('false')).toBe(false);
      expect(parseBool('t')).toBe(true);
      expect(parseBool('f')).toBe(false);
      expect(parseBool('TRUE')).toBe(true);
      expect(parseBool('FALSE')).toBe(false);
      expect(parseBool('T')).toBe(true);
      expect(parseBool('F')).toBe(false);
      expect(parseBool('True')).toBe(true);
      expect(parseBool('False')).toBe(false);
    });

    it('should throw error when string is invalidate', function () {
      expect(() => parseBool('test')).toThrow(`Can't convert type of 'test' to boolean!`);
      expect(() => parseBool('^%#@')).toThrow(`Can't convert type of '^%#@' to boolean!`);
      expect(() => parseBool('12.a')).toThrow(`Can't convert type of '12.a' to boolean!`);
      expect(() => parseBool('a.12')).toThrow(`Can't convert type of 'a.12' to boolean!`);
    });

    it('should throw error when parse a number to boolean', function () {
      expect(() => parseBool('0')).toThrow(`Can't convert type of '0' to boolean`);
      expect(() => parseBool('1')).toThrow(`Can't convert type of '1' to boolean`);
      expect(() => parseBool('100')).toThrow(`Can't convert type of '100' to boolean`);
      expect(() => parseBool('-1')).toThrow(`Can't convert type of '-1' to boolean`);
    });

    it('should parse undefined value', function () {
      expect(parseBool(undefined)).toBe(undefined);
    });
  });
});
