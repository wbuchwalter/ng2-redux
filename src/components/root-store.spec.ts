import { NgZone } from '@angular/core';
import { createStore, Reducer, Action, Store } from 'redux';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/combineLatest';

import { NgRedux } from './ng-redux';
import { RootStore } from './root-store';
import { select } from '../decorators/select';

const returnPojo = () => ({});

class MockNgZone {
  run = (fn: Function) => fn()
}

type PayloadAction = Action & { payload?: string | number };

const mockNgZone = new MockNgZone() as NgZone;

describe('NgRedux Observable Store', () => {
  let defaultState: IAppState;
  let rootReducer: Reducer<IAppState>;
  let store: Store<IAppState>;
  let ngRedux: NgRedux<IAppState>;

  beforeEach(() => {
    defaultState = {
      foo: 'bar',
      bar: 'foo',
      baz: -1,
    };

    rootReducer = (state = defaultState, action: PayloadAction) => {
      switch (action.type) {
        case 'UPDATE_FOO':
          return Object.assign({}, state, { foo: action.payload });
        case 'UPDATE_BAZ':
          return Object.assign({}, state, { baz: action.payload });
        case 'UPDATE_BAR':
          return Object.assign({}, state, { bar: action.payload });
        default:
          return state;
      }
    };

    store = createStore(rootReducer);
    ngRedux = new RootStore<IAppState>(mockNgZone);
    ngRedux.configureStore(rootReducer, defaultState);
  });

  it('should throw when the store is configured twice', () => {
    // Configured once in beforeEach, now we try to configure
    // it a second time.
    expect(ngRedux.configureStore.bind(ngRedux, rootReducer, defaultState))
      .toThrowError(Error);
  });

  it('should get the initial state', done => ngRedux
    .select()
    .subscribe((state: IAppState) => {
      expect(state.foo).toEqual('bar');
      expect(state.baz).toEqual(-1);
      done();
    }));

  it('should accept a keyname for a selector', done => ngRedux
    .select('foo')
    .subscribe(stateSlice => {
      expect(stateSlice).toEqual('bar');
      done();
    }));

  it('should not trigger a selector if that slice of state was not changed', () => {
    let fooData;

    const spy = jasmine
      .createSpy('spy')
      .and.callFake((foo: string) => { fooData = foo; });

    const foo$ = ngRedux
      .select('foo')
      .subscribe(spy);

    expect(spy.calls.count()).toEqual(1);
    ngRedux.dispatch({ type: 'UPDATE_BAR', payload: 0 });
    expect(spy.calls.count()).toEqual(1);

    expect(fooData).toEqual('bar');
    ngRedux.dispatch({ type: 'UPDATE_FOO', payload: 'changeFoo' });
    expect(spy.calls.count()).toEqual(2);
    expect(fooData).toEqual('changeFoo');
    foo$.unsubscribe();
  });

  it('should not trigger a selector if the action payload is the same', () => {
    let fooData;
    const spy = jasmine
      .createSpy('spy')
      .and.callFake((foo: string) => { fooData = foo; });
    const foo$ = ngRedux
      .select('foo')
      .subscribe(spy);

    expect(spy.calls.count()).toEqual(1);
    expect(fooData).toEqual('bar');

    ngRedux.dispatch({ type: 'UPDATE_FOO', payload: 'bar' });
    expect(spy.calls.count()).toEqual(1);
    expect(fooData).toEqual('bar');
    foo$.unsubscribe();
  });

  it('should not call the sub if the result of the function is the same', () => {
    let fooData;
    const spy = jasmine
      .createSpy('spy')
      .and.callFake((foo: string) => { fooData = foo; });
    const foo$ = ngRedux
      .select(state => `${state.foo}-${state.baz}`)
      .subscribe(spy);

    expect(spy.calls.count()).toEqual(1);
    expect(fooData).toEqual('bar--1');

    expect(spy.calls.count()).toEqual(1);
    expect(fooData).toEqual('bar--1');

    ngRedux.dispatch({ type: 'UPDATE_BAR', payload: 'bar' });
    expect(spy.calls.count()).toEqual(1);
    expect(fooData).toEqual('bar--1');

    ngRedux.dispatch({ type: 'UPDATE_FOO', payload: 'update' });
    expect(fooData).toEqual('update--1');
    expect(spy.calls.count()).toEqual(2);

    ngRedux.dispatch({ type: 'UPDATE_BAZ', payload: 2 });
    expect(fooData).toEqual('update-2');
    expect(spy.calls.count()).toEqual(3);
  });

  it(`should accept a custom compare function`, () => {
    interface IRecord { data?: string };
    let fooData: IRecord = {};

    const spy = jasmine.createSpy('spy')
      .and.callFake((data: IRecord) => fooData = data);
    const cmp = (a: IRecord, b: IRecord) => a.data === b.data;

    const foo$ = ngRedux
      .select(state => ({ data: `${state.foo}-${state.baz}` }), cmp)
      .subscribe(spy);

    expect(spy.calls.count()).toEqual(1);
    expect(fooData.data).toEqual('bar--1');

    ngRedux.dispatch({ type: 'UPDATE_BAR', payload: 'bar' });
    expect(spy.calls.count()).toEqual(1);
    expect(fooData.data).toEqual('bar--1');

    ngRedux.dispatch({ type: 'UPDATE_FOO', payload: 'update' });
    expect(fooData.data).toEqual('update--1');
    expect(spy.calls.count()).toEqual(2);

    ngRedux.dispatch({ type: 'UPDATE_BAZ', payload: 2 });
    expect(fooData.data).toEqual('update-2');
    expect(spy.calls.count()).toEqual(3);
  });

  it(`should only call provided select function if state changed`, () => {
    const selectSpy = jasmine
      .createSpy('selectSpy')
      .and.callFake((state: IAppState) => state.foo);

    ngRedux.select().subscribe(selectSpy);

    // called once to get the initial value
    expect(selectSpy.calls.count()).toEqual(1);
    // not called since no state was updated
    ngRedux.dispatch({ type: 'NOT_A_STATE_CHANGE' });
    expect(selectSpy.calls.count()).toEqual(1);
    ngRedux.dispatch({ type: 'UPDATE_FOO', payload: 'update' });
    expect(selectSpy.calls.count()).toEqual(2);
    ngRedux.dispatch({ type: 'NOT_A_STATE_CHANGE' });
    expect(selectSpy.calls.count()).toEqual(2);
  });

  it('should throw when the store is provided after it has been configured', () => {
    // Configured once in beforeEach, now we try to provide a store when
    // we already have configured one.
    expect(ngRedux.provideStore.bind(store)).toThrowError();
  });

  it('should wait until store is configured before emitting values', () => {
    class SomeService {
      foo: string;
      bar: string;
      baz: number;

      constructor(private _ngRedux: NgRedux<any>) {
        _ngRedux.select(n => n.foo).subscribe(foo => this.foo = foo);
        _ngRedux.select(n => n.bar).subscribe(bar => this.bar = bar);
        _ngRedux.select(n => n.baz).subscribe(baz => this.baz = baz);
      }
    }
    ngRedux = new RootStore<IAppState>(mockNgZone);

    const someService = new SomeService(ngRedux);
    ngRedux.configureStore(rootReducer, defaultState);
    expect(someService.foo).toEqual('bar');
    expect(someService.bar).toEqual('foo');
    expect(someService.baz).toEqual(-1);
  });

  it('should have select decorators work before store is configured', done => {
    class SomeService {
      @select() foo$: Observable<string>;
      @select() bar$: Observable<string>;
      @select() baz$: Observable<number>;
    }

    ngRedux = new RootStore<IAppState>(mockNgZone);

    const someService = new SomeService();
    someService
      .foo$
      .combineLatest(someService.bar$, someService.baz$)
      .subscribe(([foo, bar, baz]) => {
        expect(foo).toEqual('bar');
        expect(bar).toEqual('foo');
        expect(baz).toEqual(-1);
        done();
      });

    ngRedux.configureStore(rootReducer, defaultState);
  });

});

