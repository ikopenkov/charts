import { ChartRenderData } from 'src/utils/ChartDataUtils/ChartData.types';
import { MathUtils } from 'src/utils/MathUtils/MathUtils';
import {
    YScale,
    YScaleInstance,
    YScaleStyle,
} from 'src/components/Grid/_YScale';
import { ComponentUtils } from 'src/utils/ComponentUtils';
import { ChartDataUtils } from 'src/utils/ChartDataUtils/ChartDataUtils';
import { XScaleStyle } from 'src/components/Grid/_XScale';
import { DomUtils } from 'src/utils/DomUtils';

const xContainerPaddingLeftPx = 5;

const renderXScales = (
    { chartData, svg, style }: RenderParams,
    container: HTMLElement,
    selfs: HTMLElement[] = [],
) => {
    const { xColumn } = chartData;

    const widthPx = 70;
    const containerWidth = container.clientWidth - xContainerPaddingLeftPx * 2;
    const pixelsInPercent = containerWidth / 100;
    const widthPercent = widthPx / pixelsInPercent;

    const pointsNumber = xColumn.pointsOriginal.length - 1;

    const minPointsPerStep = (pointsNumber * widthPercent) / 100;
    const steps = MathUtils.divideToEqualParts({
        number: pointsNumber,
        minPart: minPointsPerStep,
    });

    const pointsInPercent = minPointsPerStep / widthPercent;

    const extraElements = selfs.slice(steps.length, Infinity);
    extraElements.forEach(el => el.parentElement.removeChild(el));

    return steps.map((xIndex, index) => {
        let self = selfs[index];
        if (!self) {
            self = document.createElement('div');
        }

        let xPercent = xIndex / pointsInPercent;
        if (xPercent > 100) {
            xPercent = 100;
        }

        const xOriginal = xColumn.pointsOriginal[xIndex];

        self.innerText = new Date(xOriginal)
            .toString()
            .split(' ')
            .slice(1, 3)
            .join(' ');

        DomUtils.setElementStyle(self, {
            fontSize: '10px',
            color: style.textColor,
        });

        container.appendChild(self);

        return self;
    });
};

const renderYScales = (
    { style, svg, chartData, aspectRatio }: RenderParams,
    selfs: YScaleInstance[] = [],
) => {
    const yMarkers = MathUtils.divideToRoundParts({
        max: chartData.extremums.yMax,
        parts: 5,
    });

    const yMarkersPercentised = ChartDataUtils.percentisePoints({
        isY: true,
        points: yMarkers,
        min: chartData.extremums.yMin,
        max: chartData.extremums.yMax,
    });

    const extraSelfs = selfs.slice(yMarkers.length, Infinity);
    extraSelfs.forEach(self => self.remove());

    return yMarkers.slice(0, yMarkers.length - 1).map((yOriginal, index) => {
        let self = selfs[index];
        const params = {
            svg,
            aspectRatio,
            yOriginal,
            yPercentised: yMarkersPercentised[index],
            style,
        };
        if (!self) {
            self = YScale.render(params);
        } else {
            self.reRender(params);
        }
        return self;
    });
};

type Instance = {
    xScalesContainer: HTMLElement;
    yScales: YScaleInstance[];
    xScales: HTMLElement[];
};

type RenderParams = {
    chartData: ChartRenderData;
    svg: SVGSVGElement;
    container: HTMLElement;
    style: YScaleStyle & XScaleStyle;
    aspectRatio: number;
    self?: Instance;
};
const render = (params: RenderParams) => {
    let instance = params.self;
    if (!instance) {
        const xScalesContainer = document.createElement('div');
        DomUtils.setElementStyle(xScalesContainer, {
            width: '100%',
            padding: `${xContainerPaddingLeftPx}px`,
            display: 'flex',
            boxSizing: 'border-box',
            justifyContent: 'space-between',
        });

        params.container.appendChild(xScalesContainer);

        instance = {
            xScalesContainer,
            // @ts-ignore
            xScales: renderXScales(params, xScalesContainer),
            yScales: renderYScales(params),
        };
    } else {
        instance.yScales = renderYScales(params, instance.yScales);
        instance.xScales = renderXScales(
            params,
            instance.xScalesContainer,
            instance.xScales,
        );
    }

    return instance;
};

export const Grid = ComponentUtils.create(render);

export type GridInstance = ReturnType<typeof Grid.render>;
