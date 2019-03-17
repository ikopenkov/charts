import { ChartRenderData } from 'src/utils/ChartDataUtils/ChartData.types';
import { MathUtils } from 'src/utils/MathUtils/MathUtils';
import { Scale, ScaleInstance, ScaleStyle } from 'src/components/Grid/_Scale';
import { ComponentUtils } from 'src/utils/ComponentUtils';
import { ChartDataUtils } from 'src/utils/ChartDataUtils/ChartDataUtils';

type Instance = {
    scales: ScaleInstance[];
};

type RenderParams = {
    chartData: ChartRenderData;
    svg: SVGSVGElement;
    style: ScaleStyle;
    aspectRatio: number;
    self?: Instance;
};
const render = ({ self, svg, aspectRatio, style, chartData }: RenderParams) => {
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

    let instance = self;
    if (!instance) {
        const scales = yMarkers
            .slice(0, yMarkers.length - 1)
            .map((yOriginal, index) => {
                return Scale.render({
                    svg,
                    aspectRatio,
                    yOriginal,
                    yPercentised: yMarkersPercentised[index],
                    style,
                });
            });
        instance = {
            scales,
        };
    } else {
        instance.scales.forEach((scale, index) => {
            const yOriginal = yMarkers[index];
            const yPercentised = yMarkersPercentised[index];
            scale.reRender({
                style,
                yOriginal,
                yPercentised,
                svg,
            });
        });
    }

    return instance;
};

export const Grid = ComponentUtils.create(render);

export type GridInstance = ReturnType<typeof Grid.render>;
