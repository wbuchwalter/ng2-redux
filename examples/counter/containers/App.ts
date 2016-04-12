import {Component, Inject, OnDestroy} from 'angular2/core';
import {bindActionCreators} from 'redux';
import {AsyncPipe} from 'angular2/common';
import {Counter} from '../components/Counter';
import * as CounterActions from '../actions/CounterActions';
import {NgRedux} from '../../../src';
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
  counter:number;
  counter$:any;
  constructor(private ngRedux:NgRedux,
              @Inject('devTools') private devTools) {
  }

  ngOnInit() {

    this.devTools.start(this.ngRedux);
    this.counter$ = this.ngRedux.select(state => state.counter);
    
  }

  ngOnDestroy() {
    
  }

  
  increment = () => this.ngRedux.dispatch(CounterActions.increment())
  decrement = () => this.ngRedux.dispatch(CounterActions.decrement())
  incrementIfOdd = () => this.ngRedux.dispatch(CounterActions.incrementIfOdd())
  incrementIfAsync = () => this.ngRedux.dispatch(CounterActions.incrementIfAsync())
  
}
