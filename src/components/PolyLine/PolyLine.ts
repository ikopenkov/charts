import { ComponentUtils } from 'src/utils/ComponentUtils';
import { StyleUtils } from 'src/utils/StyleUtils';
import { DomUtils } from 'src/utils/DomUtils';

const calcPathData = (
    xPointsInPercents: number[],
    yPointsInPercents: number[],
    aspectRatio: number,
) => {
    const xPointsProportionated = xPointsInPercents.map(x => x * aspectRatio);
    const linesCoordinates = xPointsProportionated.map((x, index) => {
        const y = yPointsInPercents[index];

        return `${x} ${y}`;
    });
    return `M ${linesCoordinates.join(' L ')}`;
};

type RenderParams = {
    xPointsInPercents: number[];
    yPointsInPercents: number[];
    color: string;
    svg: SVGSVGElement;
    aspectRatio: number;
    isThin?: boolean;
    isHidden?: boolean;
    self?: SVGPathElement;
};

const render = ({
    xPointsInPercents,
    yPointsInPercents,
    color,
    svg,
    aspectRatio,
    isThin = false,
    self,
    isHidden,
}: RenderParams) => {
    const pathData = calcPathData(
        xPointsInPercents,
        yPointsInPercents,
        aspectRatio,
    );

    let path = self;
    if (!path) {
        path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        DomUtils.setElementStyle(path, {
            transition: `${StyleUtils.TIMINGS_S.common}s`,
        });
        svg.appendChild(path);
    }

    const sizesInPercent = StyleUtils.getSizesInPercents(
        svg.clientWidth,
        aspectRatio,
    );
    const strokeWidth = isThin
        ? sizesInPercent.lineThin
        : sizesInPercent.lineBold;

    path.setAttribute('stroke', color);
    path.setAttribute('stroke-width', String(strokeWidth));
    path.setAttribute('fill', 'none');
    path.setAttribute('d', pathData);

    if (isHidden) {
        DomUtils.setElementStyle(path, { opacity: '0' });
    } else {
        DomUtils.setElementStyle(path, { opacity: '1' });
    }

    return path;
};

const remove = (self: SVGPathElement) => {
    self.parentElement.removeChild(self);
};

export const PolyLine = ComponentUtils.create(render, remove);
export type PolyLineInstance = ReturnType<typeof PolyLine.render>;
