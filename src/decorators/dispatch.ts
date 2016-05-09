import { NgRedux } from '../components/ng-redux';

/**
 * Decorates the class property into a function that dispatches the action 
 * creator it receives.
 *
 * @param {function} func
 * A Redux Action Creator.
 */
export const dispatch = (func) => (targetClass, key, propertyDescriptor?) => {

    function dispatchingFunction () {
        NgRedux.instance.dispatch(<any>func.apply(this, arguments));
    }

    if (!!propertyDescriptor) {
        preAugmentFunction(propertyDescriptor,
                           'value',
                           dispatchingFunction);
    } else {
      preAugmentFunction(targetClass,
                         key,
                         dispatchingFunction);
    }

};

function preAugmentFunction(target, functionName, fn) {

  let oldFunction = target[functionName];

  target[functionName] = function() {
    if (oldFunction) {
      oldFunction.apply(this, arguments);
    }
    fn.apply(this, arguments);
  };

}
