import * as Redux from 'redux';
export default class Connector<RootState> {
    private _store;
    private _defaultMapStateToTarget;
    private _defaultMapDispatchToTarget;
    constructor(store: Redux.Store<RootState>);
    connect: (mapStateToTarget: any, mapDispatchToTarget: any) => (target: any) => Redux.Unsubscribe;
    updateTarget(target: any, StateSlice: any, dispatch: any): void;
    getStateSlice(state: any, mapStateToScope: any): any;
}
