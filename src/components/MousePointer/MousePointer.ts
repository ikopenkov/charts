import { ComponentUtils } from 'src/utils/ComponentUtils';
import { Circle, CircleInstance } from 'src/components/MousePointer/_Circle';
import { ChartRenderData } from 'src/utils/ChartDataUtils/ChartData.types';
import { MathUtils } from 'src/utils/MathUtils/MathUtils';
import { Ruler, RulerInstance } from 'src/components/MousePointer/_Ruler';
import {
    Caption,
    CaptionInstance,
    CaptionStyle,
} from 'src/components/MousePointer/_Caption';
import { ChartDataUtils } from 'src/utils/ChartDataUtils/ChartDataUtils';

const calcY = (x: number, xPoints: number[], yPoints: number[]) => {
    const boundingPoints = MathUtils.getBoundingPoints({ x, xPoints, yPoints });
    const yCalculator = MathUtils.getYOfLineCalculator(boundingPoints);

    return yCalculator(x);
};

const getDateFormatted = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString();
};

type Instance = {
    circles: CircleInstance[];
    ruler: RulerInstance;
    caption: CaptionInstance;
};

type RenderParams = {
    x: number;
    y: number;
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
    self?: Instance;
};
const render = ({
    svg,
    container,
    chartData,
    x,
    aspectRatio,
    circleStyle,
    rulerStyle,
    captionStyle,
    self,
}: RenderParams) => {
    const yValuesPercentised = chartData.yColumns.map(yColumn =>
        calcY(
            x,
            chartData.xColumn.pointsPercentised,
            yColumn.pointsPercentised,
        ),
    );
    const xOriginal = Math.round(
        ChartDataUtils.unpercentise({
            min: chartData.extremums.xMin,
            max: chartData.extremums.xMax,
            percent: x,
            isY: false,
        }),
    );
    const yValuesOriginal = chartData.yColumns.map(yColumn =>
        Math.round(
            calcY(
                xOriginal,
                chartData.xColumn.pointsOriginal,
                yColumn.pointsOriginal,
            ),
        ),
    );
    // const dateFormatted =

    let instance = self;
    if (!instance) {
        const ruler = Ruler.render({
            x,
            aspectRatio,
            svg,
            color: '#DFE6EB',
            ...rulerStyle,
        });

        const circles = chartData.yColumns.map((yColumn, index) => {
            yValuesPercentised.push();
            return Circle.render({
                aspectRatio,
                x,
                y: yValuesPercentised[index],
                color: yColumn.color,
                svg,
                ...circleStyle,
            });
        });

        const caption = Caption.render({
            x,
            aspectRatio,
            container,
            style: captionStyle,
            chartData,
            header: getDateFormatted(xOriginal),
            yValuesOriginal,
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
                x,
                aspectRatio,
                y: yValuesPercentised[index],
                ...circleStyle,
            });
        });
        instance.ruler.reRender({
            aspectRatio,
            x,
            ...rulerStyle,
        });
        instance.caption.reRender({
            aspectRatio,
            x,
            header: getDateFormatted(xOriginal),
            yValuesOriginal,
            chartData,
            style: captionStyle,
            container,
        });
    }

    return instance;
};

export const MousePointer = ComponentUtils.create(render);
