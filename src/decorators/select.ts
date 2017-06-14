import { Observable } from 'rxjs/Observable';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import 'rxjs/add/operator/let'
import { NgRedux } from '../components/ng-redux';
import { ObservableStore } from '../components/observable-store';
import { Selector, Comparator, Transformer } from '../components/selectors';
import { IFractalStoreOptions, getInstanceSelection } from './helpers';

/** @hidden - only exported to keep AoT happy. */
export const decorate = (
  selector: Selector<any, any>,
  transformer?: Transformer<any, any>,
  comparator?: Comparator): PropertyDecorator =>
  (target: any, key): void => {
    function getter(this: any) {
      return getInstanceSelection(
        this,
        key,
        selector,
        transformer,
        comparator);
    }

    // Replace decorated property with a getter that returns the observable.
    if (delete target[key]) {
      Object.defineProperty(target, key, {
        get: getter,
        enumerable: true,
        configurable: true
      });
    }
  }

/**
 * Selects an observable from the store, and attaches it to the decorated
 * property.
 *
 * @param selector
 * A selector function, property name string, or property name path
 * (array of strings/array indices) that locates the store data to be
 * selected
 *
 * @param comparator Function used to determine if this selector has changed.
 */
export const select = <T>(
  selector?: Selector<any, T>,
  comparator?: Comparator): PropertyDecorator =>

  (target: any, key: string): void => {
    const adjustedSelector = selector ?
      selector :
      (key.lastIndexOf('$') === key.length - 1) ?
        key.substring(0, key.length - 1) :
        key;
    decorate(adjustedSelector, undefined, comparator)(target, key);
  };

/**
 * Selects an observable using the given path selector, and runs it through the given
 * transformer function. A transformer function takes the store observable as an input and
 * returns a derived observable from it. That derived observable is run through
 * distinctUntilChanges with the given optional comparator and attached to the store property.
 *
 * Think of a Transformer as a FunctionSelector that operates on observables instead of
 * values.
 */
export const select$ = <T>(
  selector: Selector<any, T>,
  transformer: Transformer<any, T>,
  comparator?: Comparator): PropertyDecorator =>
    decorate(selector, transformer, comparator);
