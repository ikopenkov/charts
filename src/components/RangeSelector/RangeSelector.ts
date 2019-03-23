import { ComponentUtils } from 'src/utils/ComponentUtils';
import { ChartRenderData } from 'src/utils/ChartDataUtils/ChartData.types';
import { PolyLine, PolyLineInstance } from 'src/components/PolyLine/PolyLine';
import { DomUtils } from 'src/utils/DomUtils';
import {
    ChangeHandler,
    SelectionOverlay,
    SelectionOverlayInstance,
} from 'src/components/RangeSelector/_SelectionOverlay';
import { ColorMode } from 'src/utils/StyleUtils';

type Self = {
    svg: SVGSVGElement;
    polyLines: PolyLineInstance[];
    selectionOverlay: SelectionOverlayInstance;
};

type RenderParams = {
    chartData: ChartRenderData;
    container: HTMLElement;
    onChange: ChangeHandler;
    initialX1: number;
    initialX2: number;
    mode: ColorMode;
    self?: Self;
};

const render = ({
    container,
    initialX1,
    initialX2,
    onChange,
    chartData,
    mode,
    self,
}: RenderParams) => {
    const aspectRatio = DomUtils.getAspectRatio(container);

    const polyLinesData = chartData.yColumns.map(yCol => ({
        aspectRatio,
        color: yCol.color,
        xPointsInPercents: chartData.xColumn.pointsPercentised,
        yPointsInPercents: yCol.pointsPercentised,
        isThin: true,
    }));

    let instance = self;
    if (!instance) {
        const svg = DomUtils.createSvgElement<SVGSVGElement>('svg');
        container.appendChild(svg);

        const polyLines = polyLinesData.map(data =>
            PolyLine.render({
                svg,
                ...data,
            }),
        );

        const selectionOverlay = SelectionOverlay.render({
            container,
            onChange,
            initialX1,
            initialX2,
            mode,
        });

        instance = {
            polyLines,
            svg,
            selectionOverlay,
        };
    } else {
        const extraPolyLines = instance.polyLines.slice(
            polyLinesData.length,
            Infinity,
        );
        extraPolyLines.forEach(polyLine => polyLine.remove());

        instance.polyLines = polyLinesData.map((data, index) => {
            const polyLine = instance.polyLines[index];
            polyLine.reRender(data);
            return polyLine;
        });

        instance.selectionOverlay.reRender({
            container,
            mode,
        });
    }

    instance.svg.setAttribute('viewBox', `0 0 ${100 * aspectRatio} 100`);

    return instance;
};

export const RangeSelector = ComponentUtils.create(render);
export type RangeSelectorInstance = ReturnType<typeof RangeSelector.render>;
