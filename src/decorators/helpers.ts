import { NgRedux } from '../components/ng-redux';
import { ObservableStore } from '../components/observable-store';
import { Selector, Comparator, Transformer } from '../components/selectors';

const SUBSTORE_OPTIONS_KEY = '@angular-redux::fractal-store::options';
const SUBSTORE_INSTANCE_KEY = '@angular-redux::decorator::store';

const getClassOptions = (decoratedInstance: Object) =>
  decoratedInstance.constructor[SUBSTORE_OPTIONS_KEY];

const setInstanceStore = (decoratedInstance: Object, store?: ObservableStore<any>) =>
  decoratedInstance[SUBSTORE_INSTANCE_KEY] = store;

const getInstanceStore = (decoratedInstance: Object) =>
  decoratedInstance[SUBSTORE_INSTANCE_KEY];

// TODO: run memory tests.
// TODO: test AOT.
// TODO: fix MockNgRedux.reset().
  // Keep selection map in testing module instead?
// TODO: blog post.
// TODO: friendly errors for misconfigs.
// TODO: constantify caching prop names.
// TODO: docs.
// TODO: dispatch unit tests.

/**
 * Gets the store associated with a decorated instance (e.g. a
 * component or service)
 * @hidden
 */
export const getBaseStore = (decoratedInstance: Object) => {
  const store = getInstanceStore(decoratedInstance);
  if (!store) {
    const options = getClassOptions(decoratedInstance);

    if (!options) {
      setInstanceStore(decoratedInstance, NgRedux.instance);
    } else {
      const basePath = decoratedInstance[options.basePathMethodName]();
      setInstanceStore(decoratedInstance,
        basePath && NgRedux.instance ?
          NgRedux.instance.configureSubStore(
            basePath,
            options.localReducer) :
          undefined);
    }
  }

  return getInstanceStore(decoratedInstance);
};


/**
 * Creates an Observable from the given selection parameters,
 * rooted at decoratedInstance's store, and caches it on the
 * instance for future use.
 * @hidden
 */
export const getInstanceSelection = <T>(
  decoratedInstance: Object,
  key: string | symbol,
  selector: Selector<any, T>,
  transformer?: Transformer<any, T>,
  comparator?: Comparator) => {
  const store = getBaseStore(decoratedInstance);

  if (store) {
    const selections = decoratedInstance['@angular-redux::decorator::selections'] || {};

    selections[key] = !transformer ?
      store.select(selector, comparator) :
      store.select(selector)
        .let(transformer)
        .distinctUntilChanged(comparator);
    decoratedInstance['@angular-redux::decorator::selections'] = selections;

    return selections[key];
  }

  return undefined;
}
