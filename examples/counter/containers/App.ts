import {Component, Inject, OnDestroy} from 'angular2/core';
import {bindActionCreators} from 'redux';
import {AsyncPipe} from 'angular2/common';
import {Counter} from '../components/Counter';
import * as CounterActions from '../actions/CounterActions';
import {NgRedux} from '../../../src';

interface IAppState {
    counter: number;
}

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
    protected unsubscribe: Function;
    counter: number;
    counter$: any;
    constructor(private ngRedux: NgRedux<IAppState>,
        @Inject('devTools') private devTools) {
    }

    ngOnInit() {

        this.devTools.start(this.ngRedux);
        this.counter$ = this.ngRedux.select(state => state.counter)
        //this.ngRedux.connect(()=>({}),CounterActions)(this)
        let {increment, decrement } = CounterActions
        this.ngRedux.mapDispatchToTarget({ increment, decrement })(this)



    }
    incrementIfOdd = () => this.ngRedux.dispatch(CounterActions.incrementIfOdd())
    incrementAsync = () => this.ngRedux.dispatch(CounterActions.incrementAsync())


    ngOnDestroy() {

    }




}
