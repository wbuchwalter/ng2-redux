import { BehaviorSubject } from 'rxjs';
import { Provider } from 'angular2/core';
import * as Redux from 'redux';
export declare function provider<T>(store: Redux.Store<T>): Provider;
export declare class NgRedux {
    store: any;
    _ngRedux: any;
    constructor(ngRedux: any);
    select(selector: any, comparer?: (x: any, y: any) => boolean): any;
    observableFromStore: (store: any) => BehaviorSubject<any>;
}
