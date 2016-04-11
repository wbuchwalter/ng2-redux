import {Injectable, Inject} from 'angular2/core';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class NgRedux {
  store: any;
  _ngRedux: any;
  
  constructor(@Inject('ngRedux') ngRedux) {
    this.store = this.observableFromStore(ngRedux);
    this._ngRedux = ngRedux;

    this._ngRedux.subscribe(() => this.store.next(this._ngRedux.getState()));
    Object.assign(this,ngRedux)
  }
 
  select(selector: any, comparer?:(x: any, y: any)=> boolean) {
 
    if (
      typeof selector === 'string' ||
      typeof selector === 'number' ||
      typeof selector === 'symbol'
    ) {
      return this.store.map(state => state[selector]).distinctUntilChanged(comparer);
    }
    else if (typeof selector === 'function') {
      return this.store.map(selector).distinctUntilChanged(comparer)
    }
  }

  observableFromStore = (store) => new BehaviorSubject(store.getState());
}