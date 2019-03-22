const getIndexByPercent = (arr: any[], percent: number) => {
    if (percent > 100 || percent < 0) {
        throw new Error(`Provided not valid percent value: ${percent}`);
    }

    const length = arr.length - 1;
    return Math.round((length * percent) / 100);
};

const sliceByPercent = <T>(arr: T[], min: number, max: number) => {
    const indexMin = getIndexByPercent(arr, min);
    const indexMax = getIndexByPercent(arr, max) + 1; // Array.prototype.slice strange feature

    return arr.slice(indexMin, indexMax);
};

export const ArrayUtils = {
    getIndexByPercent,
    sliceByPercent,
};
