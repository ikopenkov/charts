import { MathUtils } from 'src/utils/MathUtils/MathUtils';

describe('getYOfLineCalculator', () => {
    it('works', () => {
        const x1 = 1;
        const y1 = 3;

        const x2 = 4;
        const y2 = 1;

        const calc = MathUtils.getYOfLineCalculator({ x1, y1, x2, y2 });

        expect(calc(x1)).toEqual(y1);
        expect(calc(x2)).toEqual(y2);
        expect(calc(2)).toBeCloseTo(2.33);
    });

    it('calc when line is parallel to x axis', () => {
        const x1 = 1;
        const y1 = 3;

        const x2 = 1;
        const y2 = 1;

        const calc = MathUtils.getYOfLineCalculator({ x1, y1, x2, y2 });

        expect(calc(x1)).toEqual(y1);
        expect(calc(x2)).toEqual(y1);
    });

    it('calc when line is parallel to y axis', () => {
        const x1 = 1;
        const y1 = 1;

        const x2 = 4;
        const y2 = 1;

        const calc = MathUtils.getYOfLineCalculator({ x1, y1, x2, y2 });

        expect(calc(x1)).toEqual(y1);
        expect(calc(x2)).toEqual(y1);
    });

    it('calc when line is parallel to y axis 2', () => {
        const x1 = 0;
        const y1 = 100;
        const x2 = 0;
        const y2 = 53.125;

        const calc = MathUtils.getYOfLineCalculator({ x1, y1, x2, y2 });

        expect(calc(x1)).toEqual(y1);
        expect(calc(x2)).toEqual(y1);
    });

    it('calc when y1 is larger than y2', () => {
        const x1 = 0;
        const x2 = 100;
        const y1 = 0;
        const y2 = 53.125;

        // const x = 64.08250355618776;

        const calc = MathUtils.getYOfLineCalculator({ x1, y1, x2, y2 });

        expect(calc(x1)).toEqual(y1);
        expect(calc(x2)).toEqual(y2);
    });
});

describe('getBoundingPoints', () => {
    it('works', () => {
        const x = 66;
        const xPoints = [0, 50, 100];
        const yPoints = [0, 47, 33];

        const result = MathUtils.getBoundingPoints({
            x,
            yPoints,
            xPoints,
        });

        expect(result).toEqual({
            x1: 50,
            x2: 100,
            y1: 47,
            y2: 33,
        });
    });
});

describe('getNearestPoint', () => {
    it('works', () => {
        const result = MathUtils.getNearestPoint([1, 3, 4, 7, 9], 5);

        expect(result).toEqual(4);
    });
    it('works with negative', () => {
        const result = MathUtils.getNearestPoint([-4, -1, 3, 4, 7, 9], -2);

        expect(result).toEqual(-1);
    });
    it('works with decimal', () => {
        const result = MathUtils.getNearestPoint(
            [-4, -1.5, -1, 3, 4, 7, 9],
            -1.3,
        );

        expect(result).toEqual(-1.5);
    });
    it('works with equal', () => {
        const result = MathUtils.getNearestPoint(
            [-4, -1.5, -1, 3, 3, 4, 7, 9],
            3,
        );

        expect(result).toEqual(3);
    });
    it('works with extremal', () => {
        const points = [-4, -1.5, -1, 3, 3, 4, 7, 9];
        expect(MathUtils.getNearestPoint(points, -100)).toEqual(-4);
        expect(MathUtils.getNearestPoint(points, 100)).toEqual(9);
    });
});
