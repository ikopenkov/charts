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
