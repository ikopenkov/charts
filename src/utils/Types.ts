export type StringKeyMap<T = string> = { [key: string]: T };

// omit keys in object type this way: Omit<Obj, 'key1' | 'key2>
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

export type RemoveFirstArgument<T> = T extends (
    arg: any,
    ...args: infer A
) => infer R
    ? (...args: A) => R
    : T;

export type ChangeTypeOfProps<O, T> = O extends { [key: string]: infer T }
    ? { [P in keyof O]: T }
    : O;

export type RemoveFirstArgumentOfObjectProps<S> = S extends {
    [key: string]: infer T;
}
    ? { [P in keyof S]: RemoveFirstArgument<T> }
    : S;

export type CutMiddleFunction<T> = T extends (
    ...arg: infer Args
) => (...args: any[]) => infer R
    ? (...arg: Args) => R
    : never;
