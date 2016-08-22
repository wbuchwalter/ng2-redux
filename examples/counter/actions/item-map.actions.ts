import { Injectable } from '@angular/core';
import { NgRedux } from 'ng2-redux';

@Injectable()
export class ItemMapActions {
  static SET_CURRENT_ITEM = 'SET_CURRENT_ITEM';
  static UPDATE_ITEM_NAME = 'UPDATE_ITEM_NAME';

  constructor(private ngRedux: NgRedux<any>) {}

  setCurrentItem(itemId: Number) {
    this.ngRedux.dispatch({
      type: 'SET_CURRENT_ITEM',
      payload: itemId,
    });
  }

  updateItemName(itemId: string, name: string) {
    this.ngRedux.dispatch({
      type: 'UPDATE_ITEM_NAME',
      payload: {
        itemId,
        name,
      },
    });
  }
}
