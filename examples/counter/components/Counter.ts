import { Component } from '@angular/core';
import { NgRedux, select } from 'ng2-redux';
import { CounterActions } from '../actions/counter-actions';
import { RandomNumberService } from '../services/random-number';

@Component({
  selector: 'counter',
  providers: [ CounterActions, RandomNumberService ],
  template: `
  <p>
    Clicked: {{ counter$ | async }} times
    <button (click)="actions.increment()">+</button>
    <button (click)="actions.decrement()">-</button>
    <button (click)="actions.incrementIfOdd()">Increment if odd</button>
    <button (click)="actions.incrementAsync(2222)">Increment async</button>
    <button (click)="actions.randomize()">Set to random number</button>

    <br>
    foo$: {{ foo$ | async | json }}
    <br>
    bar$: {{ bar$ | async}}
  </p>
  `
})
export class Counter {
  @select('counter') counter$: any;
  @select([ 'pathDemo', 'foo' ]) foo$;
  @select([ 'pathDemo', 'foo', 'bar', 0 ]) bar$: number;

  constructor(private actions: CounterActions, private random: RandomNumberService) { }
  ngOnInit() {
    this.random.counter$.subscribe(n => {
      console.log('Helllo', n);
    })
  }
  
}
