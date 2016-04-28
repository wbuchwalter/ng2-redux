import {Component, Inject, OnDestroy} from 'angular2/core';
import {Observable} from 'rxjs';
import {AsyncPipe} from 'angular2/common';
import {Counter} from '../components/Counter';
import * as CounterActions from '../actions/CounterActions';
import {NgRedux, Select, Dispatch} from '../../../src';

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

export class App {
    
    @Select() counter$: any;
    @Select(state => state.counter) funcCounter$;
    @Select('counter') stringKey$;
    @Select(state => state.counter * 2) counterX2$: Observable<any>;
    foo: any;
    @Dispatch(CounterActions.increment) increment: () => any;
    @Dispatch(CounterActions.decrement) decrement: () => any;
    @Dispatch(CounterActions.incrementIfOdd) incrementIfOdd: () => any;
    @Dispatch(CounterActions.incrementAsync) incrementAsync: () => any;

    
    constructor(private ngRedux: NgRedux<RootState>,
        @Inject('devTools') private devTools) {
    }

    ngOnInit() {
        this.devTools.start(this.ngRedux);
        this.counterX2$.combineLatest(this.stringKey$, (x, y) => {
            return { x: x * 2, y: y * 3 };
        }).subscribe(n => {
            this.foo = n;
        })
    }

}
