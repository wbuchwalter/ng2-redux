import { Component } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { NgRedux,
         dispatchAll,
         select } from 'ng2-redux';
import * as CounterActions from '../actions/CounterActions';

@Component({
  selector: 'counter',
  template: `
  <p>
    Clicked: {{ counter$ | async }} times
    <button (click)="increment()">+</button>
    <button (click)="decrement()">-</button>
    <button (click)="incrementIfOdd()">Increment if odd</button>
    <button (click)="incrementAsync(2222)">Increment async</button>
  </p>
  `
})
@dispatchAll(CounterActions)
export class Counter {
    @select() counter$: Observable<number>;
}
