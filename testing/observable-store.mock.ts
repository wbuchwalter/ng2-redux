import {
  NgRedux,
  Selector,
  Comparator,
  ObservableStore,
  PathSelector,
} from '@angular-redux/store';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { Reducer } from 'redux';
import { ReplaySubject } from 'rxjs/ReplaySubject';
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

export /** @hidden */
interface SubStoreStubMap {
  [basePath: string]: MockObservableStore<any>
}

/** @hidden */
export class MockObservableStore<State> implements ObservableStore<State> {
  selections: SelectorStubMap = {};
  subStores: SubStoreStubMap = {};
  
  getSelectorStub = <SelectedState>(
    selector?: Selector<State, SelectedState>,
    comparator?: Comparator): Subject<SelectedState> =>
      this.initSelectorStub<SelectedState>(selector, comparator).subject;

  reset = () => {
    Object.keys(this.subStores).forEach(k => this.subStores[k].reset());
    this.selections = {};
    this.subStores = {};
  }

  dispatch = () => null;
  replaceReducer = () => null;
  getState = () => null;
  subscribe = () => () => null;

  select = <SelectedState>(
    selector?: Selector<State, SelectedState>,
    comparator?: Comparator): Observable<any> => {
      const stub = this.initSelectorStub<SelectedState>(selector, comparator);
      return stub.comparator ?
        stub.subject.distinctUntilChanged(stub.comparator) :
        stub.subject;
    }

  configureSubStore = <SubState>(
    basePath: PathSelector,
    localReducer: Reducer<SubState>): ObservableStore<SubState> => {
      const result = new MockObservableStore<SubState>();
      this.subStores[JSON.stringify(basePath)] = result;
      return result;      
    }
  
  private initSelectorStub<SelectedState>(
    selector?: Selector<State, SelectedState>,
    comparator?: Comparator): SelectorStubRecord {

    const key = selector.toString();
    const record = this.selections[key] || {
      subject: new ReplaySubject<SelectedState>(),
      comparator,
    };

    this.selections[key] = record;
    return record;
  }
}
