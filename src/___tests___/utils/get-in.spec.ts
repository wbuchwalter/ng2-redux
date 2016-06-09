import { getIn } from '../../utils/get-in';
import { expect } from 'chai';

describe.only('getIn', () => {

  it('should select a first-level prop', () => {
    const test = { foo: 1 };
    expect(getIn(test, [ 'foo' ])).to.equal(1);
  });

  it('should select a second-level prop', () => {
    const test = { foo: { bar: 2 } };
    expect(getIn(test, [ 'foo', 'bar' ])).to.equal(2);
  });

  it('should select a third-level prop', () => {
    const test = { foo: { bar: { quux: 3 } } };
    expect(getIn(test, [ 'foo', 'bar', 'quux' ])).to.equal(3);
  });

  it('should select falsy values properly', () => {
    const test = {
      a: false,
      b: 0,
      c: '',
      d: undefined
    };
    expect(getIn(test, [ 'a' ])).to.equal(false);
    expect(getIn(test, [ 'b' ])).to.equal(0);
    expect(getIn(test, [ 'c' ])).to.equal('');
    expect(getIn(test, [ 'd' ])).to.equal(undefined);
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
    expect(getIn(test, [ 'foo', 'a' ])).to.equal(false);
    expect(getIn(test, [ 'foo', 'b' ])).to.equal(0);
    expect(getIn(test, [ 'foo', 'c' ])).to.equal('');
    expect(getIn(test, [ 'foo', 'd' ])).to.equal(undefined);
  });

  it('should not freak if the object is null', () => {
    expect(getIn(null, [ 'foo', 'd' ])).to.equal(null);
  });

  it('should not freak if the object is undefined', () => {
    expect(getIn(undefined, [ 'foo', 'd' ])).to.equal(undefined);
  });

  it('should not freak if the object is a primitive', () => {
    expect(getIn(42, [ 'foo', 'd' ])).to.equal(undefined);
  });

  it('should return undefined for a nonexistent prop', () => {
    const test = { foo: 1 };
    expect(getIn(test, [ 'bar' ])).to.be.undefined;
  });

  it('should return undefined for a nonexistent path', () => {
    const test = { foo: 1 };
    expect(getIn(test, [ 'bar', 'quux' ])).to.be.undefined;
  });

  it('should return undefined for a nested nonexistent prop', () => {
    const test = { foo: 1 };
    expect(getIn(test, [ 'foo', 'bar' ])).to.be.undefined;
  });
});
