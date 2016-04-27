import {Component, Inject, OnDestroy} from 'angular2/core';
import {Observable} from 'rxjs';
import {AsyncPipe} from 'angular2/common';
import {Counter} from '../components/Counter';
import * as CounterActions from '../actions/CounterActions';
import {NgRedux, Select} from '../../../src';

import {RootState} from '../store/configureStore';

@Component({
    selector: 'root',
    directives: [Counter],
    pipes: [AsyncPipe],
    template: `
  <counter [counter]="counter$| async"
    [increment]="increment"
    [decrement]="decrement"
    [incrementIfOdd]="incrementIfOdd"
    [incrementAsync]="incrementAsync">
  </counter>
<ul>
    <li>{{ counter$ | async }}</li>
    <li>{{ funcCounter$ | async }}</li>
    <li>{{ stringKey$ | async }}</li>
    <li>{{ counterX2$ | async }}</li>
<ul>
  `
})

export class App {
    
//    counter$: any;

    // Will be added to instance with mapDispatchToTarget
    @Select() counter$: any;
    @Select(state => state.counter) funcCounter$;
    @Select('counter') stringKey$;
    @Select(state => state.counter * 2) counterX2$: Observable<any>;
    foo: any;
    increment: () => any;
    decrement: () => any;
    
    constructor(private ngRedux: NgRedux<RootState>,
        @Inject('devTools') private devTools) {
        
        
    }

    ngOnInit() {
        let {increment, decrement } = CounterActions;
        this.devTools.start(this.ngRedux);
        //this.counter$ = this.ngRedux
          //  .select(state => state.counter)
        this.ngRedux.mapDispatchToTarget({ increment, decrement })(this);

/*
TODO: fix this - wont work rightnow because if the decorator can't get a reference to ngRedux, it returns undefined
need a lazy way of being able to setup the decorator        

        this.counterX2$.combineLatest(this.stringKey$, (x, y) => {
            
            return { x: x, y: y };
        }).subscribe(n => {
            
            this.foo = n;
        })*/
    }

    // Can also call ngRedux.dispatch directly

    incrementIfOdd = () => this.ngRedux
        .dispatch(<any>CounterActions.incrementIfOdd());

    incrementAsync = () => this.ngRedux
        .dispatch(<any>CounterActions.incrementAsync());

}
