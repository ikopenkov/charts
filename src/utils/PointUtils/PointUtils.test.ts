import { PointUtils } from './PointUtils';

describe('PointUtils', () => {
    it('finds extremums', () => {
        const points: PointUtils.Point[] = [
            [0, 0],
            [3, 7],
            [6, -5],
            [7, 9],
            [10, 5],
        ];
        const { xMax, xMin, yMax, yMin } = PointUtils.findExtremums(points);
        expect(xMin).toEqual(0);
        expect(yMin).toEqual(-5);
        expect(xMax).toEqual(10);
        expect(yMax).toEqual(9);
    });

    it('transform absolute points to percents values - easy', () => {
        const points = [0, 3, 5, 10];
        const percents = [0, 30, 50, 100];
        const result = PointUtils.transformAbsPointsToPercents(points);
        expect(result).toEqual(percents);
    });

    it('transform absolute points to percents values - negative', () => {
        const points = [-10, 0, 5, 10];
        const percents = [0, 50, 75, 100];
        const result = PointUtils.transformAbsPointsToPercents(points);
        expect(result).toEqual(percents);
    });

    it('transform absolute points to percents values - negative and float', () => {
        const points = [-0.5, 0, 0.25, 0.5];
        const percents = [0, 50, 75, 100];
        const result = PointUtils.transformAbsPointsToPercents(points);
        expect(result).toEqual(percents);
    });
});
