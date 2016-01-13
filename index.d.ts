import {Store, Reducer} from 'redux';
import {Provider} from 'angular2/core';

export interface provider extends Function {
    (store: Store): Provider
}

export interface INgRedux {
    getReducer(): Reducer;
    replaceReducer(nextReducer: Reducer): void;
    dispatch(action: any): any;
    getState(): any;
    subscribe(listener: Function): Function;
    connect(
        mapStateToTarget: (state: any) => Object,
        mapDispatchToTarget?: Object | ((dispatch: Function) => Object)
    ): (target: Function | Object) => () => void;
}