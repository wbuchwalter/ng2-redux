import {Component, Inject, OnDestroy} from 'angular2/core';
import {bindActionCreators} from 'redux';
import {Counter} from '../components/Counter';
import * as CounterActions from '../actions/CounterActions';
import {INgRedux} from 'ng2-redux'; 

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
export default class App implements OnDestroy {

  protected unsubscribe: Function;

  constructor( @Inject('ngRedux') ngRedux: INgRedux, @Inject('devTools') devTools) {
    devTools.start(ngRedux);
    this.unsubscribe = ngRedux.connect(this.mapStateToThis, this.mapDispatchToThis)(this);
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
    return bindActionCreators(CounterActions, dispatch);
  }
}
