"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var redux_1 = require("redux");
var Observable_1 = require("rxjs/Observable");
var BehaviorSubject_1 = require("rxjs/BehaviorSubject");
require("rxjs/add/operator/map");
require("rxjs/add/operator/filter");
require("rxjs/add/operator/distinctUntilChanged");
require("rxjs/add/operator/switchMap");
var selectors_1 = require("./selectors");
var assert_1 = require("../utils/assert");
var sub_store_1 = require("./sub-store");
var fractal_reducer_map_1 = require("./fractal-reducer-map");
var NgRedux = (function () {
    /** @hidden */
    function NgRedux(ngZone) {
        var _this = this;
        this.ngZone = ngZone;
        this._store = null;
        this._store$ = null;
        // Redux Store methods.
        this.getState = function () {
            return _this._store.getState();
        };
        this.subscribe = function (listener) {
            return _this._store.subscribe(listener);
        };
        this.replaceReducer = function (nextReducer) {
            return _this._store.replaceReducer(nextReducer);
        };
        this.dispatch = function (action) {
            assert_1.assert(!!_this._store, 'Dispatch failed: did you forget to configure your store? ' +
                'https://github.com/angular-redux/@angular-redux/core/blob/master/' +
                'README.md#quick-start');
            return _this.ngZone.run(function () { return _this._store.dispatch(action); });
        };
        // ObservableStore methods
        this.select = function (selector, comparator) {
            return _this._store$
                .distinctUntilChanged()
                .map(selectors_1.resolveToFunctionSelector(selector))
                .distinctUntilChanged(comparator);
        };
        this.configureSubStore = function (basePath, localReducer) {
            return new sub_store_1.SubStore(_this, basePath, localReducer);
        };
        this.storeToObservable = function (store) {
            return new Observable_1.Observable(function (observer) {
                observer.next(store.getState());
                store.subscribe(function () { return observer.next(store.getState()); });
            });
        };
        NgRedux.instance = this;
        this._store$ = new BehaviorSubject_1.BehaviorSubject(undefined)
            .filter(function (n) { return n !== undefined; })
            .switchMap(function (n) { return _this.storeToObservable(n); });
    }
    /**
     * Configures a Redux store and allows NgRedux to observe and dispatch
     * to it.
     *
     * This should only be called once for the lifetime of your app, for
     * example in the constructor of your root component.
     *
     * @param rootReducer Your app's root reducer
     * @param initState Your app's initial state
     * @param middleware Optional Redux middlewares
     * @param enhancers Optional Redux store enhancers
     */
    NgRedux.prototype.configureStore = function (rootReducer, initState, middleware, enhancers) {
        if (middleware === void 0) { middleware = []; }
        if (enhancers === void 0) { enhancers = []; }
        assert_1.assert(!this._store, 'Store already configured!');
        // Variable-arity compose in typescript FTW.
        this.setStore(redux_1.compose.apply(null, [redux_1.applyMiddleware.apply(void 0, middleware)].concat(enhancers))(redux_1.createStore)(fractal_reducer_map_1.enableFractalReducers(rootReducer), initState));
    };
    /**
     * Accepts a Redux store, then sets it in NgRedux and
     * allows NgRedux to observe and dispatch to it.
     *
     * This should only be called once for the lifetime of your app, for
     * example in the constructor of your root component. If configureStore
     * has been used this cannot be used.
     *
     * @param store Your app's store
     */
    NgRedux.prototype.provideStore = function (store) {
        assert_1.assert(!this._store, 'Store already configured!');
        this.setStore(store);
    };
    ;
    NgRedux.prototype.setStore = function (store) {
        this._store = store;
        this._store$.next(store);
    };
    return NgRedux;
}());
/** @hidden */
NgRedux.instance = undefined;
exports.NgRedux = NgRedux;
;
//# sourceMappingURL=ng-redux.js.map