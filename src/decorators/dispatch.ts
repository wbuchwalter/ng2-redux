import { NgRedux } from '../components/ng-redux';
import { getBaseStore } from './helpers';

/**
 * Auto-dispatches the return value of the decorated function.
 *
 * Decorate a function creator method with @dispatch and its return
 * value will automatically be passed to ngRedux.dispatch() for you.
 */
export const dispatch = () => (
  target: Object,
  key: string | symbol | number,
  descriptor?: PropertyDescriptor): any => {

  let originalMethod: Function;

  const wrapped = function (this: any, ...args) {
    const result = originalMethod.apply(this, args);
    const store = getBaseStore(this) || NgRedux.instance;
    store.dispatch(result);
    return result;
  }

  descriptor = descriptor || Object.getOwnPropertyDescriptor(target, key);
  if (descriptor === undefined) {
    const dispatchDescriptor: PropertyDescriptor = {
      get: () => wrapped,
      set: (setMethod) => originalMethod = setMethod,
    }
    Object.defineProperty(target, key, dispatchDescriptor)
    return dispatchDescriptor;
  } else {
    originalMethod = descriptor.value;
    descriptor.value = wrapped;
    return descriptor;
  }
}
