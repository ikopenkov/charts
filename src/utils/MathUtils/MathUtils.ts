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

const getTwoBoundingPoints = (points: number[], point: number) => {
    const { indexOfNext, indexOfPrev } = getBoundingPointsIndexes(
        points,
        point,
    );
    return { prevPoint: points[indexOfPrev], nextPoint: points[indexOfNext] };
};

const getNearestPoint = (points: number[], point: number) => {
    const { nextPoint, prevPoint } = getTwoBoundingPoints(points, point);
    const prevDif = point - prevPoint;
    const nextDif = nextPoint - point;
    if (prevDif < nextDif) {
        return prevPoint;
    }
    return nextPoint;
};

type DividerParams = {
    min?: number;
    max: number;
    parts: number;
};

// now it works somehow
// TODO: fix to work with large numbers, decimal & negative
const divideToRoundParts = ({ max, min = 0, parts }: DividerParams) => {
    const range = max - min;

    const rawDivider = Math.round(range / parts) || 1;

    const rawPartStr = String(rawDivider);

    const zeroesStr = String(10 ** (rawPartStr.length - 1)).slice(1);

    let divider = Number(rawPartStr.slice(0, 1) + zeroesStr);

    let resultDivisions = range / divider;

    while (resultDivisions > parts) {
        divider = Number(divider) + Number(1 + zeroesStr);
        resultDivisions = range / divider;
    }

    // while (resultDivisions < parts) {
    //     divider /= 2;
    //     resultDivisions = range / divider;
    // }

    // divider = Number(divider) + Number(1 + zeroesStr);
    // resultDivisions = range / divider;
    // }

    const result: number[] = [min];
    while (result[result.length - 1] !== max) {
        let nextStep = result[result.length - 1] + divider;
        if (nextStep > max) {
            nextStep = max;
        }
        result.push(nextStep);
    }

    return result;
};

const getIsNumBeauty = (num: number) => {
    let lastZeroes = '';
    let numRest = String(num);
    while (numRest && numRest[numRest.length - 1] === '0') {
        lastZeroes += '0';
        numRest = numRest.slice(0, numRest.length - 1);
    }
    return lastZeroes.length >= numRest.length;
};

const getLowerBeautyValue = (value: number, minValue: number) => {
    if (minValue <= 0) {
        return 0;
    }

    let currentValue = String(value);
    let prevValue = String(value);
    let zeroesAdded = 0;
    while (+currentValue >= minValue) {
        if (getIsNumBeauty(+currentValue)) {
            return +currentValue;
        }

        prevValue = currentValue;

        zeroesAdded++;
        currentValue =
            currentValue.slice(0, currentValue.length - zeroesAdded) +
            String(10 ** zeroesAdded).slice(1, Infinity);
    }

    return +prevValue;
};

const divideToEqualParts = ({
    number,
    minPart,
}: {
    number: number;
    minPart: number;
}) => {
    const rawDivider = number / minPart;
    const target = Math.floor(rawDivider);
    const k = (target * minPart - number) / -target;

    // found k by inserting different values here to get round divider, than solve this equation to get upper formulae
    const divider = number / (minPart + k);

    const part = number / divider;

    const stepsNumber = Math.ceil(number / minPart);

    const steps = [];
    for (let i = 0; i < stepsNumber; i++) {
        steps.push(Math.round(i * part));
    }

    return steps;
};

//
//
// Used it to calc point on Y by X, but realised pointers should be rendered
// only on provided x points, not on values between provided points
//
//
// const calcY = (x: number, xPoints: number[], yPoints: number[]) => {
//     const boundingPoints = MathUtils.getBoundingPoints({ x, xPoints, yPoints });
//     const yCalculator = MathUtils.getYOfLineCalculator(boundingPoints);
//
//     return yCalculator(x);
// };
// const yValuesPercentised = chartData.yColumns.map(yColumn =>
//     calcY(
//         x,
//         chartData.xColumn.pointsPercentised,
//         yColumn.pointsPercentised,
//     ),
// );
// const yValuesOriginal = chartData.yColumns.map(yColumn =>
//     Math.round(
//         calcY(
//             xOriginal,
//             chartData.xColumn.pointsOriginal,
//             yColumn.pointsOriginal,
//         ),
//     ),
// );

export const MathUtils = {
    getYOfLineCalculator,
    getBoundingPointsIndexes,
    getBoundingPoints,
    getNearestPoint,
    divideToRoundParts,
    divideToEqualParts,
    getIsNumBeauty,
    getLowerBeautyValue,
};
