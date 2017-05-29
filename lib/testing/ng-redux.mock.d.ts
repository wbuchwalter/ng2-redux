import { Selector, Comparator, PathSelector } from '@angular-redux/store';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/observable/from';
import 'rxjs/add/operator/distinctUntilChanged';
import { MockObservableStore } from './observable-store.mock';
/**
 * Convenience mock to make it easier to control selector
 * behaviour in unit tests.
 */
export declare class MockNgRedux<RootState> extends MockObservableStore<RootState> {
    static mockInstance: MockNgRedux<any>;
    /**
     * Returns a subject that's connected to any observable returned by the
     * given selector. You can use this subject to pump values into your
     * components or services under test; when they call .select or @select
     * in the context of a unit test, MockNgRedux will give them the values
     * you pushed onto your stub.
     */
    static getSelectorStub<R, S>(selector?: Selector<R, S>, comparator?: Comparator): Subject<S>;
    /**
     * Returns a mock substore that allows you to set up selectorStubs for
     * any 'fractal' stores your app creates with NgRedux.configureSubStore.
     *
     * If your app creates deeply nested substores from other substores,
     * pass the chain of pathSelectors in as ordered arguments to mock
     * the nested substores out.
     * @param pathSelectors
     */
    static getSubStore<S>(...pathSelectors: PathSelector[]): MockObservableStore<S>;
    /**
     * Reset all previously configured stubs.
     */
    static reset(): void;
    /** @hidden */
    constructor();
}
