import { Reducer } from 'redux';
import { PathSelector } from './selectors';
/** @hidden */
export declare function enableFractalReducers(rootReducer: Reducer<any>): Reducer<any>;
/** @hidden */
export declare function registerFractalReducer(basePath: PathSelector, localReducer: Reducer<any>): void;
/** @hidden */
export declare function replaceLocalReducer(basePath: PathSelector, nextLocalReducer: Reducer<any>): void;
