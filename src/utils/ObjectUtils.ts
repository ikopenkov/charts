const map = <O extends {}, R>(
    func: (value: O[keyof O], key: keyof O, obj: O) => R,
    obj: O,
) => {
    const objs = Object.keys(obj).map(key => {
        const keyOfO: keyof O = key as keyof O;
        const value = obj[keyOfO];
        return { [key]: func(value, keyOfO, obj) };
    });

    // TODO: think, how to return right type if func returns not type of obj[key]
    return Object.assign({}, ...objs) as O;
};

const forEach = <O extends {}>(
    func: (value: O[keyof O], key: keyof O, obj: O) => void,
    obj: O,
) => {
    Object.keys(obj).forEach(key => {
        const keyOfO: keyof O = key as keyof O;
        const value = obj[keyOfO];
        func(value, keyOfO, obj);
    });
};

export const ObjectUtils = {
    map,
    forEach,
};
