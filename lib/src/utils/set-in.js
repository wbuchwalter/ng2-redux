"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Sets a deeply-nested property value from an object, given a 'path'
 * of property names or array indices. Path elements are created if
 * not there already. Does not mutate the given object.
 *
 * @hidden
 */
exports.setIn = function (obj, _a, value) {
    var firstElem = _a[0], restElems = _a.slice(1);
    return (__assign({}, obj, (_b = {}, _b[firstElem] = restElems.length === 0 ?
        value :
        exports.setIn(obj[firstElem] || {}, restElems, value), _b)));
    var _b;
};
//# sourceMappingURL=set-in.js.map