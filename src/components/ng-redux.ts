import shallowEqual from '../utils/shallowEqual';
import wrapActionCreators from '../utils/wrapActionCreators';
import * as Redux from 'redux';
import * as invariant from 'invariant';
import * as _ from 'lodash';
import { BehaviorSubject, Observable } from 'rxjs';
import { Store, Action, ActionCreator, Reducer } from 'redux';
import {Injectable} from 'angular2/core';

const VALID_SELECTORS = ['string', 'number', 'symbol', 'function'];
const ERROR_MESSAGE = `Expected selector to be one of: 
${VALID_SELECTORS.join(',')}. Instead recieved %s`;
const checkSelector = (s) => VALID_SELECTORS.indexOf(typeof s, 0) >= 0;

@Injectable()
export class NgRedux<RootState> {
    private _store: Redux.Store<RootState>;
    private _store$: BehaviorSubject<RootState>;
    private _defaultMapStateToTarget: Function;
    private _defaultMapDispatchToTarget: Function;


    constructor(store: Redux.Store<RootState>) {
        this._store = store;
        this._store$ = this.observableFromStore(store);
        this._store.subscribe(() => this._store$.next(this._store.getState()));
        this._defaultMapStateToTarget = () => ({});
        this._defaultMapDispatchToTarget = dispatch => ({ dispatch });
        const cleanedStore = _.omit(store, ['dispatch', 'getState', 'subscribe', 'replaceReducer'])
        Object.assign(this, cleanedStore);
    }

    /**
     * @param store
     */
    observableFromStore = (store: Store<RootState>) => {
        return new BehaviorSubject(store.getState());
    };

    /**
     * @param selector
     * @param comparer
     * @returns {Observable<S>}
     */
    select<S>(selector: string | number | symbol | ((state: RootState) => S),
        comparer?: (x: any, y: any) => boolean): Observable<S> {


        invariant(checkSelector(selector), ERROR_MESSAGE, selector);

        if (
            typeof selector === 'string' ||
            typeof selector === 'number' ||
            typeof selector === 'symbol') {
            return this._store$
                .map(state => state[selector])
                .distinctUntilChanged(comparer);
        } else if (typeof selector === 'function') {
            return this._store$
                .map(selector).distinctUntilChanged(comparer);
        }

    }
    wrapActionCreators = (actions) => wrapActionCreators(actions);

    mapDispatchToTarget = (actions) => (target) => {
        return this.updateTarget(target, {}, this.getBoundActions(actions));
    };

    connect = (mapStateToTarget, mapDispatchToTarget) => {

        const finalMapStateToTarget = mapStateToTarget
            || this._defaultMapStateToTarget;

        invariant(
            _.isFunction(finalMapStateToTarget),
            'mapStateToTarget must be a Function. Instead received %s.',
            finalMapStateToTarget);

        let slice = this.getStateSlice(this._store.getState(),
            finalMapStateToTarget);

        const boundActionCreators = this.getBoundActions(mapDispatchToTarget);

        return (target) => {

            invariant(
                _.isFunction(target) || _.isObject(target),
                'The target parameter passed to connect must be a Function or' +
                'a plain object.'
            );

            // Initial update

            this.updateTarget(target, slice, boundActionCreators);

            const unsubscribe = this._store.subscribe(() => {
                const nextSlice = this.getStateSlice(this._store.getState(),
                    finalMapStateToTarget);

                if (!shallowEqual(slice, nextSlice)) {
                    slice = nextSlice;
                    this.updateTarget(target, slice, boundActionCreators);
                }
            });
            return unsubscribe;
        };

    };

    getState = (): RootState => {
        return this._store.getState();
    };

    subscribe = (listener: () => void) => {
        return this._store.subscribe(listener);
    };

    replaceReducer = (nextReducer: Reducer<RootState>) => {
        return this._store.replaceReducer(nextReducer);
    };

    dispatch = <A extends Action>(action: A): any => {
        return this._store.dispatch(action);
    };

    private updateTarget(target, StateSlice, dispatch) {
        if (_.isFunction(target)) {
            target(StateSlice, dispatch);
        } else {
            _.assign(target, StateSlice, dispatch);
        }
    }

    private getStateSlice(state, mapStateToScope) {
        const slice = mapStateToScope(state);

        invariant(
            _.isPlainObject(slice),
            '`mapStateToScope` must return an object. Instead received %s.',
            slice
        );

        return slice;
    }

    private getBoundActions = (actions) => {
        const finalMapDispatchToTarget = _.isPlainObject(actions) ?
            wrapActionCreators(actions) :
            actions || this._defaultMapDispatchToTarget;
        invariant(
            _.isPlainObject(finalMapDispatchToTarget)
            || _.isFunction(finalMapDispatchToTarget),
            'mapDispatchToTarget must be a plain Object or a Function. ' +
            'Instead received % s.',
            finalMapDispatchToTarget);

        return finalMapDispatchToTarget(this._store.dispatch);
    };

}
