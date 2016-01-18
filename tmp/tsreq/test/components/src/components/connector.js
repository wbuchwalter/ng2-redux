var shallowEqual_1 = require('../utils/shallowEqual');
var wrapActionCreators_1 = require('../utils/wrapActionCreators');
var invariant = require('invariant');
var _ = require('lodash');
var Connector = (function () {
    function Connector(store) {
        var _this = this;
        this.connect = function (mapStateToTarget, mapDispatchToTarget) {
            var finalMapStateToTarget = mapStateToTarget || _this._defaultMapStateToTarget;
            var finalMapDispatchToTarget = _.isPlainObject(mapDispatchToTarget) ?
                wrapActionCreators_1.default(mapDispatchToTarget) :
                mapDispatchToTarget || _this._defaultMapDispatchToTarget;
            invariant(_.isFunction(finalMapStateToTarget), 'mapStateToTarget must be a Function. Instead received $s.', finalMapStateToTarget);
            invariant(_.isPlainObject(finalMapDispatchToTarget) || _.isFunction(finalMapDispatchToTarget), 'mapDispatchToTarget must be a plain Object or a Function. Instead received $s.', finalMapDispatchToTarget);
            var slice = _this.getStateSlice(_this._store.getState(), finalMapStateToTarget);
            var boundActionCreators = finalMapDispatchToTarget(_this._store.dispatch);
            return function (target) {
                invariant(_.isFunction(target) || _.isObject(target), 'The target parameter passed to connect must be a Function or a plain object.');
                //Initial update
                _this.updateTarget(target, slice, boundActionCreators);
                var unsubscribe = _this._store.subscribe(function () {
                    var nextSlice = _this.getStateSlice(_this._store.getState(), finalMapStateToTarget);
                    if (!shallowEqual_1.default(slice, nextSlice)) {
                        slice = nextSlice;
                        _this.updateTarget(target, slice, boundActionCreators);
                    }
                });
                return unsubscribe;
            };
        };
        this._store = store;
        this._defaultMapStateToTarget = function () { return ({}); };
        this._defaultMapDispatchToTarget = function (dispatch) { return ({ dispatch: dispatch }); };
    }
    Connector.prototype.updateTarget = function (target, StateSlice, dispatch) {
        if (_.isFunction(target)) {
            target(StateSlice, dispatch);
        }
        else {
            _.assign(target, StateSlice, dispatch);
        }
    };
    Connector.prototype.getStateSlice = function (state, mapStateToScope) {
        var slice = mapStateToScope(state);
        invariant(_.isPlainObject(slice), '`mapStateToScope` must return an object. Instead received %s.', slice);
        return slice;
    };
    return Connector;
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Connector;
