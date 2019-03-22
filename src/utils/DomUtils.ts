import { ObjectUtils } from 'src/utils/ObjectUtils';
import { Omit } from 'src/utils/Types';

type StyleSetterOptions = {
    replaceWholeStyleObject?: boolean;
};
type PartialCSSStyleDeclaration = Omit<
    Partial<CSSStyleDeclaration>,
    'length' | 'parentRule'
>;
const setElementStyle = (
    element: HTMLElement | SVGElement,
    style: PartialCSSStyleDeclaration,
    options: StyleSetterOptions = {},
) => {
    if (options.replaceWholeStyleObject) {
        element.setAttribute('style', '');
    }

    ObjectUtils.forEach((value, key) => {
        // eslint-disable-next-line no-param-reassign
        element.style[key] = value;
    }, style);
};

const createSvgElement = <T extends SVGElement>(name: string) => {
    return document.createElementNS('http://www.w3.org/2000/svg', name) as T;
};

const getAspectRatio = (containerEl: Element) => {
    const containerWidth = containerEl.clientWidth;
    const containerHeight = containerEl.clientHeight;

    return containerWidth / containerHeight;
};

const setGlobalStyle = (style: PartialCSSStyleDeclaration) => {
    setElementStyle(document.body, style);
};

const setCursorGlobally = (type: string) => {
    setGlobalStyle({
        cursor: type,
    });
};
const setUserSelectDisabled = (isDisabled: boolean) => {
    const value = isDisabled ? 'none' : '';

    setGlobalStyle({
        userSelect: value,
        msUserSelect: value,
        webkitUserSelect: value,
        msTouchSelect: value,
    });
};

export const DomUtils = {
    setElementStyle,
    setGlobalStyle,
    createSvgElement,
    getAspectRatio,
    setCursorGlobally,
    setUserSelectDisabled,
};
