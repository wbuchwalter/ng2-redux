"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var get_in_1 = require("../utils/get-in");
var selectors_1 = require("./selectors");
var fractal_reducer_map_1 = require("./fractal-reducer-map");
/** @hidden */
var SubStore = (function () {
    function SubStore(rootStore, basePath, localReducer) {
        var _this = this;
        this.rootStore = rootStore;
        this.basePath = basePath;
        this.dispatch = function (action) {
            return _this.rootStore.dispatch(Object.assign({}, action, { '@angular-redux::fractalkey': JSON.stringify(_this.basePath) }));
        };
        this.getState = function () {
            return get_in_1.getIn(_this.rootStore.getState(), _this.basePath);
        };
        this.configureSubStore = function (basePath, localReducer) {
            return new SubStore(_this.rootStore, _this.basePath.concat(basePath), localReducer);
        };
        this.select = function (selector, comparator) {
            return _this.rootStore
                .select(_this.basePath)
                .map(selectors_1.resolveToFunctionSelector(selector))
                .distinctUntilChanged(comparator);
        };
        this.subscribe = function (listener) {
            var subscription = _this.select().subscribe(listener);
            return function () { return subscription.unsubscribe(); };
        };
        this.replaceReducer = function (nextLocalReducer) {
            return fractal_reducer_map_1.replaceLocalReducer(_this.basePath, nextLocalReducer);
        };
        fractal_reducer_map_1.registerFractalReducer(basePath, localReducer);
    }
    return SubStore;
}());
exports.SubStore = SubStore;
//# sourceMappingURL=sub-store.js.map