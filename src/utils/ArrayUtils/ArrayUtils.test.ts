import { ArrayUtils } from 'src/utils/ArrayUtils/ArrayUtils';

describe('getIndexByPercent', () => {
    it('works', () => {
        const arr = new Array(100);
        expect(ArrayUtils.getIndexByPercent(arr, 0)).toEqual(0);
        expect(ArrayUtils.getIndexByPercent(arr, 50)).toEqual(50);
        expect(ArrayUtils.getIndexByPercent(arr, 100)).toEqual(99);
    });

    it('handle not round arr length', () => {
        const arr = new Array(7);
        expect(ArrayUtils.getIndexByPercent(arr, 1)).toEqual(0);
        expect(ArrayUtils.getIndexByPercent(arr, 25)).toEqual(2);
        expect(ArrayUtils.getIndexByPercent(arr, 50)).toEqual(3);
        expect(ArrayUtils.getIndexByPercent(arr, 92)).toEqual(6);
    });
});

describe('sliceByPercent', () => {
    it('works', () => {
        const arr = [1, 2, 3, 4, 5];
        expect(ArrayUtils.sliceByPercent(arr, 0, 100)).toEqual(arr);
        expect(ArrayUtils.sliceByPercent(arr, 20, 100)).toEqual([2, 3, 4, 5]);
        expect(ArrayUtils.sliceByPercent(arr, 40, 80)).toEqual([3, 4]);
    });
});
