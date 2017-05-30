"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var set_in_1 = require("../utils/set-in");
var get_in_1 = require("../utils/get-in");
var reducerMap = {};
var composeReducers = function () {
    var reducers = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        reducers[_i] = arguments[_i];
    }
    return function (state, action) {
        return reducers.reduce(function (subState, reducer) { return reducer(subState, action); }, state);
    };
};
/** @hidden */
function enableFractalReducers(rootReducer) {
    return composeReducers(rootFractalReducer, rootReducer);
}
exports.enableFractalReducers = enableFractalReducers;
/** @hidden */
function registerFractalReducer(basePath, localReducer) {
    var existingFractalReducer = reducerMap[JSON.stringify(basePath)];
    if (existingFractalReducer && existingFractalReducer !== localReducer) {
        throw new Error("attempt to overwrite fractal reducer for basePath " + basePath);
    }
    reducerMap[JSON.stringify(basePath)] = localReducer;
}
exports.registerFractalReducer = registerFractalReducer;
/** @hidden */
function replaceLocalReducer(basePath, nextLocalReducer) {
    reducerMap[JSON.stringify(basePath)] = nextLocalReducer;
}
exports.replaceLocalReducer = replaceLocalReducer;
function rootFractalReducer(state, action) {
    if (state === void 0) { state = {}; }
    var fractalKey = action['@angular-redux::fractalkey'];
    var fractalPath = fractalKey ? JSON.parse(fractalKey) : [];
    var localReducer = reducerMap[fractalKey];
    return fractalKey && localReducer ?
        set_in_1.setIn(state, fractalPath, localReducer(get_in_1.getIn(state, fractalPath), action)) :
        state;
}
//# sourceMappingURL=fractal-reducer-map.js.map