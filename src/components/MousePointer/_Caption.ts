import { ComponentUtils } from 'src/utils/ComponentUtils';
import { ObjectUtils } from 'src/utils/ObjectUtils';

type RenderParams = {
    x: number;
    container: HTMLElement;
    aspectRatio: number;
    self?: HTMLElement;
};
const render = ({ container, x, aspectRatio, self }: RenderParams) => {
    let element = self;
    if (!element) {
        element = document.createElement('div');
        container.appendChild(element);
    }

    // const xProportionated = x * aspectRatio;
    const style: Partial<CSSStyleDeclaration> = {
        width: '100px',
        height: '100px',
        position: 'absolute',
        border: '1px solid black',
        borderRadius: '5px',
        top: '10%',
        left: `${x}%`,
    };

    ObjectUtils.forEach((value, key) => {
        // @ts-ignore
        element.style[key] = value;
    }, style);

    return element;
};

export const Caption = ComponentUtils.create(render);

export type CaptionInstance = ReturnType<typeof Caption.render>;
