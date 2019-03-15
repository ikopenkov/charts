import { ObjectUtils } from 'src/utils/ObjectUtils';
import { Omit } from 'src/utils/Types';

const calcAspectRatio = (containerEl: Element) => {
    const containerWidth = containerEl.clientWidth;
    const containerHeight = containerEl.clientHeight;

    return containerWidth / containerHeight;
};

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
    self?: SVGPathElement;
};

const render = ({
    xPointsInPercents,
    yPointsInPercents,
    color,
    svg,
    self,
}: RenderParams) => {
    const aspectRatio = calcAspectRatio(svg);
    const pathData = calcPathData(
        xPointsInPercents,
        yPointsInPercents,
        aspectRatio,
    );

    svg.setAttribute('viewBox', `0 0 ${100 * aspectRatio} 100`);
    let path = self;
    if (!path) {
        path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        svg.appendChild(path);
    }

    path.setAttribute('stroke', color);
    path.setAttribute('stroke-width', '0.5');
    path.setAttribute('fill', 'none');
    path.setAttribute('d', pathData);

    return path;
};

type PolyLineRenderParams = Omit<RenderParams, 'self'>;

export const PolyLine = {
    render: (renderParams: PolyLineRenderParams) => {
        const self = render(renderParams);

        const reRender = (partialParams: Partial<RenderParams> = {}) => {
            const fullParams: RenderParams = ObjectUtils.map((value, key) => {
                // @ts-ignore
                return partialParams[key] || value;
                // TODO: fix ObjectUtils.map to work with non indexed objects
            }, renderParams) as any;
            fullParams.self = self;

            render(fullParams);
        };

        return {
            reRender,
        };
    },
};
