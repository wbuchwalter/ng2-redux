import 'reflect-metadata';
import {expect, use} from 'chai';
import { createStore } from 'redux';
import {NgRedux} from '../../components/ng-redux';
import {dispatch} from '../../decorators';
import * as sinon from 'sinon';
import * as sinonChai from 'sinon-chai';
import * as _ from 'lodash';

use(sinonChai);

function mockActionCreator(val?) {
  return {
    type: 'INCREMENT_COUNTER',
    payload: val
  };
}

describe('@dispatch', () => {

  let store;
  let connector;
  let targetObj;
  let defaultState;

  beforeEach(() => {
    defaultState = {
      foo: 'bar',
      baz: -1
    };
    store = createStore((state = defaultState, action) => {
      const newState = Object.assign({}, state, { baz: action.payload });
      return newState;
    });
    targetObj = {};
    connector = new NgRedux(store);
  });


  it('attaches an instance method on the decorated property', () => {

    class MockClass {
      @dispatch(mockActionCreator) anInstanceMethod;
    }
    const mockInstance = new MockClass();
    expect(mockInstance.anInstanceMethod).to.be.instanceOf(Function);

  });

  it('configures the attached method to call dispatch with the result ' +
     'from the action creator', () => {

    let dispatchSpyMock = sinon.spy();
    connector.dispatch = dispatchSpyMock;

    class MockClass {
      @dispatch(mockActionCreator) anInstanceMethod;
    }
    const mockInstance = new MockClass();
    mockInstance.anInstanceMethod();

    expect(connector.dispatch.calledOnce).to.be.true;
    expect(connector.dispatch.getCall(0).args[0]).to.eql(mockActionCreator());

  });

  describe('WHEN OOP style inheritance is used', () => {

    describe('AND when the decorator is on the inherited parent', () => {

      it('will attach an instance method to any of the inheriting children ',
         () => {

        connector.dispatch = sinon.spy();

        class MockParentClass {
          @dispatch(mockActionCreator) anInheritedDecoratedDispatcherMethod;
        }

        class MockChildClass extends MockParentClass { }
        class MockAnotherChildClass extends MockParentClass { }

        const mockChildInstance = new MockChildClass();
        const anotherMockChildInstance = new MockAnotherChildClass();

        mockChildInstance.anInheritedDecoratedDispatcherMethod();
        anotherMockChildInstance.anInheritedDecoratedDispatcherMethod();

        expect(connector.dispatch.calledTwice).to.be.true;
        expect(connector.dispatch.getCall(0).args[0])
          .to.eql(mockActionCreator());
        expect(connector.dispatch.getCall(1).args[0])
          .to.eql(mockActionCreator());

      });

    });

    it('will decorate an instance method on the parent class', () => {

        connector.dispatch = sinon.spy();
        let parentSpy = sinon.spy();
        let childSpy = sinon.spy();
        let anotherChildSpy = sinon.spy();

        class MockParentClass {
          protected testInstanceProp = 'parent';
          @dispatch(mockActionCreator)
            public anInheritedDecoratedDispatcherMethod (val?) {
              parentSpy(val);
            }
        }

        class MockChildClass extends MockParentClass {
          anInheritedDecoratedDispatcherMethod (val?) {
            this.testInstanceProp = 'child';
            childSpy(this.testInstanceProp);
            super.anInheritedDecoratedDispatcherMethod(this.testInstanceProp);
          }
        }

        class MockAnotherChildClass extends MockParentClass {
          anInheritedDecoratedDispatcherMethod(val?) {
            this.testInstanceProp = 'anotherChild';
            anotherChildSpy(this.testInstanceProp);
            super.anInheritedDecoratedDispatcherMethod(this.testInstanceProp);
          }
        }

        const mockChildInstance = new MockChildClass();
        const anotherMockChildInstance = new MockAnotherChildClass();


        mockChildInstance.anInheritedDecoratedDispatcherMethod();
        anotherMockChildInstance.anInheritedDecoratedDispatcherMethod();

        expect(connector.dispatch.calledTwice).to.be.true;

        expect(connector.dispatch.getCall(0).args[0])
          .to.eql(mockActionCreator('child'));
        expect(connector.dispatch.getCall(1).args[0])
          .to.eql(mockActionCreator('anotherChild'));

        expect(parentSpy.calledTwice).to.be.true;
        expect(childSpy.calledOnce).to.be.true;
        expect(anotherChildSpy.calledOnce).to.be.true;

        expect(parentSpy.getCall(0).args[0]).to.equal('child');
        expect(parentSpy.getCall(1).args[0]).to.equal('anotherChild');

    });

  });

});


