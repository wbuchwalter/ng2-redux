import { Reducer } from 'redux';
import { IFractalStoreOptions, setClassOptions } from './helpers';

export const SubStore = ({
  basePathMethodName,
  localReducer
}: IFractalStoreOptions) =>
  (constructor: Function): void =>
    setClassOptions(constructor, {
      basePathMethodName,
      localReducer,
    });
