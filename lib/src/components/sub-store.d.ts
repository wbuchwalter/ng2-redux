import { Dispatch, Reducer } from 'redux';
import { Observable } from 'rxjs/Observable';
import { PathSelector, Selector } from './selectors';
import { NgRedux } from './ng-redux';
import { ObservableStore, Comparator } from './observable-store';
/** @hidden */
export declare class SubStore<State> implements ObservableStore<State> {
    private rootStore;
    private basePath;
    constructor(rootStore: NgRedux<any>, basePath: PathSelector, localReducer: Reducer<State>);
    dispatch: Dispatch<State>;
    getState: () => State;
    configureSubStore: <SubState>(basePath: (string | number)[], localReducer: Reducer<SubState>) => ObservableStore<SubState>;
    select: <SelectedState>(selector?: Selector<State, SelectedState>, comparator?: Comparator) => Observable<SelectedState>;
    subscribe: (listener: any) => () => void;
    replaceReducer: (nextLocalReducer: Reducer<State>) => void;
}
