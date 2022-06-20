import { expect } from 'expect';
import { parseBool, parseNumber, changeToConstanceCase } from '../src/utils';

describe('Utils', function () {
  describe('Utils.parseNumber', function () {
    it('should parse a string to boolean', function () {
      expect(parseNumber('12.0')).toBe(12);
      expect(parseNumber('1000')).toBe(1000);
      expect(parseNumber('12.5')).toBe(12.5);
      expect(parseNumber('0')).toBe(0);
      expect(parseNumber('-100')).toBe(-100);
      expect(parseNumber('-1.2')).toBe(-1.2);
      expect(parseNumber('-0.08')).toBe(-0.08);
    });

    it('should throw error when string is invalidate', function () {
      expect(() => parseNumber('test')).toThrow(`Can't convert type of 'test' to number!`);
      expect(() => parseNumber('^%#@')).toThrow(`Can't convert type of '^%#@' to number!`);
      expect(() => parseNumber('a.12')).toThrow(`Can't convert type of 'a.12' to number!`);
      expect(() => parseNumber('12.a')).toThrow(`Can't convert type of '12.a' to number!`);
    });

    it('should parse a number to boolean', function () {
      expect(parseNumber('0')).toBe(0);
      expect(parseNumber('1')).toBe(1);
      expect(parseNumber('100')).toBe(100);
      expect(parseNumber('-1')).toBe(-1);
    });

    it('should parse undefined value', function () {
      expect(parseNumber(undefined)).toBe(undefined);
    });
  });

  describe('Utils.parseBool', function () {
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

  describe('Utils.changeToConstanceCase', function () {
    it('should change words from camel to constance case', function () {
      expect(changeToConstanceCase('value')).toBe('VALUE');
      expect(changeToConstanceCase('testName')).toBe('TEST_NAME');
    });

    it('should change words from pascal like to constance case', function () {
      expect(changeToConstanceCase('TestName')).toBe('TEST_NAME');
      expect(changeToConstanceCase('_TestName')).toBe('TEST_NAME');
    });

    it('should change words from snake like to constance case', function () {
      expect(changeToConstanceCase('test_name')).toBe('TEST_NAME');
      expect(changeToConstanceCase('_Test_Name')).toBe('TEST_NAME');
      expect(changeToConstanceCase('_Test_name')).toBe('TEST_NAME');
    });

    it('should change works from another case to constance case', function () {
      expect(changeToConstanceCase('_Test___name')).toBe('TEST___NAME');
      expect(changeToConstanceCase('____Test_name')).toBe('TEST_NAME');
    });
  });
});
