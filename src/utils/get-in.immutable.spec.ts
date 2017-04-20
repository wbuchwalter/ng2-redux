/*
const proxyquire = require('proxyquire');

const { getIn: getInWithImmutable } = proxyquire('./get-in', {
  immutable: {
    Iterable: {
      isIterable: value => typeof value.getIn === 'function',
    },
    '@noCallThru': true,
  },
});

const { getIn: getInWithNoImmutable } = require('./get-in');

describe('getIn', () => {
  it('should make use of immutable when available in host project', () => {
    const getIn =
      path => {
        expect(path.length).toEqual(1);
        expect(path[0]).toEqual('foo');
        return 't';
      };

    const fakeImmutable = { getIn: getIn };

    expect(getInWithImmutable(fakeImmutable, [ 'foo' ])).toEqual('t');
  });

  it('should work on regular objects even when immutable is available', () => {
    const test = { foo: 1 };

    expect(getInWithImmutable(test, [ 'foo' ])).toEqual(1);
  });

  it('should run without immutable when immutable is not available', () => {
    const test = { foo: 1 };

    expect(getInWithNoImmutable(test, [ 'foo' ])).toEqual(1);
  });
});
*/
