import { ObjectUtils } from 'src/utils/ObjectUtils';
import { Omit } from 'src/utils/Types';

type StyleSetterOptions = {
    replaceWholeStyleObject?: boolean;
};
const setElementStyle = (
    element: HTMLElement,
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

export const DomUtils = {
    setElementStyle,
};
