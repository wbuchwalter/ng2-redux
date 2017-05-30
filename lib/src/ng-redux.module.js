"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var ng_redux_1 = require("./components/ng-redux");
var dev_tools_1 = require("./components/dev-tools");
/** @hidden */
function _ngReduxFactory(ngZone) {
    return new ng_redux_1.NgRedux(ngZone);
}
exports._ngReduxFactory = _ngReduxFactory;
var NgReduxModule = (function () {
    function NgReduxModule() {
    }
    return NgReduxModule;
}());
NgReduxModule.decorators = [
    { type: core_1.NgModule, args: [{
                providers: [
                    dev_tools_1.DevToolsExtension,
                    { provide: ng_redux_1.NgRedux, useFactory: _ngReduxFactory, deps: [core_1.NgZone] }
                ]
            },] },
];
/** @nocollapse */
NgReduxModule.ctorParameters = function () { return []; };
exports.NgReduxModule = NgReduxModule;
;
//# sourceMappingURL=ng-redux.module.js.map