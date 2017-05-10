import {
  NgRedux,
} from '../components/ng-redux';


export function dispatch(options?: any) {
  return function dispatch(target, key, descriptor?) {

    let originalMethod: Function;
    const wrapped = function (...args) {
      const result = originalMethod.apply(this, args);
      NgRedux.instance.dispatch(result);
      return result;
    }
    if (descriptor === undefined) {
      const dispatchDescriptor: PropertyDescriptor = {
        get: () => wrapped,
        set: (setMethod) => originalMethod = setMethod,
      }
      Object.defineProperty(target, key, dispatchDescriptor)

      // return descriptor;
    } else {
      originalMethod = descriptor.value;
      descriptor.value = wrapped;
      return descriptor;
    }

  }
}
