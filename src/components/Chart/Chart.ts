import { PolyLine, PolyLineInstance } from 'src/components/PolyLine/PolyLine';
import { ChartDataUtils } from 'src/utils/ChartDataUtils/ChartDataUtils';
import { ChartData } from 'src/utils/ChartDataUtils/ChartData.types';
import { EventUtils } from 'src/utils/EventUtils';
import {
    MousePointer,
    MousePointerInstance,
} from 'src/components/MousePointer/MousePointer';
import { MathUtils } from 'src/utils/MathUtils/MathUtils';
import { Grid, GridInstance } from 'src/components/Grid/Grid';
import { DomUtils } from 'src/utils/DomUtils';
import { ComponentUtils } from 'src/utils/ComponentUtils';
import { RangeSelector } from 'src/components/RangeSelector/RangeSelector';

const renderDom = (container: HTMLElement) => {
    const mainContainer = document.createElement('div');
    DomUtils.setElementStyle(mainContainer, {
        height: '100%',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
    });

    const headerContainer = document.createElement('div');
    DomUtils.setElementStyle(headerContainer, {
        padding: '15px 5px',
        fontSize: '16px',
        lineHeight: '1.2',
        fontWeight: 'bold',
    });
    headerContainer.innerText = 'Some Header';

    const svgContainer = document.createElement('div');
    DomUtils.setElementStyle(svgContainer, {
        flex: '1 1 auto',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
    });

    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    DomUtils.setElementStyle(svg, {
        flex: '1 1 auto',
    });

    const xScaleContainer = document.createElement('div');
    DomUtils.setElementStyle(xScaleContainer, {
        flex: '0 0 auto',
        height: '30px',
    });

    const rangeSelectorContainer = document.createElement('div');
    DomUtils.setElementStyle(rangeSelectorContainer, {
        flex: '0 0 auto',
        height: '60px',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
    });

    container.appendChild(mainContainer);
    mainContainer.appendChild(headerContainer);
    mainContainer.appendChild(svgContainer);
    mainContainer.appendChild(xScaleContainer);
    mainContainer.appendChild(rangeSelectorContainer);
    svgContainer.appendChild(svg);

    return {
        svg,
        mainContainer,
        headerContainer,
        xScaleContainer,
        rangeSelectorContainer,
        svgContainer,
    };
};

type Instance = {
    grid: GridInstance;
    polyLines: PolyLineInstance[];
    mousePointer: MousePointerInstance;
    mainContainer: HTMLElement;
    headerContainer: HTMLElement;
    xScaleContainer: HTMLElement;
    rangeSelectorContainer: HTMLElement;
    svgContainer: HTMLElement;
    svg: SVGSVGElement;
};

type Params = {
    container: HTMLElement;
    data: ChartData;
    self?: Instance;
};

const render = ({ container, data, self }: Params) => {
    const sizesInPercent = {
        lineThin: 0.3,
        lineBold: 0.6,
        pointerCircleRadius: 1.2,
        text: 4,
    };

    const colors = {
        ruler: '#DFE6EB',
        horizontalScale: '#F2F4F5',
        scaleText: '#96A2AA',
        text: '#222222',
        gridText: '#96A2AA',
        background: '#fff',
    };

    let instance = self;
    if (!instance) {
        const {
            svgContainer,
            xScaleContainer,
            mainContainer,
            headerContainer,
            rangeSelectorContainer,
            svg,
        } = renderDom(container);

        const aspectRatio = DomUtils.getAspectRatio(svg);

        svg.setAttribute('viewBox', `0 0 ${100 * aspectRatio} 100`);

        const chartData = ChartDataUtils.transformDataToRender(data);

        const grid = Grid.render({
            svg,
            aspectRatio,
            style: {
                textSizeInPercent: sizesInPercent.text,
                lineColor: colors.horizontalScale,
                lineWidthInPercent: sizesInPercent.lineThin,
                textColor: colors.gridText,
            },
            container: xScaleContainer,
            chartData,
        });

        const { xColumn, yColumns } = chartData;

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

        let currentX = 0;
        const mousePointer = MousePointer.render({
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

                mousePointer.reRender({
                    x,
                    aspectRatio: DomUtils.getAspectRatio(svg),
                });
            }
        });

        const rangeSelector = RangeSelector.render({
            chartData,
            container: rangeSelectorContainer,
        });

        const handleResize = () => {
            // eslint-disable-next-line no-shadow
            const aspectRatio = DomUtils.getAspectRatio(svg);
            svg.setAttribute('viewBox', `0 0 ${100 * aspectRatio} 100`);

            polyLines.forEach(polyLine => {
                polyLine.reRender({
                    aspectRatio,
                });
            });

            mousePointer.reRender({
                aspectRatio,
            });

            grid.reRender({
                aspectRatio,
            });

            rangeSelector.reRender();
        };

        window.addEventListener(
            'resize',
            EventUtils.throttle(handleResize, 66),
            false,
        );

        instance = {
            headerContainer,
            svgContainer,
            xScaleContainer,
            mainContainer,
            rangeSelectorContainer,
            svg,
            polyLines,
            grid,
            mousePointer,
        };
    } else {
        // no need this for contest, may be somewhen later
    }

    return instance;
};

export const Chart = ComponentUtils.create(render);

export type ChartInstance = ReturnType<typeof Chart.render>;
