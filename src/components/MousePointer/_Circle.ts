import { ComponentUtils } from 'src/utils/ComponentUtils';
import { DomUtils } from 'src/utils/DomUtils';

type RenderParams = {
    x: number;
    y: number;
    color: string;
    strokeWidthInPercent: number;
    radiusInPercent: number;
    fillColor: string;
    svg: SVGSVGElement;
    aspectRatio: number;
    isVisible: boolean;
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
    isVisible,
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

    if (isVisible) {
        const xProportionated = x * aspectRatio;

        circle.setAttribute('cx', String(xProportionated));
        circle.setAttribute('cy', String(y));
        circle.setAttribute('r', String(radiusInPercent));
        circle.setAttribute('stroke', color);
        circle.setAttribute('stroke-width', String(strokeWidthInPercent));
        circle.setAttribute('fill', fillColor);
        DomUtils.setElementStyle(circle, { display: '' });
    } else {
        DomUtils.setElementStyle(circle, { display: 'none' });
    }

    return circle;
};

export const Circle = ComponentUtils.create(render);

export type CircleInstance = ReturnType<typeof Circle.render>;
