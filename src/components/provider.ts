import { BehaviorSubject, Observable } from 'rxjs';
import Connector from './connector';
import {provide, Injector, Provider, Inject, Injectable} from 'angular2/core';
import * as Redux from 'redux';


export interface IConnect {
  (mapStateToTarget: Function, mapDispatchToTarget: Function);
}
export interface INgRedux<T> extends Redux.Store<T> {
  connect: IConnect
  mapDispatchToTarget: Function
}

export function provider<T>(store: Redux.Store<T>) {
  const _connector = new Connector(store);
  const factory = (): INgRedux<T> => <INgRedux<T>>Object.assign({},
    { connect: _connector.connect,
      mapDispatchToTarget: _connector.mapDispatchToTarget
    },
    store);
  return provide('ngRedux', { useFactory: factory });
}
