import {bootstrap} from 'angular2/platform/browser';
import { ComponentRef } from 'angular2/core';
import {App} from './containers/App';
import configureStore from './store/configureStore';
import {provider} from '../../src';
import {NgRedux, appInjector} from '../../src';

const devTools = require('./devTools');
const store = configureStore();

bootstrap(
  App,
  [
    provider(store),
    devTools

  ]
).then((appRef: ComponentRef) => {
  debugger;
  appInjector(appRef.injector)
});
