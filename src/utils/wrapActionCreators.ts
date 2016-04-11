import * as Redux from 'redux';

export default function wrapActionCreators<T extends Redux.ActionCreator<any>>(actionCreators) {
  return dispatch => Redux.bindActionCreators<T>(actionCreators, dispatch);
}
