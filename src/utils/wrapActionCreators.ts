import { bindActionCreators } from 'redux';

export default function wrapActionCreators<T extends
  Redux.Map<Redux.ActionCreator>,
    TP extends Redux.Map<Redux.PartialDispatch>>(actionCreators) {
  return dispatch => bindActionCreators<T, TP>(actionCreators, dispatch);
}
