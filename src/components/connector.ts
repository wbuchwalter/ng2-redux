import shallowEqual from '../utils/shallowEqual';
import wrapActionCreators from '../utils/wrapActionCreators';
import * as Redux from 'redux';
import * as invariant from 'invariant';
import * as _ from 'lodash';

export default class Connector<RootState> {
    private _store: Redux.Store<RootState>;
    private _defaultMapStateToTarget: Function;
    private _defaultMapDispatchToTarget: Function;

    
    constructor(store: Redux.Store<RootState>) {
        this._store = store;
        this._defaultMapStateToTarget = () => ({});
        this._defaultMapDispatchToTarget = dispatch => ({ dispatch });
    }

    wrapActionCreators = (actions) => wrapActionCreators(actions);
    
    mapDispatchToTarget = (actions) => target => {
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
