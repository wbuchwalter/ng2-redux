var redux_1 = require('redux');
function wrapActionCreators(actionCreators) {
    return function (dispatch) { return redux_1.bindActionCreators(actionCreators, dispatch); };
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = wrapActionCreators;
