import { Component } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { AsyncPipe } from '@angular/common';
import { NgRedux, select } from 'ng2-redux';

import { Counter } from '../components/Counter';
import * as CounterActions from '../actions/CounterActions';
import { RootState, enhancers } from '../store/configureStore';
import 'rxjs/add/operator/combineLatest';
import reducer from '../reducers/index';
const thunk = require('redux-thunk').default;
const createLogger = require('redux-logger');

@Component({
    selector: 'root',
    directives: [Counter],
    pipes: [AsyncPipe],
    template: `
    <counter [counter]="counter$ | async"
        [increment]="increment"
        [decrement]="decrement"
        [incrementIfOdd]="incrementIfOdd"
        [incrementAsync]="incrementAsync">
    </counter>
{{test?.x}} - {{test?.y}}

  `
})
export class App {
    @select() counter$: Observable<number>;
    @select('counter') counter2$: Observable<number>;
    test: any;
    constructor(private ngRedux: NgRedux<RootState>) {

        // Do this once in the top-level app component.
        this.ngRedux.configureStore(
            reducer,
            { counter: 0 },
            [ thunk, createLogger()  ],
            enhancers
        );

        this.counter$.combineLatest(this.counter2$,
            (x, y) => {
                
                return { x: x * 2, y: y * 3 };
            }).subscribe(n => {
                this.test = n;
            });

        // Do this in each component that needs to observe the
        // redux store.
      
    }

    increment = () => this.ngRedux.dispatch(
        CounterActions.increment());

    decrement = () => this.ngRedux.dispatch(
        CounterActions.decrement());

    incrementIfOdd = () => this.ngRedux.dispatch(
        <any>CounterActions.incrementIfOdd());

    incrementAsync = () => this.ngRedux.dispatch(
        <any>CounterActions.incrementAsync());
}
