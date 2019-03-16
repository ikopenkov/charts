type LineYCalculatorParams = {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
};
const getYOfLineCalculator = ({ x1, y1, x2, y2 }: LineYCalculatorParams) => {
    if (x1 === x2) {
        return (x: number) => y1;
    }
    if (y1 === y2) {
        return (x: number) => y1;
    }
    const k = (y2 - y1) / (x2 - x1);
    const b = y1 - k * x1;
    return (x: number) => {
        return k * x + b;
    };
};

const getBoundingPointsIndexes = (points: number[], point: number) => {
    const prevPoints = points.filter(p => p <= point);
    let indexOfPrev = prevPoints.length - 1;
    if (indexOfPrev === -1) {
        indexOfPrev = 0;
    }
    let indexOfNext = points.findIndex(p => p >= point);
    if (indexOfNext === -1) {
        indexOfNext = points.length - 1;
    }

    return { indexOfPrev, indexOfNext };
};

type BoundingPointsGetterParams = {
    x: number;
    xPoints: number[];
    yPoints: number[];
};
const getBoundingPoints = ({
    x,
    xPoints,
    yPoints,
}: BoundingPointsGetterParams) => {
    const { indexOfNext, indexOfPrev } = getBoundingPointsIndexes(xPoints, x);

    const y1 = yPoints[indexOfPrev];
    const y2 = yPoints[indexOfNext];

    const x1 = xPoints[indexOfPrev];
    const x2 = xPoints[indexOfNext];

    return {
        x1,
        x2,
        y1,
        y2,
    };
};

export const MathUtils = {
    getYOfLineCalculator,
    getBoundingPointsIndexes,
    getBoundingPoints,
};
