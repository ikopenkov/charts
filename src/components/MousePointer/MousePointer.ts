import { ComponentUtils } from 'src/utils/ComponentUtils';
import { Circle, CircleInstance } from 'src/components/MousePointer/_Circle';
import { ChartRenderData } from 'src/utils/ChartDataUtils/ChartData.types';
import { Ruler, RulerInstance } from 'src/components/MousePointer/_Ruler';
import { Caption, CaptionInstance } from 'src/components/MousePointer/_Caption';
import { ChartDataUtils } from 'src/utils/ChartDataUtils/ChartDataUtils';
import { MathUtils } from 'src/utils/MathUtils/MathUtils';
import { ColorMode } from 'src/utils/StyleUtils';

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
    mode: ColorMode;
    isVisible: boolean;
    self?: Instance;
};
const render = ({
    svg,
    container,
    chartData,
    xPercent,
    aspectRatio,
    mode,
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
            isVisible,
            mode,
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
                mode,
            });
        });

        const caption = Caption.render({
            x: xPoint,
            aspectRatio,
            container,
            mode,
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
        instance.circles.forEach((circle, index) => {
            const col = chartData.yColumns[index];
            if (col) {
                circle.reRender({
                    x: xPoint,
                    aspectRatio,
                    y: yValuesPercentised[index],
                    isVisible,
                    mode,
                    color: col.color,
                });
            } else {
                circle.reRender({ isVisible: false });
            }
        });
        instance.ruler.reRender({
            aspectRatio,
            x: xPoint,
            isVisible,
            mode,
        });
        instance.caption.reRender({
            aspectRatio,
            x: xPoint,
            header: getDateFormatted(xOriginal),
            yValuesOriginal,
            chartData,
            mode,
            container,
            isVisible,
        });
    }

    return instance;
};

export const MousePointer = ComponentUtils.create(render);
export type MousePointerInstance = ReturnType<typeof MousePointer.render>;
