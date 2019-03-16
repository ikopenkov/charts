import { ComponentUtils } from 'src/utils/ComponentUtils';

type RenderParams = {
    x: number;
    y: number;
    color: string;
    strokeWidthInPercent: number;
    radiusInPercent: number;
    fillColor: string;
    svg: SVGSVGElement;
    aspectRatio: number;
    self?: SVGCircleElement;
};
const render = ({
    svg,
    color,
    fillColor,
    radiusInPercent,
    strokeWidthInPercent,
    x,
    y,
    aspectRatio,
    self,
}: RenderParams) => {
    let circle = self;
    if (!circle) {
        circle = document.createElementNS(
            'http://www.w3.org/2000/svg',
            'circle',
        );
        svg.appendChild(circle);
    }

    const xProportionated = x * aspectRatio;

    circle.setAttribute('cx', String(xProportionated));
    circle.setAttribute('cy', String(y));
    circle.setAttribute('r', String(radiusInPercent));
    circle.setAttribute('stroke', color);
    circle.setAttribute('stroke-width', String(strokeWidthInPercent));
    circle.setAttribute('fill', fillColor);

    return circle;
};

export const Circle = ComponentUtils.create(render);

export type CircleInstance = ReturnType<typeof Circle.render>;
