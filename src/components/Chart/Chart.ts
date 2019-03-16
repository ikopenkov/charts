import { PolyLine } from 'src/components/PolyLine/PolyLine';
import { ChartDataUtils } from 'src/utils/ChartDataUtils/ChartDataUtils';
import { ChartData } from 'src/utils/ChartDataUtils/ChartData.types';
import { EventUtils } from 'src/utils/EventUtils';
import { MousePointer } from 'src/components/MousePointer/MousePointer';
import { MathUtils } from 'src/utils/MathUtils/MathUtils';

const renderDom = (container: HTMLElement) => {
    const mainContainer = document.createElement('div');
    const svgContainer = document.createElement('div');
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');

    svgContainer.style.position = 'relative';

    container.appendChild(mainContainer);
    mainContainer.appendChild(svgContainer);
    svgContainer.appendChild(svg);

    return {
        svg,
        mainContainer,
        svgContainer,
    };
};

const calcAspectRatio = (containerEl: Element) => {
    const containerWidth = containerEl.clientWidth;
    const containerHeight = containerEl.clientHeight;

    return containerWidth / containerHeight;
};

const render = (container: HTMLElement, data: ChartData) => {
    const sizesInPercent = {
        lineThin: 0.3,
        lineBold: 0.7,
        pointerCircleRadius: 1.5,
    };

    const colors = {
        ruler: '#DFE6EB',
        veticalScale: '#F2F4F5',
        scaleText: '#96A2AA',
        text: '#222222',
        background: '#fff',
    };

    const {
        svgContainer,
        // mainContainer,
        svg,
    } = renderDom(container);

    const aspectRatio = calcAspectRatio(svg);
    svg.setAttribute('viewBox', `0 0 ${100 * aspectRatio} 100`);

    const chartData = ChartDataUtils.transformDataToRender(data);

    const { xColumn, yColumns } = chartData;

    const xPointsPercentised = xColumn.pointsPercentised;

    const polyLines = yColumns.map(column => {
        return PolyLine.render({
            svg,
            widthInPercent: sizesInPercent.lineBold,
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

    let currentX = 0;
    const pointer = MousePointer.render({
        container: svgContainer,
        svg,
        x: currentX,
        aspectRatio,
        chartData,
        circleStyle: {
            radiusInPercent: sizesInPercent.pointerCircleRadius,
            strokeWidthInPercent: sizesInPercent.lineBold,
            fillColor: colors.background,
        },
        rulerStyle: {
            widthInPercent: sizesInPercent.lineThin,
            color: colors.ruler,
        },
        captionStyle: {
            backgroundColor: colors.background,
            headerColor: colors.text,
        },
    });

    svg.addEventListener('mousemove', event => {
        const {
            // top, height,
            left,
            width,
        } = svg.getBoundingClientRect();
        const mouseX = event.clientX;
        // const mouseY = event.clientY;

        const mouseRelX = mouseX - left;
        // const mouseRelY = mouseY - top;

        const mousePercentX = (mouseRelX / width) * 100;
        // const mousePercentY = (mouseRelY / height) * 100;

        const x = MathUtils.getNearestPoint(
            chartData.xColumn.pointsPercentised,
            mousePercentX,
        );

        if (x !== currentX) {
            currentX = x;

            pointer.reRender({
                x,
            });
        }
    });
};

export const Chart = {
    render,
};