describe('Lazy Loaded Reducers', () => {
  interface LazyAppState {
    root: IAppState;
    child?: string;
  }

  let ngRedux: NgRedux<LazyAppState>;
  let defaultState: LazyAppState;
  let rootReducer: Reducer<IAppState>;

  beforeEach(() => {
    defaultState = {
      root: {
        foo: 'bar',
        bar: 'foo',
        baz: -1,
      },
    };

    rootReducer = (state = defaultState.root, action: PayloadAction) => {
      switch (action.type) {
        case 'UPDATE_FOO':
          return Object.assign({}, state, { foo: action.payload });
        case 'UPDATE_BAZ':
          return Object.assign({}, state, { baz: action.payload });
        case 'UPDATE_BAR':
          return Object.assign({}, state, { bar: action.payload });
        default:
          return state;
      }
    };

    ngRedux = new RootStore<LazyAppState>(mockNgZone);
  });

  describe('when configuring the store', () => {
    it('should be able to initialize the store with a reducers map object', done => {
      const rootReducers = { root: rootReducer };
      ngRedux.configureStore(rootReducers, defaultState);
      ngRedux.select(state => state)
        .subscribe(state => {
          expect(state.root.foo).toEqual('bar');
          expect(state.root.baz).toEqual(-1);
          done();
        })
    });
  });

  describe('when adding reducers', () => {
    const addedReducer = { child: (state = 'lazy', action: Action) => state };

    it('should throw if store was not initially configured with a reducers map object', () => {
      ngRedux.configureStore(rootReducer as any, defaultState);
      expect(ngRedux.addReducers.bind(addedReducer)).toThrowError();
    });

    it('should successfully add the new reducers to the state', done => {
      const rootReducers = { root: rootReducer };
      ngRedux.configureStore(rootReducers, defaultState);
      ngRedux.addReducers(addedReducer);
      ngRedux.select(state => state)
        .subscribe(state => {
          expect(state.root.foo).toEqual('bar');
          expect(state.child).toEqual('lazy');
          done();
        });
    });

    it('should overwrite existing root state keys', done => {
      const hijackReducer = {
        root: () => 'static state',
      };
      const rootReducers = { root: rootReducer };
      ngRedux.configureStore(rootReducers, defaultState);
      ngRedux.addReducers(hijackReducer);
      ngRedux.select(state => state)
        .subscribe(state => {
          expect(state.root).toEqual('static state');
          expect(state.root.foo).toBeUndefined();
          done();
        });
    });
  })
});

