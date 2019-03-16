import { StringKeyMap } from 'src/utils/Types';

const map = <T, R>(
    func: (value: T, key: string, obj: StringKeyMap<T>) => R,
    obj: StringKeyMap<T>,
) => {
    const objs = Object.keys(obj).map(key => {
        const value = obj[key];
        return { [key]: func(value, key, obj) };
    });

    return Object.assign({}, ...objs) as StringKeyMap<R>;
};

const forEach = <T, R>(
    func: (value: T, key: string, obj: StringKeyMap<T>) => R,
    obj: StringKeyMap<T>,
) => {
    Object.keys(obj).forEach(key => {
        const value = obj[key];
        func(value, key, obj);
    });
};

export const ObjectUtils = {
    map,
    forEach,
};
