"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ReplaySubject_1 = require("rxjs/ReplaySubject");
require("rxjs/add/observable/from");
require("rxjs/add/operator/distinctUntilChanged");
/** @hidden */
var MockObservableStore = (function () {
    function MockObservableStore() {
        var _this = this;
        this.selections = {};
        this.subStores = {};
        this.getSelectorStub = function (selector, comparator) {
            return _this.initSelectorStub(selector, comparator).subject;
        };
        this.reset = function () {
            Object.keys(_this.subStores).forEach(function (k) { return _this.subStores[k].reset(); });
            _this.selections = {};
            _this.subStores = {};
        };
        this.dispatch = function (action) { return null; };
        this.replaceReducer = function () { return null; };
        this.getState = function () { return null; };
        this.subscribe = function () { return function () { return null; }; };
        this.select = function (selector, comparator) {
            var stub = _this.initSelectorStub(selector, comparator);
            return stub.comparator ?
                stub.subject.distinctUntilChanged(stub.comparator) :
                stub.subject;
        };
        this.configureSubStore = function (basePath, localReducer) {
            return _this.initSubStore(basePath);
        };
        this.getSubStore = function () {
            var pathSelectors = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                pathSelectors[_i] = arguments[_i];
            }
            var first = pathSelectors[0], rest = pathSelectors.slice(1);
            return first ? (_a = _this.initSubStore(first)).getSubStore.apply(_a, rest) :
                _this;
            var _a;
        };
    }
    MockObservableStore.prototype.initSubStore = function (basePath) {
        var result = this.subStores[JSON.stringify(basePath)] ||
            new MockObservableStore();
        this.subStores[JSON.stringify(basePath)] = result;
        return result;
    };
    MockObservableStore.prototype.initSelectorStub = function (selector, comparator) {
        var key = selector.toString();
        var record = this.selections[key] || {
            subject: new ReplaySubject_1.ReplaySubject(),
            comparator: comparator,
        };
        this.selections[key] = record;
        return record;
    };
    return MockObservableStore;
}());
exports.MockObservableStore = MockObservableStore;
//# sourceMappingURL=observable-store.mock.js.map