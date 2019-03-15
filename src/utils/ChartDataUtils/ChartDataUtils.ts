import { StringKeyMap } from 'src/utils/Types';
import { ObjectUtils } from 'src/utils/ObjectUtils';
import {
    ChartData,
    ColumnData,
    ColumnTypes,
    Extremums,
} from './ChartData.types';

const mapPointsByKeys = (columns: ColumnData[]) => {
    const objects = columns.map(([name, ...points]) => ({
        [name]: points,
    }));
    return Object.assign({}, ...objects) as StringKeyMap<number[]>;
};

const mapPointsByType = (columns: ColumnData[], types: ColumnTypes) => {
    const result: { line: number[]; x: number[] } = { line: [], x: [] };
    columns.forEach(data => {
        const [name, ...points] = data;
        const type = types[name];
        result[type] = result[type].concat(points);
    });
    return result;
};

const percentisePoints = (
    points: number[],
    min: number = Math.min(...points),
    max: number = Math.max(...points),
) => {
    const percents = 100;
    const step = percents / (max - min);

    const pointsShifted = points.map(point => point - min);

    return pointsShifted.map(point => point * step);
};

const percentisePointsByKey = (
    pointsByKey: StringKeyMap<number[]>,
    types: ColumnTypes,
    { xMax, xMin, yMax, yMin }: Extremums,
) => {
    return ObjectUtils.map((value, key) => {
        const isX = types[key] === 'x';
        const min = isX ? xMin : yMin;
        const max = isX ? xMax : yMax;
        return percentisePoints(pointsByKey[key], min, max);
    }, pointsByKey);
};

const calcExtremums = (columns: ColumnData[], types: ColumnTypes) => {
    const pointsByType = mapPointsByType(columns, types);

    const xMin = Math.min(...pointsByType.x);
    const xMax = Math.max(...pointsByType.x);
    const yMin = Math.min(...pointsByType.line);
    const yMax = Math.max(...pointsByType.line);

    return {
        xMin,
        yMax,
        xMax,
        yMin,
    } as Extremums;
};

const transformDataToRender = (chartData: ChartData) => {
    const pointsByKey = mapPointsByKeys(chartData.columns);

    const extremums = calcExtremums(chartData.columns, chartData.types);

    const pointsByKeyPercentised = percentisePointsByKey(
        pointsByKey,
        chartData.types,
        extremums,
    );

    const keys = Object.keys(chartData.types);

    const xKey = keys
        .map(key => [key, chartData.types[key]])
        .find(([key, value]) => value === 'x')[0];

    const yKeys = keys.filter(key => key !== xKey);

    const getFinalDataByKey = (key: string) => {
        return {
            pointsPercentised: pointsByKeyPercentised[key],
            pointsOriginal: pointsByKey[key],
            name: chartData.names[key],
            color: chartData.colors[key],
        };
    };

    return {
        xColumn: getFinalDataByKey(xKey),
        yColumns: yKeys.map(getFinalDataByKey),
    };
};

export const ChartDataUtils = {
    mapPointsByKeys,
    mapPointsByType,
    percentisePoints,
    percentisePointsByKey,
    calcExtremums,
    transformDataToRender,
};
