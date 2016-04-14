import { createStore } from 'redux';
import {NgRedux} from '../../components/ng-redux';
import * as _ from 'lodash';
import * as sinon from 'sinon';
import { fakeAsync, tick, expect } from 'angular2/testing';

interface IAppState {
  foo: string;
  baz: number;

}

describe('NgRedux Observable Store', () => {
  let store;
  let connector;
  let targetObj;
  let defaultState;

  beforeEach(() => {
    defaultState = {
      foo: 'bar',
      baz: -1,
    };

    store = createStore((state = defaultState, action) => {
      switch (action.type) {
        case 'UPDATE_FOO':
          return Object.assign({}, state, { foo: action.payload });
        case 'UPDATE_BAZ':
          return Object.assign({}, state, { baz: action.payload });
        default:
          return state;
      }
    });


  })

  it('should get the initial state', (done) => {
    let ngRedux = new NgRedux<IAppState>(store);
    let state$ = ngRedux
      .select(state => state)
      .subscribe(state => {
        expect(state.foo).toEqual('bar');
        expect(state.baz).toEqual(-1);

        done();
      });
  });

  it('should accept a keyname for a selector', (done) => {
    let ngRedux = new NgRedux<IAppState>(store);
    let foo$ = ngRedux
      .select('foo')
      .subscribe(stateSlice => {
        expect(stateSlice).toEqual('bar');
        done();
      });
  });

  it('should not trigger a selector if that slice of state was not changed',
    <any>fakeAsync((): void => {
      let ngRedux = new NgRedux<IAppState>(store);
      let fooData;
      let fooHandler = {
        subscribe: foo => { fooData = foo; }
      }
      spyOn(fooHandler, 'subscribe').and.callThrough();
      let foo$ = ngRedux
        .select('foo')
        .subscribe(fooHandler.subscribe);

      ngRedux.dispatch({ type: 'UPDATE_BAR', payload: 0 });

      expect(fooHandler.subscribe).toHaveBeenCalledTimes(1);
      expect(fooData).toEqual('bar');
      ngRedux.dispatch({ type: 'UPDATE_FOO', payload: 'changeFoo' });
      expect(fooHandler.subscribe).toHaveBeenCalledTimes(2);
      expect(fooData).toEqual('changeFoo');


    }));

  it('should not trigger a selector if the action payload is the same',
    <any>fakeAsync((): void => {
      let ngRedux = new NgRedux<IAppState>(store);
      let fooData;
      let fooHandler = {
        subscribe: foo => { fooData = foo; }
      }
      spyOn(fooHandler, 'subscribe').and.callThrough();
      let foo$ = ngRedux
        .select('foo')
        .subscribe(fooHandler.subscribe);

      expect(fooHandler.subscribe).toHaveBeenCalledTimes(1);
      expect(fooData).toEqual('bar');

      ngRedux.dispatch({ type: 'UPDATE_FOO', payload: 'bar' });
      expect(fooHandler.subscribe).toHaveBeenCalledTimes(1);
      expect(fooData).toEqual('bar');


    }));







});
