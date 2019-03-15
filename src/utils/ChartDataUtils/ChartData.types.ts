import { StringKeyMap } from 'src/utils/Types';

export type ColumnData = [string, ...number[]];

export type ColumnType = 'line' | 'x';

export type ColumnTypes = StringKeyMap<ColumnType>;

export type ChartData = {
    columns: ColumnData[];
    types: ColumnTypes;
    names: StringKeyMap;
    colors: StringKeyMap;
};

export type Extremums = {
    xMin: number;
    xMax: number;
    yMin: number;
    yMax: number;
};
