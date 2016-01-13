import Connector from './connector';
import {provide, Injector} from 'angular2/core';
let redux = require('redux');

export function provider(store) {
  const _connector = new Connector(store);

  return provide('ngRedux', {useFactory: () => {
    return { connect: _connector.connect, ...store};
  }});
}
