// import { ChartDataMock } from 'src/ChartDataMock';
import { ChartDataUtils } from './ChartDataUtils';
import * as ChartDataTypes from './ChartData.types';

const ChartDataMock: ChartDataTypes.ChartData = {
    columns: [['x', 1, 2, 3], ['y0', 3, 4, 5], ['y1', 3, 4, 5]],
    types: { y0: 'line', y1: 'line', x: 'x' },
    names: { y0: '#0', y1: '#1' },
    colors: { y0: '#3DC23F', y1: '#F34C44' },
};

describe('ChartDataUtils.mapPointsByKeys', () => {
    it('works', () => {
        const result = ChartDataUtils.mapPointsByKeys(ChartDataMock.columns);
        expect(result).toEqual({ x: [1, 2, 3], y0: [3, 4, 5], y1: [3, 4, 5] });
    });
});

describe('ChartDataUtils.mapPointsByType', () => {
    it('works', () => {
        const result = ChartDataUtils.mapPointsByType(
            ChartDataMock.columns,
            ChartDataMock.types,
        );
        expect(result).toEqual({
            line: [3, 4, 5, 3, 4, 5],
            x: [1, 2, 3],
        });
    });
});

describe('ChartDataUtils.percentisePoints', () => {
    it('works', () => {
        const [_, ...points] = ChartDataMock.columns[0];
        const result = ChartDataUtils.percentisePoints(points, false, 0, 10);
        expect(result).toEqual([10, 20, 30]);
    });

    it('transform absolute points to percents values - easy', () => {
        const points = [0, 3, 5, 10];
        const percents = [0, 30, 50, 100];
        const result = ChartDataUtils.percentisePoints(points, false);
        expect(result).toEqual(percents);
    });

    it('transform absolute points to percents values - negative', () => {
        const points = [-10, 0, 5, 10];
        const percents = [0, 50, 75, 100];
        const result = ChartDataUtils.percentisePoints(points, false);
        expect(result).toEqual(percents);
    });

    it('transform absolute points to percents values - negative and float', () => {
        const points = [-0.5, 0, 0.25, 0.5];
        const percents = [0, 50, 75, 100];
        const result = ChartDataUtils.percentisePoints(points, false);
        expect(result).toEqual(percents);
    });
});

describe('ChartDataUtils.calcExtremums', () => {
    it('works', () => {
        const result = ChartDataUtils.calcExtremums(
            ChartDataMock.columns,
            ChartDataMock.types,
        );
        expect(result).toEqual({
            xMax: 3,
            xMin: 1,
            yMax: 5,
            yMin: 3,
        });
    });
});

describe('ChartDataUtils.percentisePointsByKey', () => {
    it('works', () => {
        const pointsByKey = ChartDataUtils.mapPointsByKeys(
            ChartDataMock.columns,
        );
        const extremums = ChartDataUtils.calcExtremums(
            ChartDataMock.columns,
            ChartDataMock.types,
        );
        const result = ChartDataUtils.percentisePointsByKey(
            pointsByKey,
            ChartDataMock.types,
            extremums,
        );
        expect(result).toEqual({
            x: [0, 50, 100],
            y0: [100, 50, 0],
            y1: [100, 50, 0],
        });
    });
});

describe('ChartDataUtils.transformDataToRender', () => {
    it('works', () => {
        const result = ChartDataUtils.transformDataToRender(ChartDataMock);
        expect(result).toEqual({
            xColumn: {
                color: undefined,
                name: undefined,
                pointsOriginal: [1, 2, 3],
                pointsPercentised: [0, 50, 100],
            },
            yColumns: [
                {
                    color: '#3DC23F',
                    name: '#0',
                    pointsOriginal: [3, 4, 5],
                    pointsPercentised: [100, 50, 0],
                },
                {
                    color: '#F34C44',
                    name: '#1',
                    pointsOriginal: [3, 4, 5],
                    pointsPercentised: [100, 50, 0],
                },
            ],
        });
    });

    it('works more', () => {
        const mock: ChartDataTypes.ChartData = {
            columns: [
                ['x', 1, 2, 3, 4],
                // ['y0', 37, 20],
                ['y1', 5, 10, 1, 15],
            ],
            types: {
                // y0: 'line',
                y1: 'line',
                x: 'x',
            },
            names: {
                // y0: '#0',
                y1: '#1',
            },
            colors: {
                // y0: '#3DC23F',
                y1: '#F34C44',
            },
        };
        const result = ChartDataUtils.transformDataToRender(mock);
        expect(result).toEqual({
            xColumn: {
                color: undefined,
                name: undefined,
                pointsOriginal: [1, 2, 3, 4],
                pointsPercentised: [
                    0,
                    33.333333333333336,
                    66.66666666666667,
                    100,
                ],
            },
            yColumns: [
                {
                    color: '#F34C44',
                    name: '#1',
                    pointsOriginal: [5, 10, 1, 15],
                    pointsPercentised: [
                        71.42857142857143,
                        35.71428571428571,
                        100,
                        0,
                    ],
                },
            ],
        });
    });
});
