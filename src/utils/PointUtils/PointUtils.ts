const PERCENTS = 100;

export namespace PointUtils {
    export type Point = [number, number];

    export const getPointsOfAxis = (points: Point[], axis: 'x' | 'y') => {
        return points.map(([x, y]) => ({ x, y }[axis]));
    };

    export const getPointsByAxis = (points: Point[]) => {
        const xPoints = getPointsOfAxis(points, 'x');
        const yPoints = getPointsOfAxis(points, 'y');
        return {
            xPoints,
            yPoints,
        };
    };

    export const findExtremums = (points: Point[]) => {
        const { xPoints, yPoints } = getPointsByAxis(points);

        const xMin = Math.min(...xPoints);
        const xMax = Math.max(...xPoints);
        const yMin = Math.min(...yPoints);
        const yMax = Math.max(...yPoints);
        return {
            xMin,
            xMax,
            yMin,
            yMax,
        };
    };

    export const transformAbsPointsToPercents = (points: number[]) => {
        const min = Math.min(...points);
        const max = Math.max(...points);

        const step = PERCENTS / (max - min);

        const pointsShifted = points.map(point => point - min);

        return pointsShifted.map(point => point * step);
    };

    export const pointsToPercents = (points: Point[], axis: 'x' | 'y') => {
        // const points = getPointsOfAxis(points, axis);
        // const { xPoints, yPoints } = getPointsByAxis(points);
        // const { xMax, xMin, yMax, yMin } = findExtremums(points);
    };
}
