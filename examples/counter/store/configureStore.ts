import * as Redux from 'redux';
const {createStore, applyMiddleware, compose} = Redux;
const thunk = require('redux-thunk');
import reducer from '../reducers/index';
const devTools = require('redux-devtools').devTools;

export interface RootState {
  counter: number;
}

const finalCreateStore = <Redux.CreateStore<RootState>>compose(
  applyMiddleware(thunk),
  devTools()
)(createStore);

export default () => {
  return finalCreateStore(reducer);
}