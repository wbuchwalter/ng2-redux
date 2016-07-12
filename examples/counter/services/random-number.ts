import { Injectable } from '@angular/core';
import { select, NgRedux } from 'ng2-redux';
/**
 * Simple service designed to demonstrate using a DI-injected
 * service in your action creators.
 */
@Injectable()
export class RandomNumberService {
  @select('counter') counter$: any;
  counter: number; 
  constructor(private ngRedux: NgRedux<any>) { 
    ngRedux.select(n => n.counter).subscribe(n => {
      this.counter = n;
    });
  }
  pick() {
    return Math.floor(Math.random() * 100);
  }
}
