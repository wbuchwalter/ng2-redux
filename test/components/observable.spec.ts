// import expect from 'expect';
// import ObservableStore from '../../src/components/observable-store';
// import * as sinon from 'sinon';
// import * as _ from 'lodash';
//
// class ReduxMock {
//
//   private state;
//
//   getState = () => {
//     return this.state;
//   };
//
//   subscribe = (callback) => {
//     
//   };
//
// }
//
// describe('ObservableStore', () => {
//
//   let reduxMock = new ReduxMock();
//   let subject;
//
//   beforeEach(() => {
//     defaultState = {
//      foo: 'bar',
//      baz: -1
//     };
//     store = createStore((state = defaultState, action) => {
//      return {...state, baz: action.payload};
//     });
//     targetObj = {};
//     subject = new ObservableStore(reduxMock);
//   
//   });
//
//   context('#select', () => {
//     it('selects stuff', () => {
//       expect(true).toEqual(true);
//     });
//   });
//
// });
