import { Reducer } from 'redux';

export interface IFractalStoreOptions {
  basePathMethodName: string
  localReducer: Reducer<any>;
}

export const SubStore = ({
  basePathMethodName,
  localReducer
}: IFractalStoreOptions) =>
  (constructor: Function): void => {
    constructor['@angular-redux::fractal-store::options'] = {
      basePathMethodName,
      localReducer,
    };
  };
