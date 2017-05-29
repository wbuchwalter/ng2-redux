"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var store_1 = require("@angular-redux/store");
var ng_redux_mock_1 = require("./ng-redux.mock");
var dev_tools_mock_1 = require("./dev-tools.mock");
// Needs to be initialized early so @select's use the mocked version too.
var mockNgRedux = new ng_redux_mock_1.MockNgRedux();
/** @hidden */
function _mockNgReduxFactory() {
    return mockNgRedux;
}
exports._mockNgReduxFactory = _mockNgReduxFactory;
var NgReduxTestingModule = (function () {
    function NgReduxTestingModule() {
    }
    return NgReduxTestingModule;
}());
NgReduxTestingModule.decorators = [
    { type: core_1.NgModule, args: [{
                imports: [],
                providers: [
                    { provide: store_1.NgRedux, useFactory: _mockNgReduxFactory },
                    { provide: store_1.DevToolsExtension, useClass: dev_tools_mock_1.MockDevToolsExtension },
                ],
            },] },
];
/** @nocollapse */
NgReduxTestingModule.ctorParameters = function () { return []; };
exports.NgReduxTestingModule = NgReduxTestingModule;
//# sourceMappingURL=ng-redux-testing.module.js.map