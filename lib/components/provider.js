"use strict";
var connector_1 = require('./connector');
var core_1 = require('angular2/core');
function provider(store) {
    var _connector = new connector_1.default(store);
    var factory = function () {
        // TS doesn't seem to like this with ...spread :(
        return {
            connect: _connector.connect,
            dispatch: store.dispatch,
            subscribe: store.subscribe,
            getState: store.getState,
            replaceReducer: store.replaceReducer
        };
    };
    return core_1.provide('ngRedux', { useFactory: factory });
}
exports.provider = provider;
/*
 const createStoreWithMiddleware = applyInjectableMiddleware(thunk, 'promise')(createStore);
*/
/*
export function applyInjectableMiddleware(middlewares) {
    const injector = new Injector();
    let resolvedMiddlewares = [];
    _.forEach(middlewares, middleware => {
        _.isString(middleware)
            ? resolvedMiddlewares.push(Injector.resolve(middleware))
            : resolvedMiddlewares.push(middleware)
    });

    return redux.applyMiddleware(...resolvedMiddlewares);
}
*/
//# sourceMappingURL=provider.js.map