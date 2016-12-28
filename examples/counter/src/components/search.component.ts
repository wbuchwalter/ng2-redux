import { Component } from '@angular/core';
import { NgRedux, select } from 'ng2-redux';
import { Observable } from 'rxjs/Rx';
import { SearchActions } from '../actions/search.actions';
import { IAppState } from '../store';

@Component({
  selector: 'search',
  template: `
  <input
    id='search-input'
    type="text"
    class="search"
    #field (keyup)="handleKeyUp(field.value)"/>
  <p>Number of characters (from subscription): {{ numChars }}</p>
  <p>Number of characters (from async pipe): {{ numChars$ | async }}</p>
  <p>You entered: {{ search$ | async }}<p>
  `
})
export class SearchComponent {
  // Selected observables to test async pipe model.
  @select(['search', 'total']) numChars$: Observable<number>;
  @select(['search', 'keyword']) search$: Observable<string>;

  // Members to test subscribe model.
  numChars: number;
  keyword: string;

  constructor(
    public actions: SearchActions,
    private ngRedux: NgRedux<IAppState>) { }

  ngOnInit() {
    // Exercise the flow where a state change results in a new action.
    this.search$.subscribe(keyword => {
      if (keyword != '') {
        this.actions.fetchResultDispatch(keyword.length)
      }
    });

    // Exercise the flow where you set a member on change manually instead of
    // using async pipe.
    this.numChars$.subscribe(state => {
      this.numChars = state;
    });
  }

  handleKeyUp(value) {
    this.keyword = value;
    this.actions.searchDispatch(value);
  }
}
