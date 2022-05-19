import { expect } from 'chai';
import { parseBool, parseNumber, changeToConstanceCase } from '../src/utils';

describe('Utils', function () {
  describe('Utils.parseNumber', function () {
    it('should parse a string to boolean', function () {
      expect(parseNumber('12.0')).equal(12);
      expect(parseNumber('1000')).equal(1000);
      expect(parseNumber('12.5')).equal(12.5);
      expect(parseNumber('0')).equal(0);
      expect(parseNumber('-100')).equal(-100);
      expect(parseNumber('-1.2')).equal(-1.2);
      expect(parseNumber('-0.08')).equal(-0.08);
    });

    it('should throw error when string is invalidate', function () {
      expect(() => parseNumber('test')).throws(`Can't convert type of 'test' to number!`);
      expect(() => parseNumber('^%#@')).throws(`Can't convert type of '^%#@' to number!`);
      expect(() => parseNumber('a.12')).throws(`Can't convert type of 'a.12' to number!`);
      expect(() => parseNumber('12.a')).throws(`Can't convert type of '12.a' to number!`);
    });

    it('should parse a number to boolean', function () {
      expect(parseNumber('0')).equal(0);
      expect(parseNumber('1')).equal(1);
      expect(parseNumber('100')).equal(100);
      expect(parseNumber('-1')).equal(-1);
    });

    it('should parse undefined value', function () {
      expect(parseNumber(undefined)).equal(undefined);
    });
  });

  describe('Utils.parseBool', function () {
    it('should parse a string to boolean', function () {
      expect(parseBool('true')).equal(true);
      expect(parseBool('false')).equal(false);
      expect(parseBool('t')).equal(true);
      expect(parseBool('f')).equal(false);
      expect(parseBool('TRUE')).equal(true);
      expect(parseBool('FALSE')).equal(false);
      expect(parseBool('T')).equal(true);
      expect(parseBool('F')).equal(false);
      expect(parseBool('True')).equal(true);
      expect(parseBool('False')).equal(false);
    });

    it('should throw error when string is invalidate', function () {
      expect(() => parseBool('test')).throws(`Can't convert type of 'test' to boolean!`);
      expect(() => parseBool('^%#@')).throws(`Can't convert type of '^%#@' to boolean!`);
      expect(() => parseBool('12.a')).throws(`Can't convert type of '12.a' to boolean!`);
      expect(() => parseBool('a.12')).throws(`Can't convert type of 'a.12' to boolean!`);
    });

    it('should throw error when parse a number to boolean', function () {
      expect(() => parseBool('0')).throws(`Can't convert type of '0' to boolean`);
      expect(() => parseBool('1')).throws(`Can't convert type of '1' to boolean`);
      expect(() => parseBool('100')).throws(`Can't convert type of '100' to boolean`);
      expect(() => parseBool('-1')).throws(`Can't convert type of '-1' to boolean`);
    });

    it('should parse undefined value', function () {
      expect(parseBool(undefined)).equal(undefined);
    });
  });

  describe('Utils.changeToConstanceCase', function () {
    it('should change words from camel to constance case', function () {
      expect(changeToConstanceCase('value')).equal('VALUE');
      expect(changeToConstanceCase('testName')).equal('TEST_NAME');
    });

    it('should change words from pascal like to constance case', function () {
      expect(changeToConstanceCase('TestName')).equal('TEST_NAME');
      expect(changeToConstanceCase('_TestName')).equal('TEST_NAME');
    });

    it('should change words from snake like to constance case', function () {
      expect(changeToConstanceCase('test_name')).equal('TEST_NAME');
      expect(changeToConstanceCase('_Test_Name')).equal('TEST_NAME');
      expect(changeToConstanceCase('_Test_name')).equal('TEST_NAME');
    });

    it('should change works from another case to constance case', function () {
      expect(changeToConstanceCase('_Test___name')).equal('TEST___NAME');
      expect(changeToConstanceCase('____Test_name')).equal('TEST_NAME');
    });
  });
});
