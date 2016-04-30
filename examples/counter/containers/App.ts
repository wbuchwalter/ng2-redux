import {Component, Inject, OnDestroy, ApplicationRef} from 'angular2/core';
import {Observable} from 'rxjs';
import {AsyncPipe} from 'angular2/common';
import {Counter} from '../components/Counter';
const CounterActions = require('../actions/CounterActions');
import {NgRedux} from 'ng2-redux';
import {bindActionCreators} from 'redux';
import {RootState} from '../store/configureStore';

console.log('COUNTER_ACTIONS', CounterActions)

@Component({
    selector: 'root',
    directives: [Counter],
    pipes: [AsyncPipe],
    template: `
  <counter [counter]="counter"
    [increment]="actions.increment"
    [decrement]="actions.decrement"
    [incrementIfOdd]="actions.incrementIfOdd"
    [incrementAsync]="actions.incrementAsync">
  </counter>
  `
})

export class App {
    disconnect: (a?:any) => void;

    constructor(
        private ngRedux: NgRedux<RootState>,
        private applicationRef: ApplicationRef) {}

    ngOnInit() {
        this.disconnect = this.ngRedux.connect(
            this.mapStateToTarget,
            this.mapDispatchToTarget)(this);
    }

    mapDispatchToTarget(dispatch) {
        return {
            actions: bindActionCreators(CounterActions, dispatch)
        };
    }

    mapStateToTarget(state) {
        return { counter: state.counter };
    }

    ngOnDestroy() {
        this.disconnect();
    }
}
