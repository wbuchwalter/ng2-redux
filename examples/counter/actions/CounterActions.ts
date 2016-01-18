export const INCREMENT_COUNTER:string = 'INCREMENT_COUNTER';
export const DECREMENT_COUNTER:string = 'DECREMENT_COUNTER';

export interface ICounterDispatch extends Redux.Map<Redux.ActionCreator>{
  increment(): Redux.Dispatch;
  decrement(): Redux.Dispatch;
  incrementIfOdd(): Redux.Dispatch;
  incrementAsync(): Redux.Dispatch;
}

export var increment = () => {
  return <Redux.Action>{
    type: INCREMENT_COUNTER
  };
}

export var decrement = () => {
  return <Redux.Action>{
    type: DECREMENT_COUNTER
  };
}

export var incrementIfOdd = () => {
  return (dispatch, getState) => {
    const { counter } = getState();

    if (counter % 2 === 0) {
      return;
    }

    dispatch(increment());
  };
}

export var incrementAsync = (delay:number = 1000) => {
  return dispatch => {
    setTimeout(() => {
      dispatch(increment());
    }, delay);
  };
}
