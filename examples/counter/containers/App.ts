import { Component } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { AsyncPipe } from '@angular/common';
import { NgRedux } from 'ng2-redux';

import { Counter } from '../components/Counter';
import * as CounterActions from '../actions/CounterActions';
import { RootState, configureStore } from '../store/configureStore';

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
  `
})
export class App {
    counter$: Observable<number>;

    constructor(private ngRedux: NgRedux<RootState>) {
        // Do this once in the top-level app component.
        this.ngRedux.attach(configureStore());

        // Do this in each component that needs to observe the
        // redux store.
        this.counter$ = this.ngRedux.select<number>('counter');
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
