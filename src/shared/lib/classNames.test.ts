import { classNames } from './classNames';

describe('classNames', () => {
  test('keeps object keys with truthy values', function () {
    expect(classNames({
      a: true,
      b: false,
      c: 0,
      d: null,
      e: undefined,
      f: 1,
    })).toBe('a f');
  });

  test('joins arrays of class names and ignore falsy values', function () {
    expect(classNames('a', 0, null, undefined, true, 1, 'b')).toBe('a 1 b');
  });

  test('supports heterogenous arguments', function () {
    expect(classNames({ a: true, }, 'b', 0)).toBe('a b');
  });

  test('should be trimmed', function () {
    expect(classNames('', 'b', {}, '')).toBe('b');
  });

  test('returns an empty string for an empty configuration', function () {
    expect(classNames({})).toBe('');
  });

  test('supports an array of class names', function () {
    expect(classNames(['a', 'b'])).toBe('a b');
  });

  test('joins array arguments wtesth string arguments', function () {
    expect(classNames(['a', 'b'], 'c')).toBe('a b c');
    expect(classNames('c', ['a', 'b'])).toBe('c a b');
  });

  test('handles multiple array arguments', function () {
    expect(classNames(['a', 'b'], ['c', 'd'])).toBe('a b c d');
  });

  test('handles arrays that include falsy and true values', function () {
    expect(classNames(['a', 0, null, undefined, false, true, 'b'])).toBe('a b');
  });

  test('handles arrays that include arrays', function () {
    expect(classNames(['a', ['b', 'c']])).toBe('a b c');
  });

  test('handles arrays that include objects', function () {
    expect(classNames(['a', { b: true, c: false, }])).toBe('a b');
  });

  test('handles deep array recursion', function () {
    expect(classNames(['a', ['b', ['c', { d: true, }]]])).toBe('a b c d');
  });

  test('handles arrays that are empty', function () {
    expect(classNames('a', [])).toBe('a');
  });

  test('handles nested arrays that have empty nested arrays', function () {
    expect(classNames('a', [[]])).toBe('a');
  });

  test('handles all types of truthy and falsy property values as expected', function () {
    expect(classNames({
      null: null,
      emptyString: '',
      noNumber: NaN,
      zero: 0,
      negativeZero: -0,
      false: false,
      undefined,
      nonEmptyString: 'foobar',
      whtestespace: ' ',
      function: Object.prototype.toString,
      emptyObject: {},
      nonEmptyObject: { a: 1, b: 2, },
      emptyList: [],
      nonEmptyList: [1, 2, 3],
      greaterZero: 1,
    }))
      .toBe('nonEmptyString whtestespace function emptyObject nonEmptyObject emptyList nonEmptyList greaterZero');
  });

  test('handles toString() method defined on object', function () {
    expect(classNames({
      toString: function () { return 'classFromMethod'; },
    })).toBe('classFromMethod');
  });
});
