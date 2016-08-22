import { Component } from '@angular/core';
import { NgRedux, select } from 'ng2-redux';
import { Observable } from 'rxjs/Observable';
import { ItemMapActions } from '../actions/item-map.actions';

@Component({
  selector: 'item-map-display',
  providers: [ ItemMapActions ],
  template: `
    <h3>Current Item</h3>
    <pre>{{ currentItem$ | async | json }}</pre>
    <button (click)="actions.setCurrentItem('1')">Set currentItemId to 1</button>
    <button (click)="actions.setCurrentItem('0')">Set currentItemId to 0</button><br>

    <button (click)="actions.updateItemName('0', 'wat')">
      Rename Item 0 to 'wat'
    </button>
  `
})
export class ItemMapDisplay {
  @select(currentItem) currentItem$: Observable<Object>;

  constructor(private actions: ItemMapActions) {}
}

function currentItem(state) {
  return state.itemMap.items.get(state.itemMap.currentItemId);
}
