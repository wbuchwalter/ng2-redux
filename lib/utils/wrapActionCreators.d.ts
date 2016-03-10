export default function wrapActionCreators<T extends Redux.Map<Redux.ActionCreator>, TP extends Redux.Map<Redux.PartialDispatch>>(actionCreators: any): (dispatch: any) => TP;
