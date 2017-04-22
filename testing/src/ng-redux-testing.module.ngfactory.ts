/**
 * @fileoverview This file is generated by the Angular template compiler.
 * Do not edit.
 * @suppress {suspiciousCode,uselessCode,missingProperties}
 */
 /* tslint:disable */


import * as import0 from '@angular/core';
import * as import1 from './ng-redux-testing.module';
import * as import2 from './dev-tools.mock';
import * as import3 from '../../src/components/ng-redux';
import * as import4 from '../../src/components/dev-tools';
class NgReduxTestingModuleInjector extends import0.ɵNgModuleInjector<import1.NgReduxTestingModule> {
  _NgReduxTestingModule_0:import1.NgReduxTestingModule;
  __NgRedux_1:any;
  __DevToolsExtension_2:import2.MockDevToolsExtension;
  constructor(parent:import0.Injector) {
    super(parent,([] as any[]),([] as any[]));
  }
  get _NgRedux_1():any {
    if ((this.__NgRedux_1 == null)) { (this.__NgRedux_1 = import1._mockNgReduxFactory()); }
    return this.__NgRedux_1;
  }
  get _DevToolsExtension_2():import2.MockDevToolsExtension {
    if ((this.__DevToolsExtension_2 == null)) { (this.__DevToolsExtension_2 = new import2.MockDevToolsExtension(this.parent.get(import0.ApplicationRef),this._NgRedux_1)); }
    return this.__DevToolsExtension_2;
  }
  createInternal():import1.NgReduxTestingModule {
    this._NgReduxTestingModule_0 = new import1.NgReduxTestingModule();
    return this._NgReduxTestingModule_0;
  }
  getInternal(token:any,notFoundResult:any):any {
    if ((token === import1.NgReduxTestingModule)) { return this._NgReduxTestingModule_0; }
    if ((token === import3.NgRedux)) { return this._NgRedux_1; }
    if ((token === import4.DevToolsExtension)) { return this._DevToolsExtension_2; }
    return notFoundResult;
  }
  destroyInternal():void {
  }
}
export const NgReduxTestingModuleNgFactory:import0.NgModuleFactory<import1.NgReduxTestingModule> = new import0.NgModuleFactory<any>(NgReduxTestingModuleInjector,import1.NgReduxTestingModule);
//# sourceMappingURL=data:application/json;base64,eyJmaWxlIjoiL1VzZXJzL3NkYXZlbnBvL2NvZGUvYW5ndWxhci1yZWR1eC9zdG9yZS90ZXN0aW5nL3NyYy9uZy1yZWR1eC10ZXN0aW5nLm1vZHVsZS5uZ2ZhY3RvcnkudHMiLCJ2ZXJzaW9uIjozLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJuZzovLy9Vc2Vycy9zZGF2ZW5wby9jb2RlL2FuZ3VsYXItcmVkdXgvc3RvcmUvdGVzdGluZy9zcmMvbmctcmVkdXgtdGVzdGluZy5tb2R1bGUudHMiXSwic291cmNlc0NvbnRlbnQiOlsiICJdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OyJ9
