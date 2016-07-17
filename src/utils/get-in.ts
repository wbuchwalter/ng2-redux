import * as immutable from 'immutable';

/*
 * Gets a deeply-nested property value from an object, given a 'path'
 * of property names or array indices.
 */
export function getIn(
  v: Object | immutable.Iterable<string, any>,
  pathElems: (string | number)[]): any {
    if (!v) {
      return v;
    }

    if (immutable.Iterable.isIterable(v)) {
      return (<immutable.Iterable<string, any>>v).getIn(pathElems);
    }

    const [ firstElem, ...restElems] = pathElems;

    if (undefined === v[firstElem]) {
      return undefined;
    }

    if (restElems.length === 0) {
        return v[firstElem];
    }

    return getIn(v[firstElem], restElems);
}

