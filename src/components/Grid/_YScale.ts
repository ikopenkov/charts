import { ComponentUtils } from 'src/utils/ComponentUtils';
import { DomUtils } from 'src/utils/DomUtils';
import { ColorMode, StyleUtils } from 'src/utils/StyleUtils';

type Self = {
    line: SVGLineElement;
    text: HTMLElement;
};

type RenderParams = {
    yOriginal: number;
    yPercentised: number;
    svg: SVGSVGElement;
    aspectRatio: number;
    mode: ColorMode;
    isZeroScale: boolean;
    isHidden: boolean;
    self?: Self;
};

const render = ({
    svg,
    aspectRatio,
    yOriginal,
    yPercentised,
    mode,
    isZeroScale,
    isHidden,
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

    const sizes = StyleUtils.getSizesInPercents(svg.clientWidth, aspectRatio);
    const colors = StyleUtils.getColors({ mode });

    const lineColor = isZeroScale ? colors.ruler : colors.horizontalScale;

    instance.line.setAttribute('x1', '0');
    instance.line.setAttribute('y1', String(yPercentised));
    instance.line.setAttribute('x2', String(100 * aspectRatio));
    instance.line.setAttribute('y2', String(yPercentised));
    instance.line.setAttribute(
        'style',
        `stroke:${lineColor};stroke-width:${sizes.lineThin}`,
    );
    DomUtils.setElementStyle(instance.line, {
        transition: `${StyleUtils.TIMINGS_S.common}s`,
        opacity: isHidden ? '0' : '1',
    });

    const textPaddingPx = 5;
    const pxInPercent = svg.clientWidth / (100 * aspectRatio);
    const textPadding = textPaddingPx / pxInPercent;

    DomUtils.setElementStyle(instance.text, {
        position: 'absolute',
        bottom: `${100 - yPercentised + +textPadding}%`,
        left: '0',
        fontSize: `${StyleUtils.SIZES_PX.scaleText}px`,
        color: colors.gridText,
        pointerEvents: 'none',
        transition: `${StyleUtils.TIMINGS_S.common}s`,
        opacity: isHidden ? '0' : '1',
    });

    instance.text.innerText = String(yOriginal);

    return instance;
};

const remove = (self: Self) => {
    const { text, line } = self;
    text.parentElement.removeChild(text);
    line.parentElement.removeChild(line);
};

export const YScale = ComponentUtils.create(render, remove);

export type YScaleInstance = ReturnType<typeof YScale.render>;
