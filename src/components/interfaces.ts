import {Store} from 'redux';

export interface IConnect {
  (mapStateToTarget: Function, mapDispatchToTarget: Function);
}

export interface INgRedux<T> extends Store<T> {
  connect: IConnect;
  mapActions: Function;
}
