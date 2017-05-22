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
import { NgRedux } from './ng-redux';
import { ObservableStore, Comparator } from './observable-store';

const f = (rootReducer, rootFractalReducer) =>
  (state, action) => {
    rootReducer(state, action)
    rootFractalReducer(state, action);
  }

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

// TODO: unit tests.
export class SubStore<State> implements ObservableStore<State> {
  static reducerMap: { [id: string]: Reducer<any> } = {};

  constructor(
    private rootStore: NgRedux<any>,
    private basePath: PathSelector,
    localReducer: Reducer<State>) {
      const existingFractalReducer = SubStore.reducerMap[JSON.stringify(basePath)];
      if (existingFractalReducer && existingFractalReducer !== localReducer) {
        throw new Error(`attempt to overwrite fractal reducer for basePath ${basePath}`);
      }

      SubStore.reducerMap[JSON.stringify(basePath)] = localReducer;
  }

  dispatch: Dispatch<State> = (action: Action) =>
    this.rootStore.dispatch(
      Object.assign({},
      action,
      { '@angular-redux::fractalkey': JSON.stringify(this.basePath) }))

  getState = (): State =>
    getIn(this.rootStore.getState(), this.basePath)

  configureSubStore = <SubState>(
    basePath: PathSelector,
    localReducer: Reducer<SubState>): ObservableStore<SubState> =>
      new SubStore<SubState>(
        this.rootStore,
        [ ...this.basePath, ...basePath],
        localReducer)

  select = <SelectedState>(
    selector?: Selector<State, SelectedState>,
    comparator?: Comparator): Observable<SelectedState> =>
      this.rootStore
        .select(this.basePath)
        .map(resolveToFunctionSelector(selector))
        .distinctUntilChanged(comparator)

  subscribe = (listener): () => void => {
    const subscription = this.select().subscribe(listener);
    return () => subscription.unsubscribe();
  }

  replaceReducer = (nextLocalReducer: Reducer<State>) =>
    SubStore.reducerMap[JSON.stringify(this.basePath)] = nextLocalReducer;
}
