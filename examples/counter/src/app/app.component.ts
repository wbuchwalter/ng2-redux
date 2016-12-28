import { Component } from '@angular/core';
import { NgRedux, DevToolsExtension } from 'ng2-redux';
import { IAppState, rootReducer, enhancers } from '../store/index';
const createLogger = require('redux-logger');

@Component({
  selector: 'app-root',
  styleUrls: [ './app.component.css' ],
  templateUrl: './app.component.html',
})
export class App {
  constructor(
    private ngRedux: NgRedux<IAppState>,
    private devTool: DevToolsExtension) {

    this.ngRedux.configureStore(
      rootReducer,
      {},
      [ createLogger() ],
      [ ...enhancers, devTool.isEnabled() ? devTool.enhancer() : f => f]);
  }
}
