import { StringKeyMap } from 'src/utils/Types';
import { ObjectUtils } from 'src/utils/ObjectUtils';
import { ArrayUtils } from 'src/utils/ArrayUtils/ArrayUtils';
import {
    ChartData,
    ChartRenderData,
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

const percentisePoints = ({
    points,
    isY,
    min = Math.min(...points),
    max = Math.max(...points),
}: {
    points: number[];
    isY?: boolean;
    min?: number;
    max?: number;
}) => {
    const percents = 100;
    const step = percents / (max - min);

    const pointsShifted = points.map(point => point - min);

    const percentized = pointsShifted.map(point => point * step);
    if (isY) {
        return percentized.map(p => 100 - p);
    }
    return percentized;
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
        return percentisePoints({
            points: pointsByKey[key],
            isY: !isX,
            min,
            max,
        });
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

const cutColumn = ([name, ...points]: ColumnData, min: number, max: number) => {
    const slicedPoints = ArrayUtils.sliceByPercent(points, min, max);
    return [name, ...slicedPoints] as ColumnData;
};

const transformDataToRender = (
    chartData: ChartData,
    options: { xMinPercent?: number; xMaxPercent?: number } = {},
) => {
    let chartDataCutted = chartData;
    if (options.xMinPercent != null || options.xMaxPercent != null) {
        chartDataCutted = {
            ...chartData,
            columns: chartData.columns.map(col =>
                cutColumn(col, options.xMinPercent, options.xMaxPercent),
            ),
        };
    }

    const pointsByKey = mapPointsByKeys(chartDataCutted.columns);

    const extremums = calcExtremums(
        chartDataCutted.columns,
        chartDataCutted.types,
    );

    const pointsByKeyPercentised = percentisePointsByKey(
        pointsByKey,
        chartDataCutted.types,
        extremums,
    );

    const keys = Object.keys(chartDataCutted.types);

    const xKey = keys
        .map(key => [key, chartDataCutted.types[key]])
        .find(([key, value]) => value === 'x')[0];

    const yKeys = keys.filter(key => key !== xKey);

    const getFinalDataByKey = (key: string) => {
        return {
            pointsPercentised: pointsByKeyPercentised[key],
            pointsOriginal: pointsByKey[key],
            name: chartDataCutted.names[key],
            color: chartDataCutted.colors[key],
        };
    };

    return {
        xColumn: getFinalDataByKey(xKey),
        yColumns: yKeys.map(getFinalDataByKey),
        extremums,
    } as ChartRenderData;
};

const unpercentise = (params: {
    percent: number;
    min: number;
    max: number;
    isY: boolean;
}) => {
    const percent = params.isY ? 100 - params.percent : params.percent;
    const range = params.max - params.min;
    const valueInRange = (percent / 100) * range;
    return valueInRange + params.min;
};

export const ChartDataUtils = {
    mapPointsByKeys,
    mapPointsByType,
    percentisePoints,
    percentisePointsByKey,
    calcExtremums,
    transformDataToRender,
    unpercentise,
};
