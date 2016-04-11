import {expect} from 'chai';
import { createStore } from 'redux';
import Connector from '../../src/components/connector';
import * as _ from 'lodash';

function returnPojo() {
  return {};
}

describe('Connector', () => {
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
    connector = new Connector(store);
  });

  it('Should throw when target is not a Function or a plain object', () => {
    expect(connector.connect(returnPojo).bind(connector, 15))
      .to.throw(Error);
    expect(connector.connect(returnPojo).bind(connector, undefined))
      .to.throw(Error);
    expect(connector.connect(returnPojo).bind(connector, 'test'))
      .to.throw(Error);

    expect(connector.connect(returnPojo).bind(connector, {}))
      .not.to.throw(Error);
    expect(connector.connect(returnPojo).bind(connector, returnPojo))
      .not.to.throw(Error);

  });

  it('Should throw when selector does not return a plain object', () => {
    expect(connector.connect.bind(connector, state => state.foo))
      .to.throw(Error);
  });


  it('Should extend target (Object) with selected state once directly after ' +
    'creation', () => {
    connector.connect(
      () => ({
        vm: { test: 1 }
      }))(targetObj);

    expect(targetObj.vm).to.deep.equal({ test: 1 });
  });

  it('Should update the target (Object) passed to connect when the store ' +
    'updates', () => {
    connector.connect(state => state)(targetObj);
    store.dispatch({ type: 'ACTION', payload: 0 });
    expect(targetObj.baz).to.equal(0);
    store.dispatch({ type: 'ACTION', payload: 7 });
    expect(targetObj.baz).to.equal(7);
  });

  it('Should prevent unnecessary updates when state does not change ' +
    '(shallowly)', () => {
    connector.connect(state => state)(targetObj);
    store.dispatch({ type: 'ACTION', payload: 5 });

    expect(targetObj.baz).to.equal(5);

    targetObj.baz = 0;

    //this should not replace our mutation, since the state didn't change
    store.dispatch({ type: 'ACTION', payload: 5 });

    expect(targetObj.baz).to.equal(0);
  });
  
  it('Should extend target (object) with actionCreators', () => {
    connector.connect(returnPojo, 
      { ac1: returnPojo, ac2: () => { } })(targetObj);
    expect(_.isFunction(targetObj.ac1)).to.equal(true);
    expect(_.isFunction(targetObj.ac2)).to.equal(true);
  });
  
  it('Should return an unsubscribing function', () => {
    const unsubscribe = connector.connect(state => state)(targetObj);
    store.dispatch({ type: 'ACTION', payload: 5 });
  
    expect(targetObj.baz).to.equal(5);
  
    unsubscribe();
  
    store.dispatch({ type: 'ACTION', payload: 7 });
  
    expect(targetObj.baz).to.equal(5);
  
  });

  it('Should provide dispatch to mapDispatchToTarget when receiving a ' +
    'Function', () => {
    let receivedDispatch;
    connector.connect(
      returnPojo, dispatch => { receivedDispatch = dispatch })(targetObj);
    expect(receivedDispatch).to.equal(store.dispatch);
  });

});
