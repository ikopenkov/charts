import { PointUtils } from './PointUtils';

const points: PointUtils.Point[] = [[0, 0], [3, 7], [6, 10], [7, 9], [10, 5]];

describe('PointUtils', () => {
    it('works', () => {
        const { xMax, xMin, yMax, yMin } = PointUtils.findExtremums(points);
        expect(xMin).toEqual(0);
        expect(yMin).toEqual(0);
        expect(xMax).toEqual(10);
        expect(yMax).toEqual(10);
    });
});
