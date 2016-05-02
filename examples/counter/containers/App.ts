import {Component, Inject, OnDestroy} from 'angular2/core';
import {Observable} from 'rxjs';
import {AsyncPipe} from 'angular2/common';
import {Counter} from '../components/Counter';
import * as CounterActions from '../actions/CounterActions';
import {NgRedux, select, dispatch, dispatchAll} from '../../../src';

import {RootState} from '../store/configureStore';

@Component({
    selector: 'root',
    directives: [Counter],
    pipes: [AsyncPipe],
    template: `
  <counter [counter]="counter$| async"
    [increment]="increment"
    [decrement]="decrement"
    [incrementIfOdd]="incrementIfOdd"
    [incrementAsync]="incrementAsync">
  </counter>
<ul>
    <li>{{ counter$ | async }}</li>
    <li>{{ funcCounter$ | async }}</li>
    <li>{{ stringKey$ | async }}</li>
    <li>{{ counterX2$ | async }}</li>
    <li>{{ foo?.x }} - {{ foo?.y }}</li>
<ul>
  `
})

//@dispatchAll(CounterActions)
export class App {
    
    @select() counter$: any;
    @select(state => state.counter) funcCounter$;
    @select('counter') stringKey$;
    @select(state => state.counter * 2) counterX2$: Observable<any>;
    foo: any;
    @dispatch(CounterActions.increment) increment: () => any;
    @dispatch(CounterActions.decrement) decrement: () => any;
    @dispatch(CounterActions.incrementIfOdd) incrementIfOdd: () => any;
    @dispatch(CounterActions.incrementAsync) incrementAsync: () => any;

    ngOnInit() {
        this.counterX2$.combineLatest(this.stringKey$, (x, y) => {
            return { x: x * 2, y: y * 3 };
        }).subscribe(n => {
            this.foo = n;
        })
    }

}
