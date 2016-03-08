import {Component, Inject, OnDestroy} from 'angular2/core';
import {bindActionCreators} from 'redux';
import {Counter} from '../components/Counter';
import * as CounterActions from '../actions/CounterActions';

@Component({
  selector: 'root',
  directives: [Counter],
  template: `
  <counter [counter]="counter"
    [increment]="increment"
    [decrement]="decrement"
    [incrementIfOdd]="incrementIfOdd"
    [incrementAsync]="incrementAsync">
  </counter>
  `
})
export class App {
  protected unsubscribe: Function;

  constructor(@Inject('ngRedux') private ngRedux,
              @Inject('devTools') private devTools) {
  }

  ngOnInit() {
    this.devTools.start(this.ngRedux);
    this.unsubscribe = this.ngRedux.connect(
      this.mapStateToThis, this.mapDispatchToThis)(this);
  }

  ngOnDestroy() {
    this.unsubscribe();
  }

  mapStateToThis(state) {
    return {
      counter: state.counter
    };
  }

  mapDispatchToThis(dispatch) {
    return bindActionCreators<any,
      CounterActions.ICounterDispatch>(CounterActions, dispatch);
  }
}
