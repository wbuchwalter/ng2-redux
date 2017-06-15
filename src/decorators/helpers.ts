import { Reducer } from 'redux';
import { NgRedux } from '../components/ng-redux';
import { ObservableStore } from '../components/observable-store';
import { Selector, Comparator, Transformer } from '../components/selectors';

import 'rxjs/add/operator/let';
import 'rxjs/add/operator/distinctUntilChanged';

export interface IFractalStoreOptions {
  basePathMethodName: string
  localReducer: Reducer<any>;
}

/**
 * OPTIONS_KEY: this is per-class (static) and holds the config from the @SubStore
 * decorator.
 */
const OPTIONS_KEY = '@angular-redux::substore::class::options';

/**
 * INSTANCE_SUBSTORE_KEY, INSTANCE_SELECTIONS_KEY: these are per-instance (non-static) and
 * holds references to the substores/selected observables to be used by an instance of a
 * decorated class. I'm not using reflect-metadata here because I want
 *
 * 1. different instances to have different substores in the case where `basePathMethodName`
 * is dynamic.
 * 2. the instance substore to be garbage collected when the instance is no longer reachable.
 *
 * This is therefore an own-property on the actual instance of the decorated class.
 */
const INSTANCE_SUBSTORE_KEY = '@angular-redux::substore::instance::store';
const INSTANCE_SELECTIONS_KEY = '@angular-redux::substore::instance::selections';

const getClassOptions = (decoratedInstance: any): IFractalStoreOptions =>
  decoratedInstance.constructor[OPTIONS_KEY];

export const setClassOptions = (
  decoratedClassConstructor: any,
  options: IFractalStoreOptions): void => {
    decoratedClassConstructor[OPTIONS_KEY] = options
}

// I want the store to be saved on the actual instance so
// 1. different instances can have distinct substores if necessary
// 2. the substore/selections will be marked for garbage collection when the
//    instance is destroyed.
const setInstanceStore = (decoratedInstance: any, store?: ObservableStore<any>) =>
  decoratedInstance[INSTANCE_SUBSTORE_KEY] = store;

const getInstanceStore = (decoratedInstance: any): ObservableStore<any> =>
  decoratedInstance[INSTANCE_SUBSTORE_KEY];

const getInstanceSelectionMap = (decoratedInstance: any) => {
  const map = decoratedInstance[INSTANCE_SELECTIONS_KEY] || {};
  decoratedInstance[INSTANCE_SELECTIONS_KEY] = map;
  return map;
}

/**
 * Gets the store associated with a decorated instance (e.g. a
 * component or service)
 * @hidden
 */
export const getBaseStore = (decoratedInstance: any) => {
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
  decoratedInstance: any,
  key: string | symbol,
  selector: Selector<any, T>,
  transformer?: Transformer<any, T>,
  comparator?: Comparator) => {
  const store = getBaseStore(decoratedInstance);

  if (store) {
    const selections = getInstanceSelectionMap(decoratedInstance);

    selections[key] = !transformer ?
      store.select(selector, comparator) :
      store.select(selector)
        .let(transformer)
        .distinctUntilChanged(comparator);
    return selections[key];
  }

  return undefined;
}
