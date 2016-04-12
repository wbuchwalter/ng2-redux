import {expect} from 'chai';
import wrapActionCreators from '../../src/utils/wrapActionCreators';
import * as Redux from 'redux';


interface ITestAction extends Redux.Action {
 
}

describe.only('Utils', () => {
  describe('wrapActionCreators', () => {
    it('should return a function that wraps function in a call to bindActionCreators', () => {

    /*  let actionCreator = (payload) => {
        console.log('oh hai', payload);
       return { type: 'TEST',
        payload }
      }
      let dispatch = (action) => {
        console.log('here', action);
        return { dispatched: action }
      }

      let wrapped = wrapActionCreators(actionCreator);
      let result = wrapped(dispatch)();
      console.log('result', result);*/

    function dispatch(action) {
        return {
          dispatched: action
        };
      }

      const actionResult = {type: 'action'};

      const actionCreator = (payload) => ({type: 'TYPE', payload}) 
        

      const wrapped = wrapActionCreators(actionCreator);
      //expect(wrapped).toBeA(Function);
      //expect(() => wrapped(dispatch)).toNotThrow();
     
      const bound = wrapped(dispatch);
      //expect(bound()).toNotThrow();
      console.log('bound',bound('payload'))  

    });
  });
});
