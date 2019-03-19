import { ComponentUtils } from 'src/utils/ComponentUtils';
import { DomUtils } from 'src/utils/DomUtils';

type Self = {
    text: HTMLElement;
};

export type XScaleStyle = {
    textColor: string;
    textSizeInPercent: number;
};

type RenderParams = {
    x: number;
    xOriginal: number;
    width: number;
    svg: SVGSVGElement;
    style: XScaleStyle;
    self?: Self;
};
const render = ({
    x,
    xOriginal,
    width,
    svg,
    style: { textColor, textSizeInPercent },
    self,
}: RenderParams) => {
    let instance = self;
    if (!instance) {
        const text = document.createElement('div');
        svg.parentElement.appendChild(text);

        instance = {
            text,
        };
    }

    const textPadding = String(textSizeInPercent / 4);

    const style: Partial<CSSStyleDeclaration> = {
        position: 'absolute',
        bottom: `${0 + textPadding}%`,
        fontSize: '10px',
        color: textColor,
        pointerEvents: 'none',
    };

    if (x === 0) {
        style.left = `${0 + textPadding}%`;
    } else if (x === 100) {
        style.right = `${0 + textPadding}%`;
    } else {
        style.left = `${x - width / 2}%`;
    }

    DomUtils.setElementStyle(instance.text, style, {
        replaceWholeStyleObject: true,
    });

    instance.text.innerText = String(xOriginal);

    return instance;
};

export const XScale = ComponentUtils.create(render);

export type XScaleInstance = ReturnType<typeof XScale.render>;
