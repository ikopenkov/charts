import { ObjectUtils } from 'src/utils/ObjectUtils';
import { Omit } from 'src/utils/Types';

type StyleSetterOptions = {
    replaceWholeStyleObject?: boolean;
};
const setElementStyle = (
    element: HTMLElement | SVGElement,
    style: Omit<Partial<CSSStyleDeclaration>, 'length' | 'parentRule'>,
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

export const DomUtils = {
    setElementStyle,
    createSvgElement,
    getAspectRatio,
};
