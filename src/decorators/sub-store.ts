import { Reducer } from 'redux';
import { IFractalStoreOptions, setClassOptions } from './helpers';

export function SubStore({
  basePathMethodName,
  localReducer
}: IFractalStoreOptions): ClassDecorator {
  return function decorate(constructor: Function): void {
    setClassOptions(constructor, {
      basePathMethodName,
      localReducer,
    });
  }
}
