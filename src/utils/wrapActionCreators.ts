import { ActionCreator,ActionCreatorsMapObject, bindActionCreators, Dispatch } from 'redux';

export  default function wrapActionCreator
  <T extends ActionCreator<T> | ActionCreatorsMapObject>(actionCreators) {
  return (dispatch: Dispatch<any>): T  => bindActionCreators(actionCreators, dispatch);
}
/*
export default function wrapActionCreators
  <T extends ActionCreatorsMapObject, S extends Dispatch<S>>(actionCreators) {
  return (dispatch: S): T => bindActionCreators<T>(actionCreators, dispatch);
}
*/