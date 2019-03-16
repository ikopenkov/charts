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
        const stylesAttrStrings: string[] = [];
        ObjectUtils.forEach((value, key) => {
            stylesAttrStrings.push(`${key}: ${value};`);
        }, style);
        element.setAttribute('style', stylesAttrStrings.join(' '));
    } else {
        ObjectUtils.forEach((value, key) => {
            // eslint-disable-next-line no-param-reassign
            element.style[key] = value;
        }, style);
    }
};

export const DomUtils = {
    setElementStyle,
};
