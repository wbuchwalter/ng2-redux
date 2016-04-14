import 'reflect-metadata';
import * as sinonChai from 'sinon-chai';
import { createStore } from 'redux';
import {expect, use} from 'chai';
import {NgRedux} from '../../components/ng-redux';
import * as _ from 'lodash';
import * as sinon from 'sinon';
use(sinonChai);

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
        expect(state.foo).to.equal('bar');
        expect(state.baz).to.equal(-1);

        done();
      });
  });

  it('should accept a keyname for a selector', (done) => {
    let ngRedux = new NgRedux<IAppState>(store);
    let foo$ = ngRedux
      .select('foo')
      .subscribe(stateSlice => {
        expect(stateSlice).to.equal('bar');
        done();
      });
  });

  it('should not trigger a selector if that slice of state was not changed',
    (): void => {
      let ngRedux = new NgRedux<IAppState>(store);
      let fooData;
      
      let spy = sinon.spy((foo) => { fooData = foo; });
      
      
      let foo$ = ngRedux
        .select('foo')
        .subscribe(spy);

      ngRedux.dispatch({ type: 'UPDATE_BAR', payload: 0 });
          
      expect(spy).to.have.been.calledOnce;
      
      expect(fooData).to.equal('bar');
      ngRedux.dispatch({ type: 'UPDATE_FOO', payload: 'changeFoo' });
      expect(spy).to.have.been.calledTwice;
      expect(fooData).to.equal('changeFoo');
      foo$.unsubscribe();

    });

  it('should not trigger a selector if the action payload is the same',
    (): void => {
      let ngRedux = new NgRedux<IAppState>(store);
      let fooData;
      let spy = sinon.spy((foo) => { fooData = foo; });
      let foo$ = ngRedux
        .select('foo')
        .subscribe(spy);

      expect(spy).to.have.been.calledOnce;
      expect(fooData).to.equal('bar');

      ngRedux.dispatch({ type: 'UPDATE_FOO', payload: 'bar' });
      expect(spy).to.have.been.calledOnce;
      expect(fooData).to.equal('bar');
      foo$.unsubscribe();

    });







});
