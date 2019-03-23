import { ComponentUtils } from 'src/utils/ComponentUtils';
import { DomUtils } from 'src/utils/DomUtils';
import { ColorMode, StyleUtils } from 'src/utils/StyleUtils';

type RenderParams = {
    x: number;
    y: number;
    color: string;
    svg: SVGSVGElement;
    aspectRatio: number;
    isVisible: boolean;
    mode: ColorMode;
    self?: SVGCircleElement;
};
const render = ({
    svg,
    color,
    x,
    y,
    aspectRatio,
    isVisible,
    mode,
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

        const sizes = StyleUtils.getSizesInPercents(
            svg.clientWidth,
            aspectRatio,
        );
        const colors = StyleUtils.getColors({ mode });

        circle.setAttribute('cx', String(xProportionated));
        circle.setAttribute('cy', String(y));
        circle.setAttribute('r', String(sizes.pointerCircleRadius));
        circle.setAttribute('stroke', color);
        circle.setAttribute('stroke-width', String(sizes.lineBold));
        circle.setAttribute('fill', colors.background);
        DomUtils.setElementStyle(circle, { display: '' });
    } else {
        DomUtils.setElementStyle(circle, { display: 'none' });
    }

    return circle;
};

export const Circle = ComponentUtils.create(render);

export type CircleInstance = ReturnType<typeof Circle.render>;
