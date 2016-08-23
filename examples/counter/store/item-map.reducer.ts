import { ItemMapActions } from '../actions/item-map.actions';
import { fromJS } from 'immutable';

const INITIAL_STATE = {
  currentItemId: '0',
  items: fromJS({
    '0': { name: 'An Item', id: '0' },
    '1': { name: 'Another Item', id: '1' }
  }),
};

export function itemMapReducer(state = INITIAL_STATE, action: any) {
  switch (action.type) {
    case ItemMapActions.SET_CURRENT_ITEM:
      return Object.assign({}, state, { currentItemId: action.payload });
    case ItemMapActions.UPDATE_ITEM_NAME:
      return {
        currentItemId: state.currentItemId,
        items: state.items.setIn(
          [ action.payload.itemId, 'name' ],
          action.payload.name)
      };
    default:
      return state;
  }
}
