import {Injector} from 'angular2/core';
import {BehaviorSubject} from 'rxjs';

export const appInjector$: BehaviorSubject<any> = new BehaviorSubject(null);
