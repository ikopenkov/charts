import { ComponentUtils } from 'src/utils/ComponentUtils';
import { DomUtils } from 'src/utils/DomUtils';

type Self = {
    line: SVGLineElement;
    text: HTMLElement;
};

export type ScaleStyle = {
    textColor: string;
    lineColor: string;
    lineWidthInPercent: number;
    textSizeInPercent: number;
};

type RenderParams = {
    yOriginal: number;
    yPercentised: number;
    svg: SVGSVGElement;
    style: ScaleStyle;
    aspectRatio: number;
    self?: Self;
};
const render = ({
    svg,
    aspectRatio,
    yOriginal,
    yPercentised,
    style: { lineColor, textColor, lineWidthInPercent, textSizeInPercent },
    self,
}: RenderParams) => {
    let instance = self;
    if (!instance) {
        const line = document.createElementNS(
            'http://www.w3.org/2000/svg',
            'line',
        );

        const text = document.createElement('div');
        svg.appendChild(line);
        svg.parentElement.appendChild(text);

        instance = {
            line,
            text,
        };
    }

    if (yPercentised > 100) {
        // eslint-disable-next-line no-param-reassign
        yPercentised = 100;
    }

    instance.line.setAttribute('x1', '0');
    instance.line.setAttribute('y1', String(yPercentised));
    instance.line.setAttribute('x2', String(100 * aspectRatio));
    instance.line.setAttribute('y2', String(yPercentised));
    instance.line.setAttribute(
        'style',
        `stroke:${lineColor};stroke-width:${lineWidthInPercent}`,
    );

    const textPadding = String(textSizeInPercent / 4);

    DomUtils.setElementStyle(instance.text, {
        position: 'absolute',
        bottom: `${100 - yPercentised + +textPadding}%`,
        left: `${textPadding}%`,
        fontSize: '10px',
        color: textColor,
        pointerEvents: 'none',
    });

    instance.text.innerText = String(yOriginal);

    // instance.text.setAttribute('x', textPadding);
    // instance.text.setAttribute('y', String(yPercentised - +textPadding));
    // instance.text.setAttribute('font-size', String(textSizeInPercent));
    // instance.text.setAttribute('fill', String(textColor));
    // instance.text.textContent = String(yOriginal);

    return instance;
};

export const Scale = ComponentUtils.create(render);

export type ScaleInstance = ReturnType<typeof Scale.render>;
