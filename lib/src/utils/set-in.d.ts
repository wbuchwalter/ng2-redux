/**
 * Sets a deeply-nested property value from an object, given a 'path'
 * of property names or array indices. Path elements are created if
 * not there already. Does not mutate the given object.
 *
 * @hidden
 */
export declare const setIn: (obj: Object, [firstElem, ...restElems]: (string | number)[], value: any) => Object;
