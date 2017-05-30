import { Store, Reducer, Middleware, StoreEnhancer, Unsubscribe, Dispatch } from 'redux';
import { NgZone } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/switchMap';
import { Selector } from './selectors';
import { ObservableStore, Comparator } from './observable-store';
export declare class NgRedux<RootState> implements ObservableStore<RootState> {
    private ngZone;
    /** @hidden */
    static instance: ObservableStore<any>;
    private _store;
    private _store$;
    /** @hidden */
    constructor(ngZone: NgZone);
    /**
     * Configures a Redux store and allows NgRedux to observe and dispatch
     * to it.
     *
     * This should only be called once for the lifetime of your app, for
     * example in the constructor of your root component.
     *
     * @param rootReducer Your app's root reducer
     * @param initState Your app's initial state
     * @param middleware Optional Redux middlewares
     * @param enhancers Optional Redux store enhancers
     */
    configureStore(rootReducer: Reducer<RootState>, initState: RootState, middleware?: Middleware[], enhancers?: StoreEnhancer<RootState>[]): void;
    /**
     * Accepts a Redux store, then sets it in NgRedux and
     * allows NgRedux to observe and dispatch to it.
     *
     * This should only be called once for the lifetime of your app, for
     * example in the constructor of your root component. If configureStore
     * has been used this cannot be used.
     *
     * @param store Your app's store
     */
    provideStore(store: Store<RootState>): void;
    getState: () => RootState;
    subscribe: (listener: () => void) => Unsubscribe;
    replaceReducer: (nextReducer: Reducer<RootState>) => void;
    dispatch: Dispatch<RootState>;
    select: <S>(selector?: Selector<RootState, S>, comparator?: Comparator) => Observable<S>;
    configureSubStore: <SubState>(basePath: (string | number)[], localReducer: Reducer<SubState>) => ObservableStore<SubState>;
    private setStore(store);
    private storeToObservable;
}
