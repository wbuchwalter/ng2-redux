import { Selector, Comparator, ObservableStore } from '@angular-redux/store';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { Reducer } from 'redux';
import 'rxjs/add/observable/from';
import 'rxjs/add/operator/distinctUntilChanged';
/** @hidden */
export interface SelectorStubRecord {
    subject: Subject<any>;
    comparator: Comparator;
}
/** @hidden */
export interface SelectorStubMap {
    [selector: string]: SelectorStubRecord;
}
/** @hidden */
export interface SubStoreStubMap {
    [basePath: string]: MockObservableStore<any>;
}
/** @hidden */
export declare class MockObservableStore<State> implements ObservableStore<State> {
    selections: SelectorStubMap;
    subStores: SubStoreStubMap;
    getSelectorStub: <SelectedState>(selector?: Selector<State, SelectedState>, comparator?: Comparator) => Subject<SelectedState>;
    reset: () => void;
    dispatch: (action: any) => any;
    replaceReducer: () => any;
    getState: () => any;
    subscribe: () => () => any;
    select: <SelectedState>(selector?: Selector<State, SelectedState>, comparator?: Comparator) => Observable<any>;
    configureSubStore: <SubState>(basePath: (string | number)[], localReducer: Reducer<SubState>) => ObservableStore<SubState>;
    getSubStore: <SubState>(...pathSelectors: (string | number)[][]) => MockObservableStore<SubState>;
    private initSubStore(basePath);
    private initSelectorStub<SelectedState>(selector?, comparator?);
}
