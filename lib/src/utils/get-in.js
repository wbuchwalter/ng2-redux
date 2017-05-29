"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Gets a deeply-nested property value from an object, given a 'path'
 * of property names or array indices.
 *
 * @hidden
 */
function getIn(v, pathElems) {
    if (!v) {
        return v;
    }
    // If this is an ImmutableJS structure, use existing getIn function
    if (typeof v.getIn === 'function') {
        return v.getIn(pathElems);
    }
    var firstElem = pathElems[0], restElems = pathElems.slice(1);
    if (undefined === v[firstElem]) {
        return undefined;
    }
    if (restElems.length === 0) {
        return v[firstElem];
    }
    return getIn(v[firstElem], restElems);
}
exports.getIn = getIn;
//# sourceMappingURL=get-in.js.map