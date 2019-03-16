import { ComponentUtils } from 'src/utils/ComponentUtils';

type RenderParams = {
    x: number;
    color: string;
    svg: SVGSVGElement;
    aspectRatio: number;
    widthInPercent: number;
    self?: SVGLineElement;
};
const render = ({
    svg,
    widthInPercent,
    color,
    x,
    aspectRatio,
    self,
}: RenderParams) => {
    let line = self;
    if (!line) {
        line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        svg.appendChild(line);
    }
    const xProportionated = x * aspectRatio;

    line.setAttribute('x1', String(xProportionated));
    line.setAttribute('x2', String(xProportionated));
    line.setAttribute('y1', '0');
    line.setAttribute('y2', '100');
    line.setAttribute(
        'style',
        `stroke:${color};stroke-width:${widthInPercent}`,
    );

    return line;
};

export const Ruler = ComponentUtils.create(render);

export type RulerInstance = ReturnType<typeof Ruler.render>;
