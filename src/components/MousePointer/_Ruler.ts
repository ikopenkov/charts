import { ComponentUtils } from 'src/utils/ComponentUtils';
import { DomUtils } from 'src/utils/DomUtils';

type RenderParams = {
    x: number;
    color: string;
    svg: SVGSVGElement;
    aspectRatio: number;
    widthInPercent: number;
    isVisible: boolean;
    self?: SVGLineElement;
};
const render = ({
    svg,
    widthInPercent,
    color,
    x,
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

        line.setAttribute('x1', String(xProportionated));
        line.setAttribute('x2', String(xProportionated));
        line.setAttribute('y1', '0');
        line.setAttribute('y2', '100');
        line.setAttribute(
            'style',
            `stroke:${color};stroke-width:${widthInPercent}`,
        );

        DomUtils.setElementStyle(line, { display: '' });
    } else {
        DomUtils.setElementStyle(line, { display: 'none' });
    }
    return line;
};

export const Ruler = ComponentUtils.create(render);

export type RulerInstance = ReturnType<typeof Ruler.render>;
