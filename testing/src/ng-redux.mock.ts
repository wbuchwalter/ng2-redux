import {
  NgRedux,
  Selector,
  Comparator,
} from '@angular-redux/store';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { ReplaySubject } from 'rxjs/ReplaySubject';

import 'rxjs/add/observable/from';
import 'rxjs/add/operator/distinctUntilChanged';

// TODO: documentation
// TODO: unit tests.

interface SelectorStubRecord {
  subject: Subject<any>;
  comparator: Comparator;
}

interface SelectorStubMap {
  [selector: string]: SelectorStubRecord;
}

export class MockNgRedux<RootState> extends NgRedux<RootState> {
  private static mockInstance: MockNgRedux<any> = null;
  private static selections: SelectorStubMap = {};

  static getSelectorStub<R, S>(selector?: Selector<R, S>, comparator?: Comparator): Subject<S> {
    return MockNgRedux.initSelectorStub<R, S>(selector, comparator).subject;
  }

  static reset(): void {
    MockNgRedux.selections = {};
  }

  private static initSelectorStub<R, S>(
    selector?: Selector<R, S>,
    comparator?: Comparator): SelectorStubRecord {

    const key = selector.toString();
    const record = MockNgRedux.selections[key] || {
      subject: new ReplaySubject<S>(),
      comparator,
    };

    MockNgRedux.selections[key] = record;
    return record;
  }

  constructor() {
    super(null);

    NgRedux.instance = this; // This hooks the mock up to @select.
    MockNgRedux.mockInstance = this;
  }

  dispatch = () => null;

  select<S>(selector?: Selector<RootState, S>, comparator?: Comparator): Observable<any> {
    const stub = MockNgRedux.initSelectorStub<RootState, S>(selector, comparator);
    return stub.comparator ?
      stub.subject.distinctUntilChanged(stub.comparator) :
      stub.subject;
  }
}
