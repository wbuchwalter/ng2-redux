import { NgRedux } from '@angular-redux/store';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/from';

// TODO: documentation
export class MockNgRedux extends NgRedux<any> {
  private static mockInstance: MockNgRedux = null;
  private static selections: Object = {};

  static spyOnDispatch(): jasmine.Spy {
    return spyOn(MockNgRedux.mockInstance, 'dispatch');
  }

  static spyOnSelect(): jasmine.Spy {
    return spyOn(MockNgRedux.mockInstance, 'select');
  }

  static registerSelection(selector, values) {
    MockNgRedux.selections[selector] = values;
  }

  static reset() {
    MockNgRedux.selections = {};
  }

  constructor() {
    super(null);

    // Also mock the static instance used by @select.
    NgRedux.instance = this;

    MockNgRedux.mockInstance = this;
  }

  dispatch = () => null;

  select(selector) {
    return Observable.from(MockNgRedux.selections[selector] || []);
  }
}
