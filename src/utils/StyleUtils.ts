import { ObjectUtils } from 'src/utils/ObjectUtils';

const SIZES_PX = {
    lineThin: 1,
    lineBold: 3,
    pointerCircleRadius: 5,
    scaleText: 10,
    switchText: 13,
};

const COLORS = {
    ruler: '#DFE6EB',
    horizontalScale: '#F2F4F5',
    scaleText: '#96A2AA',
    text: '#222222',
    gridText: '#96A2AA',
    background: '#fff',
    switchBorder: '#E6ECF0',
    rangerOverlay: 'rgba(242, 247, 249, 0.75)',
    rangerBorder: 'rgba(201, 220, 232, 0.5)',
};

const COLORS_NIGHT = {
    background: '#242F3D',
    ruler: '#3C4A59',
    horizontalScale: '#293543',
    text: '#fff',
    gridText: '#556777',
    switchBorder: '#354657',
    rangerOverlay: 'rgba(31, 42, 55, 0.75)',
    rangerBorder: 'rgba(65, 86, 106, 0.5)',

    scaleText: '#556777',
};

const COLORS_BY_MODE = {
    day: COLORS,
    night: COLORS_NIGHT,
};

const TIMINGS_S = {
    common: 0.5,
    fast: 0.1,
};

export type ColorMode = 'day' | 'night';

const getColors = ({ mode }: { mode: ColorMode }) => {
    return COLORS_BY_MODE[mode];
};

const getSizesInPercents = (width: number, aspectRatio: number = 1) => {
    const pxInPercent = width / (100 * aspectRatio);

    return ObjectUtils.map(sizePx => sizePx / pxInPercent, SIZES_PX);
};

export const StyleUtils = {
    SIZES_PX,
    TIMINGS_S,
    getSizesInPercents,
    getColors,
};
