var expect = require('expect');
var sinon = require('sinon');
var redux_1 = require('redux');
var connector_1 = require('../../src/components/connector');
var _ = require('lodash');
describe('Connector', function () {
    var store;
    var connector;
    var targetObj;
    var defaultState;
    beforeEach(function () {
        defaultState = {
            foo: 'bar',
            baz: -1
        };
        store = redux_1.createStore.apply(void 0, [function (state, action) {
            if (state === void 0) { state = defaultState; }
            return {};
        }].concat(state, [baz, action.payload]));
    });
});
targetObj = {};
connector = new connector_1.default(store);
;
it('Should throw when target is not a Function or a plain object', function () {
    expect(connector.connect(function () { return ({}); }).bind(connector, 15)).toThrow();
    expect(connector.connect(function () { return ({}); }).bind(connector, undefined)).toThrow();
    expect(connector.connect(function () { return ({}); }).bind(connector, 'test')).toThrow();
    expect(connector.connect(function () { return ({}); }).bind(connector, {})).toNotThrow();
    expect(connector.connect(function () { return ({}); }).bind(connector, function () { })).toNotThrow();
});
it('Should throw when selector does not return a plain object', function () {
    expect(connector.connect.bind(connector, function (state) { return state.foo; })).toThrow();
});
it('Should extend target (Object) with selected state once directly after creation', function () {
    connector.connect(function () { return ({
        vm: { test: 1 }
    }); })(targetObj);
    expect(targetObj.vm).toEqual({ test: 1 });
});
it('Should update the target (Object) passed to connect when the store updates', function () {
    connector.connect(function (state) { return state; })(targetObj);
    store.dispatch({ type: 'ACTION', payload: 0 });
    expect(targetObj.baz).toBe(0);
    store.dispatch({ type: 'ACTION', payload: 7 });
    expect(targetObj.baz).toBe(7);
});
it('Should prevent unnecessary updates when state does not change (shallowly)', function () {
    connector.connect(function (state) { return state; })(targetObj);
    store.dispatch({ type: 'ACTION', payload: 5 });
    expect(targetObj.baz).toBe(5);
    targetObj.baz = 0;
    //this should not replace our mutation, since the state didn't change 
    store.dispatch({ type: 'ACTION', payload: 5 });
    expect(targetObj.baz).toBe(0);
});
it('Should extend target (object) with actionCreators', function () {
    connector.connect(function () { return ({}); }, { ac1: function () { }, ac2: function () { } })(targetObj);
    expect(_.isFunction(targetObj.ac1)).toBe(true);
    expect(_.isFunction(targetObj.ac2)).toBe(true);
});
it('Should return an unsubscribing function', function () {
    var unsubscribe = connector.connect(function (state) { return state; })(targetObj);
    store.dispatch({ type: 'ACTION', payload: 5 });
    expect(targetObj.baz).toBe(5);
    unsubscribe();
    store.dispatch({ type: 'ACTION', payload: 7 });
    expect(targetObj.baz).toBe(5);
});
it('Should provide dispatch to mapDispatchToTarget when receiving a Function', function () {
    var receivedDispatch;
    connector.connect(function () { return ({}); }, function (dispatch) { receivedDispatch = dispatch; })(targetObj);
    expect(receivedDispatch).toBe(store.dispatch);
});
;
