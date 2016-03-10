"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var rxjs_1 = require('rxjs');
var connector_1 = require('./connector');
var core_1 = require('angular2/core');
function provider(store) {
    var _connector = new connector_1.default(store);
    var factory = function () { return Object.assign({}, { connect: _connector.connect }, store); };
    return core_1.provide('ngRedux', { useFactory: factory });
}
exports.provider = provider;
var NgRedux = (function () {
    function NgRedux(ngRedux) {
        var _this = this;
        this.observableFromStore = function (store) { return new rxjs_1.BehaviorSubject(store.getState()); };
        this.store = this.observableFromStore(ngRedux);
        this._ngRedux = ngRedux;
        this._ngRedux.subscribe(function () { return _this.store.next(_this._ngRedux.getState()); });
        Object.assign(this, ngRedux);
    }
    NgRedux.prototype.select = function (selector, comparer) {
        if (typeof selector === 'string' ||
            typeof selector === 'number' ||
            typeof selector === 'symbol') {
            return this.store.map(function (state) { return state[selector]; }).distinctUntilChanged(comparer);
        }
        else if (typeof selector === 'function') {
            return this.store.map(selector).distinctUntilChanged(comparer);
        }
    };
    NgRedux = __decorate([
        core_1.Injectable(),
        __param(0, core_1.Inject('ngRedux')), 
        __metadata('design:paramtypes', [Object])
    ], NgRedux);
    return NgRedux;
}());
exports.NgRedux = NgRedux;
//# sourceMappingURL=provider.js.map