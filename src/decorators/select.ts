import { NgRedux } from '../components/ng-redux';

/**
 * Selects an observable from the store, and attaches it to the decorated 
 * property.
 *
 * @param {string | function} stateKeyOrFunc 
 * An Rxjs selector function or a string indicating the name of the store
 * property to be selected.
 * @param {(x: any, y: any) => boolean} [comparer] Optional
 * comparison function called to test if an item is distinct
 * from the previous item in the source.
 **/
export const select = <T>(stateKeyOrFunc?,
    comparer?: (x: any, y: any) => boolean) => (target, key) => {
    let bindingKey = (key.lastIndexOf('$') === key.length - 1) ?
        key.substring(0, key.length - 1) : key;

    if (typeof stateKeyOrFunc === 'string') {
        bindingKey = stateKeyOrFunc;
    }

    function getter() {
        return NgRedux.instance
            .select(typeof stateKeyOrFunc === 'function' ?
                    stateKeyOrFunc : bindingKey, comparer);
    }

    // Delete property.
    if (delete this[key]) {
        // Create new property with getter and setter
        Object.defineProperty(target, key, {
            get: getter,
            enumerable: true,
            configurable: true
        });
    }
};
