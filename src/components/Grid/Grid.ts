import { ChartRenderData } from 'src/utils/ChartDataUtils/ChartData.types';
import { MathUtils } from 'src/utils/MathUtils/MathUtils';
import { YScale, YScaleInstance } from 'src/components/Grid/_YScale';
import { ComponentUtils } from 'src/utils/ComponentUtils';
import { ChartDataUtils } from 'src/utils/ChartDataUtils/ChartDataUtils';
import { DomUtils } from 'src/utils/DomUtils';
import { ColorMode, StyleUtils } from 'src/utils/StyleUtils';

const xContainerPaddingLeftPx = 5;

const renderXScales = (
    { chartData, mode, svg }: RenderParams,
    container: HTMLElement,
    selfs: HTMLElement[] = [],
) => {
    const colors = StyleUtils.getColors({ mode });
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

    const extraElements = selfs.slice(steps.length, Infinity);
    extraElements.forEach(el => el.parentElement.removeChild(el));

    return steps.map((xIndex, index) => {
        let self = selfs[index];
        if (!self) {
            self = document.createElement('div');
        }

        const xOriginal = xColumn.pointsOriginal[xIndex];

        self.innerText = new Date(xOriginal)
            .toString()
            .split(' ')
            .slice(1, 3)
            .join(' ');

        DomUtils.setElementStyle(self, {
            fontSize: '10px',
            color: colors.gridText,
        });

        container.appendChild(self);

        return self;
    });
};

const renderYScales = (
    { mode, svg, chartData, aspectRatio }: RenderParams,
    selfs: YScaleInstance[] = [],
) => {
    const minPartHeight = 60;
    const height = svg.clientHeight;
    const parts = Math.floor(height / minPartHeight);
    const yMarkers = MathUtils.divideToRoundParts({
        max: chartData.extremums.yMax,
        min: chartData.extremums.yMin,
        parts,
    });

    const yMarkersPercentised = ChartDataUtils.percentisePoints({
        isY: true,
        points: yMarkers,
        min: chartData.extremums.yMin,
        max: chartData.extremums.yMax,
    });

    const rerenderedScales = yMarkers
        .slice(0, yMarkers.length - 1)
        .map((yOriginal, index) => {
            let self = selfs[index];
            const params = {
                svg,
                aspectRatio,
                yOriginal,
                yPercentised: yMarkersPercentised[index],
                isZeroScale: index === 0,
                mode,
                isHidden: false,
            };
            if (!self) {
                self = YScale.render(params);
            } else {
                self.reRender(params);
            }
            return self;
        });

    selfs.forEach((scale, index) => {
        if (!rerenderedScales[index]) {
            rerenderedScales.push(selfs[index]);
            selfs[index].reRender({
                isHidden: true,
            });
        }
    });

    return rerenderedScales;
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
    aspectRatio: number;
    mode: ColorMode;
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
