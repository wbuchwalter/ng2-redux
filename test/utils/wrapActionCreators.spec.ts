import {expect} from 'chai';
import wrapActionCreators from '../../src/utils/wrapActionCreators';

interface TestDispatchMap extends Redux.Map<TestPartialDispatch> {
  action: TestPartialDispatch;
}

interface TestAction extends Redux.Action {
  dispatched: Redux.Action;
}

interface TestPartialDispatch extends Redux.PartialDispatch {
  (): TestAction; 
}

describe('Utils', () => {
  describe('wrapActionCreators', () => {
    it('should return a function that wraps argument in a call to bindActionCreators', () => {

      function dispatch(action) {
        return {
          dispatched: action
        };
      }

      const actionResult = { type: 'test-action' };

      const actionCreators = {
        action: () => actionResult
      };

      const wrapped = wrapActionCreators<
        Redux.Map<Redux.ActionCreator>, TestDispatchMap>(actionCreators);
      expect(typeof wrapped).to.equal('function');
      expect(() => wrapped(dispatch)).not.to.throw(Error);

      const bound = wrapped(dispatch);
      expect(bound.action).not.to.throw(Error);
      expect(bound.action().dispatched).to.equal(actionResult);

    });
  });
});
