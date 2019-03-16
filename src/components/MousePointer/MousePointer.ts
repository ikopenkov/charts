import { ComponentUtils } from 'src/utils/ComponentUtils';
import { Circle, CircleInstance } from 'src/components/MousePointer/_Circle';
import { ChartRenderData } from 'src/utils/ChartDataUtils/ChartData.types';
import { MathUtils } from 'src/utils/MathUtils/MathUtils';
import { Ruler, RulerInstance } from 'src/components/MousePointer/_Ruler';
import { Caption, CaptionInstance } from 'src/components/MousePointer/_Caption';

const calcY = (x: number, xPoints: number[], yPoints: number[]) => {
    const boundingPoints = MathUtils.getBoundingPoints({ x, xPoints, yPoints });

    const yCalculator = MathUtils.getYOfLineCalculator(boundingPoints);

    return yCalculator(x);
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
    self?: Instance;
};
const render = ({
    svg,
    container,
    chartData: { xColumn, yColumns },
    x,
    aspectRatio,
    circleStyle,
    rulerStyle,
    self,
}: RenderParams) => {
    let instance = self;
    if (!instance) {
        const ruler = Ruler.render({
            x,
            aspectRatio,
            svg,
            color: '#DFE6EB',
            ...rulerStyle,
        });

        const circles = yColumns.map(yColumn => {
            return Circle.render({
                aspectRatio,
                x,
                y: calcY(
                    x,
                    xColumn.pointsPercentised,
                    yColumn.pointsPercentised,
                ),
                color: yColumn.color,
                svg,
                ...circleStyle,
            });
        });

        const caption = Caption.render({
            x,
            aspectRatio,
            container,
        });
        instance = {
            circles,
            ruler,
            caption,
        };
    } else {
        yColumns.forEach((yColumn, index) => {
            const circle = instance.circles[index];
            circle.reRender({
                x,
                aspectRatio,
                y: calcY(
                    x,
                    xColumn.pointsPercentised,
                    yColumn.pointsPercentised,
                ),
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
        });
    }

    return instance;
};

export const MousePointer = ComponentUtils.create(render);
