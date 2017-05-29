import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/let';
import { Selector } from '../components/selectors';
import { Comparator } from '../components/observable-store';
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
export declare function select<T>(selector?: Selector<any, T>, comparator?: Comparator): (target: any, key: string) => void;
export declare type Transformer<RootState, V> = (store$: Observable<RootState>) => Observable<V>;
/**
 * Selects an observable using the given path selector, and runs it through the given
 * transformer function. A transformer function takes the store observable as an input and
 * returns a derived observable from it. That derived observable is run through
 * distinctUntilChanges with the given optional comparator and attached to the store property.
 *
 * Think of a Transformer as a FunctionSelector that operates on observables instead of
 * values.
 */
export declare function select$<T>(selector: Selector<any, T>, transformer: Transformer<any, T>, comparator?: Comparator): (target: any, key: string) => void;
