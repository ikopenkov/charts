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

describe('divideToRoundParts', () => {
    it('works', () => {
        const result = MathUtils.divideToRoundParts({
            max: 260,
            parts: 6,
        });

        expect(result).toEqual([0, 50, 100, 150, 200, 250, 260]);
    });

    it('works with large numbers', () => {
        const result = MathUtils.divideToRoundParts({
            max: 432893,
            parts: 5,
        });

        expect(result).toEqual([0, 90000, 180000, 270000, 360000, 432893]);
    });

    // it('works with small numbers', () => {
    //     expect(
    //         MathUtils.divideToRoundParts({
    //             max: 1,
    //             parts: 4,
    //         }),
    //     ).toEqual([0, 0.25, 0.5, 0.75, 1]);
    //
    //     expect(
    //         MathUtils.divideToRoundParts({
    //             max: 1.1,
    //             parts: 4,
    //         }),
    //     ).toEqual([0, 0.25, 0.5, 0.75, 1, 1.1]);
    // });
});

describe('divideToEqualParts', () => {
    const calcPartsDeviance = ({
        steps,
        number,
        minPart,
    }: {
        steps: number[];
        number: number;
        minPart: number;
    }) => {
        const isFirstStepCorrect = steps[0] === 0;
        const isLastStepCorrect = steps[steps.length - 1] === number;

        const stepsShifted = [0, ...steps];

        const isAlwaysIncreasing = steps.every((step, index) => {
            const nextStep = stepsShifted[index + 2];

            if (index === 0 || index === steps.length - 1) {
                return true;
            }

            return nextStep > step;
        });

        const difs = stepsShifted
            .map((prev, index) => {
                const current = steps[index];
                return current - prev;
            })
            .slice(1, steps.length);

        const minDif = Math.min(...difs);
        const maxDif = Math.max(...difs);
        const difDeviance = maxDif - minDif;

        const medianDif =
            difs.reduce((result, value) => {
                return result + value;
            }, 0) / difs.length;

        return {
            minDif,
            maxDif,
            difDeviance,
            medianDif,
            isFirstStepCorrect,
            isLastStepCorrect,
            isAlwaysIncreasing,
        };
    };

    const checkIsCorrect = ({
        number,
        minPart,
    }: {
        number: number;
        minPart: number;
    }) => {
        const steps = MathUtils.divideToEqualParts({
            number,
            minPart,
        });

        const {
            difDeviance,
            isLastStepCorrect,
            isFirstStepCorrect,
            isAlwaysIncreasing,
        } = calcPartsDeviance({
            steps,
            minPart,
            number,
        });

        expect(difDeviance).toBeGreaterThanOrEqual(0);
        expect(difDeviance).toBeLessThanOrEqual(1);
        expect(isLastStepCorrect).toBeTruthy();
        expect(isFirstStepCorrect).toBeTruthy();
        expect(isAlwaysIncreasing).toBeTruthy();
    };

    it('works', () => {
        [
            {
                number: 300,
                minPart: 16,
            },
            {
                number: 452345234,
                minPart: 234242,
            },
            {
                number: 5234532,
                minPart: 43343,
            },
            {
                number: 12341216,
                minPart: 123412,
            },
            {
                number: 12423,
                minPart: 5453,
            },
        ].forEach(checkIsCorrect);
    });
});
