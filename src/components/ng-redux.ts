import * as Redux from 'redux';

import {
  Store,
  Action,
  Reducer,
  createStore,
  applyMiddleware,
  compose
} from 'redux';

import { NgZone } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/filter';
import 'rxjs/add/observable/from';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/switchMap';

import shallowEqual from '../utils/shallow-equal';
import { getIn } from '../utils/get-in';

export type PropertySelector = string | number | symbol;
export type PathSelector = (string | number)[];
export type FunctionSelector<RootState, S> = ((s: RootState) => S);
export type Selector<RootState, S> = PropertySelector |
  PathSelector |
  FunctionSelector<RootState, S>;

export type Comparator = (x: any, y: any) => boolean;

// Workaround for Redux issue #1935 - remove once Redux 3.6.0 is
// released.
type RetypedCompose = (func: Function, ...funcs: Function[]) => Function;

export class NgRedux<RootState> {
  static instance: NgRedux<any> = undefined;

  private _store: Store<RootState> = null;
  private _store$: BehaviorSubject<RootState> = null;

  /**
   * Creates an instance of NgRedux.
   */
  constructor(
    private ngZone: NgZone) {
    NgRedux.instance = this;
    this._store$ = new BehaviorSubject<RootState>(null)
      .filter(n => n !== null)
      .switchMap(n => Observable.from(n as any)) as BehaviorSubject<RootState>;
  }

  /**
   * configures a Redux store and allows NgRedux to observe and dispatch
   * to it.
   *
   * This should only be called once for the lifetime of your app, for
   * example in the constructor of your root component.
   *
   * @param {Redux.Reducer<RootState>} reducer Your app's root reducer
   * @param {RootState} initState Your app's initial state
   * @param {Redux.Middleware[]} middleware Optional Redux middlewares
   * @param {Redux.StoreEnhancer<RootState>[]} Optional Redux store enhancers
   */
  configureStore(
    reducer: Redux.Reducer<RootState>,
    initState: RootState,
    middleware: Redux.Middleware[] = [],
    enhancers: Redux.StoreEnhancer<RootState>[] = []) {

    if (this._store) {
      throw new Error('Store already configured!');
    }

    const reTypedCompose = compose as RetypedCompose;
    const finalCreateStore = <Redux.StoreEnhancerStoreCreator<RootState>>reTypedCompose(
        applyMiddleware(...middleware),
        ...enhancers
    )(createStore);
    const store = finalCreateStore(reducer, initState);

    this.setStore(store);
  }

  /**
   * Accepts a Redux store, then sets it in NgRedux and
   * allows NgRedux to observe and dispatch to it.
   *
   * This should only be called once for the lifetime of your app, for
   * example in the constructor of your root component. If configureStore
   * has been used this cannot be used.
   *
   * @param {Redux.Store} store Your app's store
   */
  provideStore(store: Store<RootState>) {
    if (this._store) {
      throw new Error('Store already configured!');
    }

    this.setStore(store);
  };

  /**
   * Select a slice of state to expose as an observable.
   *
   * @template S
   * @param { PropertySelector |
   *  PathSelector |
   *  FunctionSelector<RootState, S>}
   * selector key or function to select a part of the state
   * @param { Comparator } [comparer] Optional
   * comparison function called to test if an item is distinct
   * from the previous item in the source.
   *
   * @returns {Observable<S>} an Observable that emits items from the
   * source Observable with distinct values.
   */
  select<S>(
    selector?: Selector<RootState, S>,
    comparator?: Comparator): Observable<S> {

    let result: Observable<S>;
    const changedStore = this._store$.distinctUntilChanged();

    if (!selector) {
      return this._store$.distinctUntilChanged(comparator);
    } else if (
      typeof selector === 'string' ||
      typeof selector === 'number' ||
      typeof selector === 'symbol') {

      result = changedStore.map(state => state[selector as PropertySelector]);
    } else if (Array.isArray(selector)) {
      result = changedStore.map(state => getIn(state, selector as PathSelector));
    } else {
      result = changedStore.map(selector as FunctionSelector<RootState, S>);
    }

    return result.distinctUntilChanged(comparator);
  }

  /**
   * Get the current state of the application
   * @returns {RootState} the application state
   */
  getState = (): RootState => this._store.getState()

  /**
   * Subscribe to the Redux store changes
   *
   * @param {() => void} listener callback to invoke when the state is updated
   * @returns a function to unsubscribe
   */
  subscribe = (listener: () => void) => this._store.subscribe(listener)

  /**
   * Replaces the reducer currently used by the store to calculate the state.
   *
   * You might need this if your app implements code splitting and you want to
   * load some of the reducers dynamically. You might also need this if you
   * implement a hot reloading mechanism for Redux.
   *
   * @param nextReducer The reducer for the store to use instead.
   */
  replaceReducer = (nextReducer: Reducer<RootState>) =>
    this._store.replaceReducer(nextReducer)

  /**
   * Dispatch an action to Redux
   */
  dispatch = <A extends Action>(action: A): any => {
    if (!this._store) {
      throw new Error('Dispatch failed: did you forget to configure your store? ' +
        'https://github.com/angular-redux/@angular-redux/core/blob/master/' +
        'README.md#quick-start');
    }

    // Some apps dispatch actions from outside the angular zone; e.g. as
    // part of a 3rd-party callback, etc. When this happens, we need to
    // execute the dispatch in-zone or Angular2's UI won't update.
    return this.ngZone.run(() => this._store.dispatch(action));
  };

  private setStore(store: Store<RootState>) {
    this._store = store;
    this._store$.next(store as any);
  }
};
