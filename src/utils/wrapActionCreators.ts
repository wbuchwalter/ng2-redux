import { ActionCreator,ActionCreatorsMapObject, bindActionCreators, Dispatch } from 'redux';

type Test<T> = ActionCreator<T> | ActionCreatorsMapObject;

export default function wrapActionCreators
  <T extends ActionCreator<T>, S extends Dispatch<S>>(actionCreators) {
  return (dispatch: S): T => bindActionCreators<T>(actionCreators, dispatch);
}
/*
export default function wrapActionCreators
  <T extends ActionCreatorsMapObject, S extends Dispatch<S>>(actionCreators) {
  return (dispatch: S): T => bindActionCreators<T>(actionCreators, dispatch);
}
*/