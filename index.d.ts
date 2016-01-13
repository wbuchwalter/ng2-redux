import {Store, Reducer} from 'redux';
import {Provider} from 'angular2/core';

export function provider(store: Store): Provider;


export interface INgRedux extends Store {
    connect(
        mapStateToTarget: (state: any) => Object,
        mapDispatchToTarget?: Object | ((dispatch: Function) => Object)
    ): (target: Function | Object) => () => void;
}