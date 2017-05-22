import { Dispatch, Reducer, Action } from 'redux';
import { Observable } from 'rxjs/Observable';
import { getIn } from '../utils/get-in';
import { setIn } from '../utils/set-in';
import {
  PathSelector,
  Selector,
  PropertySelector,
  FunctionSelector,
  resolveToFunctionSelector,
} from './selectors';
import { NgRedux, Comparator } from './ng-redux';

// TODO: hook this up to rootReducer in configureStore, provideStore
// (using composeReducer, replaceReducer respectively).
export const rootFractalReducer = (
  state: {} = {},
  action: Action & { '@angular-redux::fractalkey': string }) => {
    const fractalKey = action['@angular-redux::fractalkey'];
    const fractalPath = fractalKey ? JSON.parse(fractalKey) : [];
    const localReducer = SubStore.reducerMap[fractalKey];
    return fractalKey && localReducer ?
      setIn(
        state,
        fractalPath,
        localReducer(
          getIn(state, fractalPath),
          action)) :
      state;
  }

// TODO: sort out store interface.
// TODO: unit tests.
export class SubStore<S> {
  static reducerMap = {};

  constructor(
    private rootStore: NgRedux<any>,
    private basePath: PathSelector,
    localReducer: Reducer<S>) {
      const existingFractalReducer = SubStore.reducerMap[JSON.stringify(basePath)];
      if (existingFractalReducer && existingFractalReducer !== localReducer) {
        throw new Error(`attempt to overwrite fractal reducer for basePath ${basePath}`);
      }

      SubStore.reducerMap[JSON.stringify(basePath)] = localReducer;
  }

  dispatch: Dispatch<S> = (action: Action) =>
    this.rootStore.dispatch(
      Object.assign({},
      action,
      { '@angular-redux::fractalkey': JSON.stringify(this.basePath) }))

  getState = (): S => getIn(this.rootStore.getState(), this.basePath)

  configureSubStore = <T>(basePath: PathSelector, localReducer: Reducer<T>) =>
    new SubStore<T>(
      this.rootStore,
      [ ...this.basePath, ...basePath],
      localReducer)

  select = <T>(selector: Selector<S, T>, comparator?: Comparator): Observable<T> =>
    this.rootStore
      .select(this.basePath)
      .map(resolveToFunctionSelector(selector))
      .distinctUntilChanged(comparator)
}
