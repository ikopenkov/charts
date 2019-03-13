export namespace PointUtils {
    export type Point = [number, number];

    export const findExtremums = (points: Point[]) => {
        const xMap = points.map(([x]) => x);
        const yMap = points.map(([x, y]) => y);

        const xMin = Math.min(...xMap);
        const xMax = Math.max(...xMap);
        const yMin = Math.min(...yMap);
        const yMax = Math.max(...yMap);
        return {
            xMin,
            xMax,
            yMin,
            yMax,
        };
    };
}