describe('Chained actions in subscriptions', () => {
  interface IAppState {
    keyword: string;
    keywordLength: number;
  };

  let defaultState: IAppState;
  let rootReducer: Reducer<IAppState>;
  let ngRedux: NgRedux<IAppState>;

  const doSearch = (word: string) => ngRedux.dispatch({ type: 'SEARCH', payload: word });
  const doFetch = (word: string) => ngRedux.dispatch({ type: 'SEARCH_RESULT', payload: word.length });

  beforeEach(() => {
    defaultState = {
      keyword: '',
      keywordLength: -1
    };

    rootReducer = (state = defaultState, action: PayloadAction) => {
      switch (action.type) {
        case 'SEARCH':
          return Object.assign({}, state, { keyword: action.payload });
        case 'SEARCH_RESULT':
          return Object.assign({}, state, { keywordLength: action.payload });
        default:
          return state;
      }
    };

    ngRedux = new RootStore<IAppState>(mockNgZone);
    ngRedux.configureStore(rootReducer, defaultState);
  });

  describe('dispatching an action in a keyword$ before length$ happens', () => {
    it(`length sub should be called twice`, () => {
      const keyword$ = ngRedux.select(n => n.keyword);
      let keyword = '';
      let length;
      const length$ = ngRedux.select(n => n.keywordLength);
      const lengthSpy = jasmine
        .createSpy('lengthSpy')
        .and.callFake((n: number) => length = n);
      let lenSub;
      let keywordSub;

      keywordSub = keyword$.
        filter(n => n !== '')
        .subscribe(n => {
          keyword = n;
          doFetch(n);
        });

      lenSub = length$.subscribe(lengthSpy);

      expect(keyword).toEqual('');
      expect(length).toEqual(-1);
      expect(lengthSpy.calls.count()).toEqual(1);

      doSearch('test');

      expect(lengthSpy.calls.count()).toEqual(2);
      expect(keyword).toEqual('test');
      expect(length).toEqual(4);
      keywordSub.unsubscribe();
      lenSub.unsubscribe();
    });

    it(`second sub should get most current state value`, () => {
      const keyword$ = ngRedux.select(n => n.keyword);
      let keyword = '';
      let length;
      const length$ = ngRedux.select(n => n.keywordLength);
      const lengthSpy = jasmine
        .createSpy('lengthSpy')
        .and.callFake((n: number) => length = n);
      let lenSub;
      let keywordSub;

      keywordSub = keyword$.
        filter(n => n !== '')
        .subscribe(n => {
          keyword = n;
          doFetch(n);
        });

      lenSub = length$.subscribe(lengthSpy);

      expect(keyword).toEqual('');
      expect(length).toEqual(-1);
      expect(lengthSpy.calls.count()).toEqual(1);

      doSearch('test');

      expect(keyword).toEqual('test');
      expect(length).toEqual(4);
      keywordSub.unsubscribe();
      lenSub.unsubscribe();
    });
  });

  describe('dispatching an action in a keyword$ after length$ happens', () => {
    it(`length sub should be called twice`, () => {
      const keyword$ = ngRedux.select(n => n.keyword);
      let keyword = '';
      let length;
      const length$ = ngRedux.select(n => n.keywordLength);
      const lengthSpy = jasmine
        .createSpy('lengthSpy')
        .and.callFake((n: number) => length = n);
      let lenSub;
      let keywordSub;

      lenSub = length$.subscribe(lengthSpy);
      keywordSub = keyword$.
        filter(n => n !== '')
        .subscribe(n => {
          keyword = n;
          doFetch(n);
        });

      expect(keyword).toEqual('');
      expect(length).toEqual(-1);
      expect(lengthSpy.calls.count()).toEqual(1);

      doSearch('test');

      expect(lengthSpy.calls.count()).toEqual(2);
      expect(keyword).toEqual('test');
      expect(length).toEqual(4);
      keywordSub.unsubscribe();
      lenSub.unsubscribe();
    });

    it(`first sub should get most current state value`, () => {
      const keyword$ = ngRedux.select(n => n.keyword);
      let keyword = '';
      let length;
      const length$ = ngRedux.select(n => n.keywordLength);
      const lengthSpy = jasmine
        .createSpy('lengthSpy')
        .and.callFake((n: number) => length = n);
      let lenSub;
      let keywordSub;

      lenSub = length$.subscribe(lengthSpy);
      keywordSub = keyword$.
        filter(n => n !== '')
        .subscribe(n => {
          keyword = n;
          doFetch(n);
        });

      expect(keyword).toEqual('');
      expect(length).toEqual(-1);
      expect(lengthSpy.calls.count()).toEqual(1);

      doSearch('test');
      expect(keyword).toEqual('test');
      expect(length).toEqual(4);
      keywordSub.unsubscribe();
      lenSub.unsubscribe();
    });
  });
});
