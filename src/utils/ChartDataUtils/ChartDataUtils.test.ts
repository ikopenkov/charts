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
        const result = ChartDataUtils.percentisePoints({
            points,
            isY: false,
            min: 0,
            max: 10,
        });
        expect(result).toEqual([10, 20, 30]);
    });

    it('transform absolute points to percents values - easy', () => {
        const points = [0, 3, 5, 10];
        const percents = [0, 30, 50, 100];
        const result = ChartDataUtils.percentisePoints({ points });
        expect(result).toEqual(percents);
    });

    it('transform absolute points to percents values - negative', () => {
        const points = [-10, 0, 5, 10];
        const percents = [0, 50, 75, 100];
        const result = ChartDataUtils.percentisePoints({ points });
        expect(result).toEqual(percents);
    });

    it('transform absolute points to percents values - negative and float', () => {
        const points = [-0.5, 0, 0.25, 0.5];
        const percents = [0, 50, 75, 100];
        const result = ChartDataUtils.percentisePoints({ points });
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
            extremums: {
                xMax: 3,
                xMin: 1,
                yMax: 5,
                yMin: 3,
            },
        });
    });

    it('works more', () => {
        const mock: ChartDataTypes.ChartData = {
            columns: [['x', 1, 2, 3, 4], ['y1', 5, 10, 1, 15]],
            types: {
                y1: 'line',
                x: 'x',
            },
            names: {
                y1: '#1',
            },
            colors: {
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
            extremums: {
                xMax: 4,
                xMin: 1,
                yMax: 15,
                yMin: 1,
            },
        });
    });

    it('cut values with xMinPercent xMaxPercent', () => {
        const mock: ChartDataTypes.ChartData = {
            columns: [['x', 1, 2, 3, 4], ['y1', 5, 10, 1, 15]],
            types: {
                y1: 'line',
                x: 'x',
            },
            names: {
                y1: '#1',
            },
            colors: {
                y1: '#F34C44',
            },
        };
        const result = ChartDataUtils.transformDataToRender(mock, {
            xMinPercent: 25,
            xMaxPercent: 75,
        });
        expect(result).toEqual({
            xColumn: {
                color: undefined,
                name: undefined,
                pointsOriginal: [2, 3],
                pointsPercentised: [0, 100],
            },
            yColumns: [
                {
                    color: '#F34C44',
                    name: '#1',
                    pointsOriginal: [10, 1],
                    pointsPercentised: [0, 100],
                },
            ],
            extremums: {
                xMax: 3,
                xMin: 2,
                yMax: 10,
                yMin: 1,
            },
        });
    });

    it('cuts not including yIndexes', () => {
        const mock: ChartDataTypes.ChartData = {
            columns: [
                ['x', 1, 2, 3, 4],
                ['y1', 5, 10, 1, 15],
                ['y2', -2, 19, 2, 3],
            ],
            types: {
                y1: 'line',
                y2: 'line',
                x: 'x',
            },
            names: {
                y1: '#1',
                y2: '#2',
            },
            colors: {
                y1: '#F34C44',
                y2: '#F34C44',
            },
        };
        const includingYIndexes = [0];
        const result = ChartDataUtils.transformDataToRender(mock, {
            includingYIndexes,
        });
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
            extremums: {
                xMax: 4,
                xMin: 1,
                yMax: 15,
                yMin: 1,
            },
        });
    });
});

describe('ChartDataUtils.unpercentise', () => {
    it('works', () => {
        const result = ChartDataUtils.unpercentise({
            percent: 50,
            min: 0,
            max: 10,
            isY: false,
        });
        expect(result).toEqual(5);
    });

    it('works with negative', () => {
        const result = ChartDataUtils.unpercentise({
            percent: 10,
            min: -10,
            max: 10,
            isY: false,
        });
        expect(result).toEqual(-8);
    });

    it('works with decimal', () => {
        const result = ChartDataUtils.unpercentise({
            percent: 50,
            min: -0.5,
            max: 0.5,
            isY: false,
        });
        expect(result).toEqual(0);
    });

    it('works with y values', () => {
        const result = ChartDataUtils.unpercentise({
            percent: 30,
            min: -50,
            max: 50,
            isY: true,
        });
        expect(result).toEqual(20);
    });
});
