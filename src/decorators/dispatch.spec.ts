import 'reflect-metadata';
import { NgZone } from '@angular/core';
import { NgRedux } from '../components/ng-redux';
import { dispatch } from './dispatch';

class MockNgZone {
  run = fn => fn()
}

fdescribe('@dispatch', () => {
  let ngRedux;
  const mockNgZone = new MockNgZone() as NgZone;
  let targetObj;
  let defaultState;
  let rootReducer;

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
    ngRedux = new NgRedux(mockNgZone);
    ngRedux.configureStore(rootReducer, defaultState);
  });

  it('should call dispatch with the result of the function', () => {
    class TestClass {
      instanceProperty = 'test'
      @dispatch()
      myMethod(value) {
        return {
          type: 'TEST',
          payload: {
            value,
            instanceProperty: this.instanceProperty
          }
        }
      }
    }
    spyOn(NgRedux.instance, 'dispatch');
    const instance = new TestClass();
    const result = instance.myMethod('test payload');
    expect(result.type).toBe('TEST');
    expect(NgRedux.instance.dispatch).toHaveBeenCalledWith({
      type: 'TEST', payload: {
        value: 'test payload',
        instanceProperty: 'test'
      }
    })
  });

  it('should work with property initalizers', () => {
    class TestClass {
      instanceProperty = 'test'
      @dispatch()
      boundProperty = (value) => {
        return {
          type: 'TEST',
          payload: {
            value,
            instanceProperty: this.instanceProperty
          }
        }
      }
    }
    spyOn(NgRedux.instance, 'dispatch');
    const instance = new TestClass();
    const result = instance.boundProperty('test payload');
    expect(result.type).toBe('TEST');
    expect(NgRedux.instance.dispatch).toHaveBeenCalledWith({
      type: 'TEST', payload: {
        value: 'test payload',
        instanceProperty: 'test'
      }
    })
  })

  it('work with properties bound to function defined outside of the class', () => {
    function test(value) {
      return {
        type: 'TEST',
        payload: {
          value,
          instanceProperty: this.instanceProperty
        }
      }
    }
    class TestClass {
      instanceProperty = 'test'
      @dispatch()
      boundProperty = test;
    }
    spyOn(NgRedux.instance, 'dispatch');
    const instance = new TestClass();
    const result = instance.boundProperty('test payload');
    expect(result.type).toBe('TEST');
    expect(NgRedux.instance.dispatch).toHaveBeenCalledWith({
      type: 'TEST', payload: {
        value: 'test payload',
        instanceProperty: 'test'
      }
    })
  })

  it('work with properties bound to fat arrow defined outside of the class', () => {
    const test = (value) => {
      return {
        type: 'TEST',
        payload: {
          value,
          instanceProperty: this.instanceProperty
        }
      }
    }
    class TestClass {
      instanceProperty = 'test'
      @dispatch()
      boundProperty = test;
    }
    spyOn(NgRedux.instance, 'dispatch');
    const instance = new TestClass();
    const result = instance.boundProperty('test payload');
    expect(result.type).toBe('TEST');
    expect(NgRedux.instance.dispatch).toHaveBeenCalledWith({
      type: 'TEST', payload: {
        value: 'test payload',
        instanceProperty: undefined
      }
    })
  })
});
