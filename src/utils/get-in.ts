/*
 * Gets a deeply-nested property value from an object, given a 'path'
 * of property names.
 */
export function getIn(
  v: Object,
  pathElems: string[]): any {
    const [ firstElem, ...restElems] = pathElems;
    if (!v) {
      return v;
    }

    if (undefined === v[firstElem]) {
      return undefined;
    }

    if (restElems.length === 0) {
        return v[firstElem];
    }

    return getIn(v[firstElem], restElems);
}
