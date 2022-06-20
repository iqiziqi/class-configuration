import { changeToConstanceCase } from '../src';
import { expect } from 'expect';

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
