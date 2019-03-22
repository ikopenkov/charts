import { ComponentUtils } from 'src/utils/ComponentUtils';
import { Circle, CircleInstance } from 'src/components/MousePointer/_Circle';
import { ChartRenderData } from 'src/utils/ChartDataUtils/ChartData.types';
import { Ruler, RulerInstance } from 'src/components/MousePointer/_Ruler';
import {
    Caption,
    CaptionInstance,
    CaptionStyle,
} from 'src/components/MousePointer/_Caption';
import { ChartDataUtils } from 'src/utils/ChartDataUtils/ChartDataUtils';
import { MathUtils } from 'src/utils/MathUtils/MathUtils';

const getDateFormatted = (timestamp: number) => {
    const date = new Date(timestamp);
    const dateStr = date.toString();
    const [weekDay, mon, day] = dateStr.split(' ');
    return `${weekDay}, ${mon} ${day}`;
};

type Instance = {
    circles: CircleInstance[];
    ruler: RulerInstance;
    caption: CaptionInstance;
};

type RenderParams = {
    xPercent: number;
    chartData: ChartRenderData;
    container: HTMLElement;
    svg: SVGSVGElement;
    aspectRatio: number;
    rulerStyle: {
        widthInPercent: number;
        color: string;
    };
    circleStyle: {
        fillColor: string;
        strokeWidthInPercent: number;
        radiusInPercent: number;
    };
    captionStyle: CaptionStyle;
    isVisible: boolean;
    self?: Instance;
};
const render = ({
    svg,
    container,
    chartData,
    xPercent,
    aspectRatio,
    circleStyle,
    rulerStyle,
    captionStyle,
    isVisible,
    self,
}: RenderParams) => {
    const xPoint = MathUtils.getNearestPoint(
        chartData.xColumn.pointsPercentised,
        xPercent,
    );

    const xOriginal = ChartDataUtils.unpercentise({
        min: chartData.extremums.xMin,
        max: chartData.extremums.xMax,
        percent: xPercent,
        isY: false,
    });

    const xIndex = chartData.xColumn.pointsPercentised.indexOf(xPoint);

    const yValuesPercentised = chartData.yColumns.map(
        col => col.pointsPercentised[xIndex],
    );
    const yValuesOriginal = chartData.yColumns.map(
        col => col.pointsOriginal[xIndex],
    );

    let instance = self;
    if (!instance) {
        const ruler = Ruler.render({
            x: xPoint,
            aspectRatio,
            svg,
            color: '#DFE6EB',
            isVisible,
            ...rulerStyle,
        });

        const circles = chartData.yColumns.map((yColumn, index) => {
            yValuesPercentised.push();
            return Circle.render({
                aspectRatio,
                x: xPoint,
                y: yValuesPercentised[index],
                color: yColumn.color,
                svg,
                isVisible,
                ...circleStyle,
            });
        });

        const caption = Caption.render({
            x: xPoint,
            aspectRatio,
            container,
            style: captionStyle,
            chartData,
            header: getDateFormatted(xOriginal),
            yValuesOriginal,
            isVisible,
        });
        instance = {
            circles,
            ruler,
            caption,
        };
    } else {
        chartData.yColumns.forEach((yColumn, index) => {
            const circle = instance.circles[index];
            circle.reRender({
                x: xPoint,
                aspectRatio,
                y: yValuesPercentised[index],
                isVisible,
                ...circleStyle,
            });
        });
        instance.ruler.reRender({
            aspectRatio,
            x: xPoint,
            isVisible,
            ...rulerStyle,
        });
        instance.caption.reRender({
            aspectRatio,
            x: xPoint,
            header: getDateFormatted(xOriginal),
            yValuesOriginal,
            chartData,
            style: captionStyle,
            container,
            isVisible,
        });
    }

    return instance;
};

export const MousePointer = ComponentUtils.create(render);
export type MousePointerInstance = ReturnType<typeof MousePointer.render>;
