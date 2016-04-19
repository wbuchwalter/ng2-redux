import { BehaviorSubject, Observable } from 'rxjs';
import Connector from './connector';
import {provide, Injector, Provider, Inject, Injectable} from 'angular2/core';
import * as Redux from 'redux';
import {INgRedux} from './interfaces';

export function provider<T>(store: Redux.Store<T>) {
  const _connector = new Connector(store);
  const factory = (): INgRedux<T> => <INgRedux<T>>Object.assign({},
    { connect: _connector.connect,
      mapDispatchToTarget: _connector.mapDispatchToTarget
    },
    store);
  return provide('ngRedux', { useFactory: factory });
}
