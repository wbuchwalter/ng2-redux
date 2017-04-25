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
  public static mockInstance: MockNgRedux<any> = null;
  private static selections: SelectorStubMap = {};

  public static getSelectorStub<R, S>(
    selector?: Selector<R, S>,
    comparator?: Comparator): Subject<S> {
    return MockNgRedux.initSelectorStub<R, S>(selector, comparator).subject;
  }

  public static reset(): void {
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

  public constructor() {
    super(null);

    NgRedux.instance = this; // This hooks the mock up to @select.
    MockNgRedux.mockInstance = this;
  }

  public dispatch = () => null;

  public select<S>(selector?: Selector<RootState, S>, comparator?: Comparator): Observable<any> {
    const stub = MockNgRedux.initSelectorStub<RootState, S>(selector, comparator);
    return stub.comparator ?
      stub.subject.distinctUntilChanged(stub.comparator) :
      stub.subject;
  }
}
