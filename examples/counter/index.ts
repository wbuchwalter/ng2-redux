import {bootstrap} from 'angular2/platform/browser';
import {App} from './containers/App';
import configureStore from './store/configureStore';
import {provider} from '../../src';
import {NgRedux} from '../../src';

const devTools = require('./devTools');
const store = configureStore();

bootstrap(
  App,
  [
    provider(store),
    devTools
    
  ]
);
