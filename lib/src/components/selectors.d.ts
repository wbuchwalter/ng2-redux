export declare type PropertySelector = string | number | symbol;
export declare type PathSelector = (string | number)[];
export declare type FunctionSelector<RootState, S> = ((s: RootState) => S);
export declare type Selector<RootState, S> = PropertySelector | PathSelector | FunctionSelector<RootState, S>;
/** @hidden */
export declare const sniffSelectorType: <RootState, S>(selector?: Selector<RootState, S>) => "path" | "function" | "nil" | "property";
/** @hidden */
export declare const resolver: <RootState, S>(selector: Selector<RootState, S>) => {
    property: (state: any) => any;
    path: (state: any) => any;
    function: (s: RootState) => S;
    nil: (state: any) => any;
};
/** @hidden */
export declare const resolveToFunctionSelector: <RootState, S>(selector: Selector<RootState, S>) => ((state: any) => any) | ((s: RootState) => S);
