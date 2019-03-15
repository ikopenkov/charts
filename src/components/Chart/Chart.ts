import { PolyLine } from 'src/components/PolyLine/PolyLine';
import { ChartDataUtils } from 'src/utils/ChartDataUtils/ChartDataUtils';
import { ChartData } from 'src/utils/ChartDataUtils/ChartData.types';
import { EventUtils } from 'src/utils/EventUtils';

const createSvg = (container: Element) => {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');

    container.appendChild(svg);

    return svg;
};

const render = (container: Element, chartData: ChartData) => {
    const svg = createSvg(container);

    const { xColumn, yColumns } = ChartDataUtils.transformDataToRender(
        chartData,
    );

    const xPointsPercentised = xColumn.pointsPercentised;

    const polyLines = yColumns.map(column => {
        return PolyLine.render({
            svg,
            color: column.color,
            xPointsInPercents: xPointsPercentised,
            yPointsInPercents: column.pointsPercentised,
        });
    });

    const handleResize = () => {
        polyLines.forEach(polyLine => {
            polyLine.reRender();
        });
    };

    window.addEventListener(
        'resize',
        EventUtils.throttle(handleResize, 66),
        false,
    );

    // svg.addEventListener('mousemove', event => {
    // console.log(event.clientX, event.clientY);
    // });
};

export const Chart = {
    render,
};
