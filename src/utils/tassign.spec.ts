import { expect } from 'chai';
import { tassign } from './tassign';

describe('tassign', () => {
  it('Returns an object with original and new values', () => {
    const initial = {
      a: 1,
      b: 2,
    };

    const assigned = {
      b: 3,
    };

    const expected = {
      a: 1,
      b: 3,
    };

    expect(tassign(initial, assigned)).to.eql(expected);
  });

  it('Returns a new object reference', () => {
    const initial = {
      a: 1,
      b: 2,
    };

    const assigned = {};

    expect(tassign(initial, assigned)).not.to.equal(initial);
  });

  it('Does not mutate the original object', () => {
    const initial = {
      a: 1,
      b: 2,
    };

    const assigned = {
      b: 3,
    };

    const expected = {
      a: 1,
      b: 2,
    };

    tassign(initial, assigned);
    expect(initial).to.eql(expected);
  });
});
