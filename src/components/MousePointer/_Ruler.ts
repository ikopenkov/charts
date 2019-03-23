import { ComponentUtils } from 'src/utils/ComponentUtils';
import { DomUtils } from 'src/utils/DomUtils';
import { ColorMode, StyleUtils } from 'src/utils/StyleUtils';

type RenderParams = {
    x: number;
    svg: SVGSVGElement;
    aspectRatio: number;
    isVisible: boolean;
    mode: ColorMode;
    self?: SVGLineElement;
};
const render = ({
    svg,
    x,
    mode,
    aspectRatio,
    isVisible,
    self,
}: RenderParams) => {
    let line = self;
    if (!line) {
        line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        svg.appendChild(line);
    }
    if (isVisible) {
        const xProportionated = x * aspectRatio;

        const sizes = StyleUtils.getSizesInPercents(svg.clientWidth);
        const colors = StyleUtils.getColors({ mode });

        line.setAttribute('x1', String(xProportionated));
        line.setAttribute('x2', String(xProportionated));
        line.setAttribute('y1', '0');
        line.setAttribute('y2', '100');
        line.setAttribute(
            'style',
            `stroke:${colors.ruler};stroke-width:${sizes.lineThin}`,
        );

        DomUtils.setElementStyle(line, { display: '' });
    } else {
        DomUtils.setElementStyle(line, { display: 'none' });
    }
    return line;
};

export const Ruler = ComponentUtils.create(render);

export type RulerInstance = ReturnType<typeof Ruler.render>;
