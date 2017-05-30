"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var ng_redux_1 = require("./ng-redux");
var core_2 = require("@angular/core");
var environment = typeof window !== 'undefined' ? window : this;
/**
 * An angular-2-ified version of the Redux DevTools chrome extension.
 */
var DevToolsExtension = (function () {
    /** @hidden */
    function DevToolsExtension(appRef, ngRedux) {
        var _this = this;
        this.appRef = appRef;
        this.ngRedux = ngRedux;
        /**
         * A wrapper for the Chrome Extension Redux DevTools.
         * Makes sure state changes triggered by the extension
         * trigger Angular2's change detector.
         *
         * @argument options: dev tool options; same
         * format as described here:
         * [zalmoxisus/redux-devtools-extension/blob/master/docs/API/Arguments.md]
         */
        this.enhancer = function (options) {
            var subscription;
            if (!_this.isEnabled()) {
                return null;
            }
            // Make sure changes from dev tools update angular's view.
            environment.devToolsExtension.listen(function (_a) {
                var type = _a.type;
                if (type === 'START') {
                    subscription = _this.ngRedux.subscribe(function () {
                        if (!core_2.NgZone.isInAngularZone()) {
                            _this.appRef.tick();
                        }
                    });
                }
                else if (type === 'STOP') {
                    subscription();
                }
            });
            return environment.devToolsExtension(options);
        };
        /**
         * Returns true if the extension is installed and enabled.
         */
        this.isEnabled = function () { return environment && environment.devToolsExtension; };
    }
    return DevToolsExtension;
}());
DevToolsExtension.decorators = [
    { type: core_1.Injectable },
];
/** @nocollapse */
DevToolsExtension.ctorParameters = function () { return [
    { type: core_1.ApplicationRef, },
    { type: ng_redux_1.NgRedux, },
]; };
exports.DevToolsExtension = DevToolsExtension;
//# sourceMappingURL=dev-tools.js.map