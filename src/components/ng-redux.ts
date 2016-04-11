import {Injectable, Inject} from 'angular2/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Store, Action } from 'redux';
import * as invariant from 'invariant';


@Injectable()
export class NgRedux<T extends Store<T>> {
  store: BehaviorSubject<T>;
  _ngRedux: any;

  constructor( @Inject('ngRedux') ngRedux) {
    this.store = this.observableFromStore(ngRedux);
    this._ngRedux = ngRedux;

    this._ngRedux.subscribe(() => this.store.next(this._ngRedux.getState()));
    Object.assign(this, ngRedux)
  }

  select<S>(selector: string | number | symbol | ((state: T) => S),
    comparer?: (x: any, y: any) => boolean): Observable<S> {

    const VALID_SELECTORS = ['string', 'number', 'symbol', 'function'];
    const ERROR_MESSAGE = `Expected selector to be one of: 
${VALID_SELECTORS.join(',')}. Instead recieved %s`;
    const checkSelector = (s) => VALID_SELECTORS.indexOf(typeof s, 0) >= 0;
    invariant(checkSelector(selector), ERROR_MESSAGE, selector);

    if (
      typeof selector === 'string' ||
      typeof selector === 'number' ||
      typeof selector === 'symbol') {
      return this.store
        .map(state => state[selector])
        .distinctUntilChanged()
    } else if (typeof selector === 'function') {
      return this.store
        .map(selector).distinctUntilChanged();
    }

  }

  dispatch = (action: Action) => this._ngRedux.dispatch(action)
  
  observableFromStore = (store: Store<T>) => {
    return new BehaviorSubject(store.getState());
  };
}
