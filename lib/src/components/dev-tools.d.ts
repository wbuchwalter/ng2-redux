import { ApplicationRef } from '@angular/core';
import { NgRedux } from './ng-redux';
/**
 * An angular-2-ified version of the Redux DevTools chrome extension.
 */
export declare class DevToolsExtension {
    private appRef;
    private ngRedux;
    /** @hidden */
    constructor(appRef: ApplicationRef, ngRedux: NgRedux<any>);
    /**
     * A wrapper for the Chrome Extension Redux DevTools.
     * Makes sure state changes triggered by the extension
     * trigger Angular2's change detector.
     *
     * @argument options: dev tool options; same
     * format as described here:
     * [zalmoxisus/redux-devtools-extension/blob/master/docs/API/Arguments.md]
     */
    enhancer: (options?: Object) => any;
    /**
     * Returns true if the extension is installed and enabled.
     */
    isEnabled: () => any;
}
