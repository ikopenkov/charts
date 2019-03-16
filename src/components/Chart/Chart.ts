import { PolyLine } from 'src/components/PolyLine/PolyLine';
import { ChartDataUtils } from 'src/utils/ChartDataUtils/ChartDataUtils';
import { ChartData } from 'src/utils/ChartDataUtils/ChartData.types';
import { EventUtils } from 'src/utils/EventUtils';
import { MousePointer } from 'src/components/MousePointer/MousePointer';

const createSvg = (container: Element) => {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');

    container.appendChild(svg);

    return svg;
};

const calcAspectRatio = (containerEl: Element) => {
    const containerWidth = containerEl.clientWidth;
    const containerHeight = containerEl.clientHeight;

    return containerWidth / containerHeight;
};

const render = (container: Element, chartData: ChartData) => {
    const svg = createSvg(container);

    const aspectRatio = calcAspectRatio(svg);
    svg.setAttribute('viewBox', `0 0 ${100 * aspectRatio} 100`);

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
            aspectRatio,
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

    const pointer = MousePointer.render({
        svg,
        x: 0,
        y: 0,
        aspectRatio,
        chartData: { xColumn, yColumns },
    });

    svg.addEventListener('mousemove', event => {
        const { top, left, width, height } = svg.getBoundingClientRect();
        const mouseX = event.clientX;
        const mouseY = event.clientY;

        const mouseRelX = mouseX - left;
        const mouseRelY = mouseY - top;

        const mousePercentX = (mouseRelX / width) * 100;
        const mousePercentY = (mouseRelY / height) * 100;

        pointer.reRender({
            x: mousePercentX,
            y: mousePercentY,
        });
    });
};

export const Chart = {
    render,
};
