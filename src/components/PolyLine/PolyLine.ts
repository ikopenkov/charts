import { ComponentUtils } from 'src/utils/ComponentUtils';

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
    widthInPercent: number;
    self?: SVGPathElement;
};

const render = ({
    xPointsInPercents,
    yPointsInPercents,
    widthInPercent,
    color,
    svg,
    self,
    aspectRatio,
}: RenderParams) => {
    const pathData = calcPathData(
        xPointsInPercents,
        yPointsInPercents,
        aspectRatio,
    );

    let path = self;
    if (!path) {
        path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        svg.appendChild(path);
    }

    path.setAttribute('stroke', color);
    path.setAttribute('stroke-width', String(widthInPercent));
    path.setAttribute('fill', 'none');
    path.setAttribute('d', pathData);

    return path;
};

export const PolyLine = ComponentUtils.create(render);
export type PolyLineInstance = ReturnType<typeof PolyLine.render>;
