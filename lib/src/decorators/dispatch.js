"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ng_redux_1 = require("../components/ng-redux");
/**
 * Auto-dispatches the return value of the decorated function.
 *
 * Decorate a function creator method with @dispatch and its return
 * value will automatically be passed to ngRedux.dispatch() for you.
 */
function dispatch() {
    return function dispatchDecorator(target, key, descriptor) {
        var originalMethod;
        descriptor = descriptor || Object.getOwnPropertyDescriptor(target, key);
        var wrapped = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            var result = originalMethod.apply(this, args);
            ng_redux_1.NgRedux.instance.dispatch(result);
            return result;
        };
        if (descriptor === undefined) {
            var dispatchDescriptor = {
                get: function () { return wrapped; },
                set: function (setMethod) { return originalMethod = setMethod; },
            };
            Object.defineProperty(target, key, dispatchDescriptor);
            return;
        }
        else {
            originalMethod = descriptor.value;
            descriptor.value = wrapped;
            return descriptor;
        }
    };
}
exports.dispatch = dispatch;
//# sourceMappingURL=dispatch.js.map