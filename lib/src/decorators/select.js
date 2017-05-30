"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("rxjs/add/operator/let");
var ng_redux_1 = require("../components/ng-redux");
/**
 * Selects an observable from the store, and attaches it to the decorated
 * property.
 *
 * @param selector
 * A selector function, property name string, or property name path
 * (array of strings/array indices) that locates the store data to be
 * selected
 *
 * @param comparator Function used to determine if this selector has changed.
 */
function select(selector, comparator) {
    return function decorate(target, key) {
        var result;
        var bindingKey = selector;
        if (!selector) {
            bindingKey = (key.lastIndexOf('$') === key.length - 1) ?
                key.substring(0, key.length - 1) :
                key;
        }
        function getter() {
            if (ng_redux_1.NgRedux.instance && !result) {
                result = ng_redux_1.NgRedux.instance.select(bindingKey, comparator);
            }
            return result;
        }
        // Replace decorated property with a getter that returns the observable.
        if (delete target[key]) {
            Object.defineProperty(target, key, {
                get: getter,
                enumerable: true,
                configurable: true
            });
        }
    };
}
exports.select = select;
/**
 * Selects an observable using the given path selector, and runs it through the given
 * transformer function. A transformer function takes the store observable as an input and
 * returns a derived observable from it. That derived observable is run through
 * distinctUntilChanges with the given optional comparator and attached to the store property.
 *
 * Think of a Transformer as a FunctionSelector that operates on observables instead of
 * values.
 */
function select$(selector, transformer, comparator) {
    return function decorate(target, key) {
        var result;
        function getter() {
            if (ng_redux_1.NgRedux.instance && !result) {
                result = ng_redux_1.NgRedux.instance.select(selector)
                    .let(transformer)
                    .distinctUntilChanged(comparator);
            }
            return result;
        }
        // Replace decorated property with a getter that returns the observable.
        if (delete target[key]) {
            Object.defineProperty(target, key, {
                get: getter,
                enumerable: true,
                configurable: true
            });
        }
    };
}
exports.select$ = select$;
//# sourceMappingURL=select.js.map