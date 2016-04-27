import * as Redux from 'redux';
const {createStore, applyMiddleware, compose} = Redux;
const thunk = require('redux-thunk').default;
import reducer from '../reducers/index';
const devTools = require('redux-devtools').devTools;

export interface RootState {
  counter: number;
}

const finalCreateStore = <Redux.StoreEnhancerStoreCreator<RootState>>compose(
  applyMiddleware(thunk),
  devTools()
)(createStore);

export default () => {
  return finalCreateStore(reducer, {counter:0} as RootState);
}