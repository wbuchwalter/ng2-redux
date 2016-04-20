import {Component, Inject, OnDestroy} from 'angular2/core';
import {Observable} from 'rxjs';
import {AsyncPipe} from 'angular2/common';
import {Counter} from '../components/Counter';
import * as CounterActions from '../actions/CounterActions';
import {NgRedux} from '../../../src';

import {RootState} from '../store/configureStore';

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
    
    counter$: any;

    // Will be added to instance with mapDispatchToTarget

    increment: () => any;
    decrement: () => any;
    
    constructor(private ngRedux: NgRedux<RootState>,
        @Inject('devTools') private devTools) {
    }

    ngOnInit() {
        let {increment, decrement } = CounterActions;
        this.devTools.start(this.ngRedux);
        this.counter$ = this.ngRedux
            .select(state => state.counter);
        this.ngRedux.mapDispatchToTarget({ increment, decrement })(this);
    }

    // Can also call ngRedux.dispatch directly

    incrementIfOdd = () => this.ngRedux
        .dispatch(CounterActions.incrementIfOdd());

    incrementAsync = () => this.ngRedux
        .dispatch(CounterActions.incrementAsync());

}
