import { ComponentUtils } from 'src/utils/ComponentUtils';
import { Circle, CircleInstance } from 'src/components/MousePointer/_Circle';
import { ChartRenderData } from 'src/utils/ChartDataUtils/ChartData.types';
import { MathUtils } from 'src/utils/MathUtils/MathUtils';

const calcY = (x: number, xPoints: number[], yPoints: number[]) => {
    const boundingPoints = MathUtils.getBoundingPoints({ x, xPoints, yPoints });

    const yCalculator = MathUtils.getYOfLineCalculator(boundingPoints);

    return yCalculator(x);
};

type Instance = {
    circles: CircleInstance[];
};

type RenderParams = {
    x: number;
    y: number;
    chartData: ChartRenderData;
    svg: SVGSVGElement;
    aspectRatio: number;
    self?: Instance;
};
const render = ({
    svg,
    chartData: { xColumn, yColumns },
    x,
    aspectRatio,
    self,
}: RenderParams) => {
    let instance = self;
    if (!instance) {
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
            });
        });
        instance = {
            circles,
        };
    } else {
        yColumns.forEach((yColumn, index) => {
            const circle = instance.circles[index];
            circle.reRender({
                x,
                y: calcY(
                    x,
                    xColumn.pointsPercentised,
                    yColumn.pointsPercentised,
                ),
            });
        });
    }

    return instance;
};

export const MousePointer = ComponentUtils.create(render);
