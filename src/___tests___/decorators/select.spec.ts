import 'reflect-metadata';
import {expect, use} from 'chai';
import { createStore } from 'redux';
import {NgRedux} from '../../components/ng-redux';
import {select} from '../../decorators/select';
import * as sinon from 'sinon';
import * as sinonChai from 'sinon-chai';
import * as _ from 'lodash';

use(sinonChai);

describe('@select', () => {

  let ngRedux;
  let targetObj;
  let defaultState;
  let rootReducer;
  let mockAppRef;

  beforeEach(() => {
    defaultState = {
      foo: 'bar',
      baz: -1
    };
    rootReducer = (state = defaultState, action) => {
      const newState = Object.assign({}, state, { baz: action.payload });
      return newState;
    };
    targetObj = {};
    mockAppRef = {
      tick: sinon.spy()
    };
    ngRedux = new NgRedux(mockAppRef);
    ngRedux.configureStore(rootReducer, defaultState);
  });

  describe('when passed no arguments', () => {

    it('automatically attempts to bind to a store property that matches the' +
      ' name of the class property', () => {

        class MockClass {
          @select() baz: any;
        }

        let mockInstance = new MockClass();
        let value;
        let expectedValue = 1;

        mockInstance.baz.subscribe((val) => {
          value = val;
        });

        ngRedux.dispatch({ type: 'nvm', payload: expectedValue });

        expect(value).to.equal(expectedValue);

      });

    it('attempts to bind by name ignoring any $ characters in the class ' +
      'property name', () => {

        class MockClass {
          @select() baz$: any;
        }

        let mockInstance = new MockClass();
        let value;
        let expectedValue = 2;

        mockInstance.baz$.subscribe((val) => {
          value = val;
        });

        ngRedux.dispatch({ type: 'nvm', payload: expectedValue });

        expect(value).to.equal(expectedValue);


      });

  });

  describe('when passed a string', () => {

    it('attempts to bind to the store property whose name matches the ' +
      'string value', () => {

        class MockClass {
          @select('baz') asdf: any;
        }

        let mockInstance = new MockClass();
        let value;
        let expectedValue = 3;

        mockInstance.asdf.subscribe((val) => {
          value = val;
        });

        ngRedux.dispatch({ type: 'nvm', payload: expectedValue });

        expect(value).to.equal(expectedValue);

      });

  });

  describe('when passed a function', () => {

    it('attempts to use that function as the selector function', () => {

      class MockClass {
        @select(state => state.baz * 2) asdf: any;
      }

      let mockInstance = new MockClass();
      let value;
      let expectedValue = 10;

      mockInstance.asdf.subscribe((val) => {
        value = val;
      });

      ngRedux.dispatch({ type: 'nvm', payload: expectedValue / 2 });

      expect(value).to.equal(expectedValue);

    });

  });

  describe('when using a custom comprarer', () => {
    it('should use the provided compare function', () => {
      
      let compare = sinon.spy((a, b) => a.foo === b.foo); 
      let stateSpy = sinon.spy((foo) => ({}));
      let state2Spy = sinon.spy((foo) => ({}));

      class MockClass {
        @select(state => state, compare) state$: any;
        @select(state => state) state2$: any; 
      }

      let mockInstance = new MockClass();
      let state = mockInstance.state$.subscribe(stateSpy);
      let state2 = mockInstance.state2$.subscribe(state2Spy);

            
      expect(stateSpy).to.have.been.calledOnce;
      expect(state2Spy).to.have.been.calledOnce;

      ngRedux.dispatch({ type: 'nvm', payload: 'magic' });
      expect(compare).to.have.been.called;

      // since the custom compare is only looking at the
      // foo key, it doesn't care about changes to baz
      // even though the state is changing fully

      expect(stateSpy).to.have.been.calledOnce;
      expect(state2Spy).to.have.been.calledTwice;
      
      
    });
  });

});
