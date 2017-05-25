import {
  NgRedux,
  Selector,
  Comparator,
  ObservableStore,
  PathSelector,
} from '@angular-redux/store';
import { Reducer, Action } from 'redux';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import 'rxjs/add/observable/from';
import 'rxjs/add/operator/distinctUntilChanged';
import { MockObservableStore } from './observable-store.mock';

/**
 * Convenience mock to make it easier to control selector
 * behaviour in unit tests.
 */
export class MockNgRedux<RootState> extends NgRedux<RootState> {
  static mockInstance: MockObservableStore<any> = null;

  /**
   * Returns a subject that's connected to any observable returned by the
   * given selector. You can use this subject to pump values into your
   * components or services under test; when they call .select or @select
   * in the context of a unit test, MockNgRedux will give them the values
   * you pushed onto your stub.
   */
  static getSelectorStub<R, S>(
    selector?: Selector<R, S>,
    comparator?: Comparator): Subject<S> {
    return MockNgRedux.mockInstance.getSelectorStub<S>(selector, comparator);
  }

  /**
   * Reset all previously configured stubs.
   */
  static reset(): void {
    MockNgRedux.mockInstance.reset();
  }

  dispatch = (action: Action) => MockNgRedux.mockInstance.dispatch();
  replaceReducer = () => MockNgRedux.mockInstance.replaceReducer();
  getState = () => MockNgRedux.mockInstance.getState();
  subscribe = () => () => MockNgRedux.mockInstance.subscribe();

  select = <SelectedState>(
    selector?: Selector<RootState, SelectedState>,
    comparator?: Comparator): Observable<any> =>
      MockNgRedux.mockInstance.select(selector, comparator);

  configureSubStore = <SubState>(
    basePath: PathSelector,
    localReducer: Reducer<SubState>): ObservableStore<SubState> =>
      MockNgRedux.mockInstance.configureSubStore(basePath, localReducer);

  /** @hidden */
  constructor() {
    super(null);

    NgRedux.instance = this as NgRedux<any>; // This hooks the mock up to @select.
    MockNgRedux.mockInstance = new MockObservableStore<RootState>();
  }
}
