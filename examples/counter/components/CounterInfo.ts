import {Component, Input} from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { select } from 'ng2-redux';
import 'rxjs/add/operator/combineLatest';

@Component({
  selector: 'counter-info',
  template: `
  <ul>
     <li>{{ funcCounter$ | async }}</li>
     <li>{{ stringKey$ | async }}</li>
     <li>{{ counterX2$ | async }}</li>
     <li>{{ reactiveExample$ | async | json }}</li>
     <li>{{ subscribedValue?.x }} - {{ subscribedValue?.y }}</li>
  <ul>
  `
})
export class CounterInfo {

    @select(state => state.counter) funcCounter$: Observable<number>;
    @select('counter') stringKey$: Observable<number>;
    @select(state => state.counter * 2) counterX2$: Observable<any>;

    reactiveExample$ = this.counterX2$.combineLatest(this.stringKey$, (x, y) => {
        return { x: x * 2, y: y * 3 };
    });

    subscribedValue: any;

    constructor() {
        this.reactiveExample$.subscribe(n => {
            this.subscribedValue = n;
        });
    }
}
    
