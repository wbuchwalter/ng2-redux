import { BehaviorSubject, Observable } from 'rxjs';
import Connector from './connector';
import {provide, Injector, Provider, Inject, Injectable} from 'angular2/core';
import * as Redux from 'redux';

interface IConnect {
  (mapStateToTarget: Function, mapDispatchToTarget: Function);
}

interface INgRedux<T> extends Redux.Store<T> {
  connect: IConnect
}

export function provider<T>(store: Redux.Store<T>) {
  const _connector = new Connector(store);
  const factory = (): INgRedux<T> => <INgRedux<T>>Object.assign({},
    { connect: _connector.connect },
    store);
  return provide('ngRedux', { useFactory: factory });
}

@Injectable()
export class NgRedux<T> {
  store: any;
  _ngRedux: any;
  
  constructor(@Inject('ngRedux') ngRedux) {
    this.store = this.observableFromStore(ngRedux);
    this._ngRedux = ngRedux;

    this._ngRedux.subscribe(() => this.store.next(this._ngRedux.getState()));
    Object.assign(this,ngRedux)
  }
 
  select<S>(selector: string | number | symbol | ((state: T) => S),
    comparer?: (x: any, y: any) => boolean): Observable<S> {
 
    if (
      typeof selector === 'string' ||
      typeof selector === 'number' ||
      typeof selector === 'symbol'
    ) {
      return this.store
        .map(state => state[selector]).distinctUntilChanged(comparer);
    }
    else if (typeof selector === 'function') {
      return this.store.map(selector).distinctUntilChanged(comparer);
    }
  }
  dispatch = (action) => this._ngRedux.dispatch(action);
  observableFromStore = (store) => new BehaviorSubject(store.getState());
}

