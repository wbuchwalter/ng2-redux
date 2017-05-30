import { NgRedux } from '../components/ng-redux';

export const getBaseStore = (decoratedInstance: Object) => {
  if (!decoratedInstance['@angular-redux::decorator::store']) {
    const options = decoratedInstance
      .constructor['@angular-redux::fractal-store::options'];

    if (!options) {
      decoratedInstance['@angular-redux::decorator::store'] = NgRedux.instance;
    } else {
      const basePath = decoratedInstance[options.basePathMethodName]();
      decoratedInstance['@angular-redux::decorator::store'] = basePath && NgRedux.instance ?
        NgRedux.instance.configureSubStore(
          basePath,
          options.localReducer) :
        null;
    }
  }

  return decoratedInstance['@angular-redux::decorator::store'];
};
