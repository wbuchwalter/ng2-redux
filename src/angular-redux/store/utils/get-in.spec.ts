import { getIn } from './get-in';

describe('getIn', () => {

  it('should select a first-level prop', () => {
    const test = { foo: 1 };
    expect(getIn(test, ['foo'])).toEqual(1);
  });

  it('should select a second-level prop', () => {
    const test = { foo: { bar: 2 } };
    expect(getIn(test, ['foo', 'bar'])).toEqual(2);
  });

  it('should select a third-level prop', () => {
    const test = { foo: { bar: { quux: 3 } } };
    expect(getIn(test, ['foo', 'bar', 'quux'])).toEqual(3);
  });

  it('should select falsy values properly', () => {
    const test = {
      a: false,
      b: 0,
      c: '',
      d: undefined
    };
    expect(getIn(test, ['a'])).toEqual(false);
    expect(getIn(test, ['b'])).toEqual(0);
    expect(getIn(test, ['c'])).toEqual('');
    expect(getIn(test, ['d'])).toEqual(undefined);
  });

  it('should select nested falsy values properly', () => {
    const test = {
      foo: {
        a: false,
        b: 0,
        c: '',
        d: undefined
      }
    };
    expect(getIn(test, ['foo', 'a'])).toEqual(false);
    expect(getIn(test, ['foo', 'b'])).toEqual(0);
    expect(getIn(test, ['foo', 'c'])).toEqual('');
    expect(getIn(test, ['foo', 'd'])).toEqual(undefined);
  });

  it('should not freak if the object is null', () => {
    expect(getIn(null, ['foo', 'd'])).toEqual(null);
  });

  it('should not freak if the object is undefined', () => {
    expect(getIn(undefined, ['foo', 'd'])).toEqual(undefined);
  });

  it('should not freak if the object is a primitive', () => {
    expect(getIn(42, ['foo', 'd'])).toEqual(undefined);
  });

  it('should return undefined for a nonexistent prop', () => {
    const test = { foo: 1 };
    expect(getIn(test, ['bar'])).toBeUndefined();
  });

  it('should return undefined for a nonexistent path', () => {
    const test = { foo: 1 };
    expect(getIn(test, ['bar', 'quux'])).toBeUndefined();
  });

  it('should return undefined for a nested nonexistent prop', () => {
    const test = { foo: 1 };
    expect(getIn(test, ['foo', 'bar'])).toBeUndefined();
  });

  it('should select array elements properly', () => {
    const test = ['foo', 'bar'];
    expect(getIn(test, [0])).toEqual('foo');
    expect(getIn(test, ['0'])).toEqual('foo');
    expect(getIn(test, [1])).toEqual('bar');
    expect(getIn(test, ['1'])).toEqual('bar');
    expect(getIn(test, [2])).toBeUndefined();
    expect(getIn(test, ['2'])).toBeUndefined();
  });

  it('should select nested array elements properly', () => {
    const test = { 'quux': ['foo', 'bar'] };
    expect(getIn(test, ['quux', 0])).toEqual('foo');
    expect(getIn(test, ['quux', '0'])).toEqual('foo');
    expect(getIn(test, ['quux', 1])).toEqual('bar');
    expect(getIn(test, ['quux', '1'])).toEqual('bar');
    expect(getIn(test, ['quux', 2])).toBeUndefined();
    expect(getIn(test, ['quux', '2'])).toBeUndefined();
  });
});
