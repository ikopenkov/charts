import { PolyLine, PolyLineInstance } from 'src/components/PolyLine/PolyLine';
import { ChartDataUtils } from 'src/utils/ChartDataUtils/ChartDataUtils';
import {
    ChartData,
    ChartRenderData,
} from 'src/utils/ChartDataUtils/ChartData.types';
import { EventUtils } from 'src/utils/EventUtils';
import {
    MousePointer,
    MousePointerInstance,
} from 'src/components/MousePointer/MousePointer';
import { Grid, GridInstance } from 'src/components/Grid/Grid';
import { DomUtils } from 'src/utils/DomUtils';
import { ComponentUtils } from 'src/utils/ComponentUtils';
import {
    RangeSelector,
    RangeSelectorInstance,
} from 'src/components/RangeSelector/RangeSelector';
import { ColorMode } from 'src/utils/StyleUtils';

type InitialDataType = {
    rangeXMinPercent: number;
    rangeXMaxPercent: number;
    mode: ColorMode;
};
const InitialData: InitialDataType = {
    rangeXMinPercent: 70,
    rangeXMaxPercent: 100,
    mode: 'day',
};

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

const handleMouseMove = (event: MouseEvent, params: Required<Params>) => {
    const { self } = params;
    const { svg, currentPointerX, mousePointer } = self;
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

    if (mousePercentX !== currentPointerX) {
        self.currentPointerX = mousePercentX;

        mousePointer.reRender({
            isVisible: true,
            xPercent: mousePercentX,
            aspectRatio: DomUtils.getAspectRatio(svg),
        });
    }
};

const handleMouseLeave = (event: MouseEvent, params: Required<Params>) => {
    const { self } = params;
    const { mousePointer } = self;
    mousePointer.reRender({ isVisible: false });
};

const handleResize = (params: Required<Params>) => {
    const { self } = params;
    const { svg, polyLines, grid, rangeSelector, mousePointer } = self;

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

const handleRangeSelectionChange = (
    xMinPercent: number,
    xMaxPercent: number,
    params: Required<Params>,
) => {
    const { self } = params;
    const { grid, polyLines, mousePointer } = self;

    const chartData = ChartDataUtils.transformDataToRender(params.data, {
        xMinPercent,
        xMaxPercent,
    });

    grid.reRender({ chartData });
    polyLines.forEach((polyLine, index) =>
        polyLine.reRender({
            xPointsInPercents: chartData.xColumn.pointsPercentised,
            yPointsInPercents: chartData.yColumns[index].pointsPercentised,
        }),
    );
    mousePointer.reRender({ chartData });

    self.chartData = chartData;
};

type Instance = {
    grid: GridInstance;
    polyLines: PolyLineInstance[];
    mousePointer: MousePointerInstance;
    mainContainer: HTMLElement;
    headerContainer: HTMLElement;
    xScaleContainer: HTMLElement;
    rangeSelectorContainer: HTMLElement;
    rangeSelector: RangeSelectorInstance;
    svgContainer: HTMLElement;
    svg: SVGSVGElement;
    chartData: ChartRenderData;
    currentPointerX: number;
};

type Params = {
    container: HTMLElement;
    data: ChartData;
    self?: Instance;
};

const render = (params: Params) => {
    const { container, data, self } = params;
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

        const chartData = ChartDataUtils.transformDataToRender(data, {
            xMinPercent: InitialData.rangeXMinPercent,
            xMaxPercent: InitialData.rangeXMaxPercent,
        });

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

        const currentPointerX = 0;
        const mousePointer = MousePointer.render({
            container: svgContainer,
            svg,
            xPercent: currentPointerX,
            aspectRatio,
            chartData,
            mode: InitialData.mode,
            isVisible: false,
        });

        const rangeSelectorChangeHandlerWrapper = {
            onChange: (x1: number, x2: number) => {},
        };
        const chartDataUncut = ChartDataUtils.transformDataToRender(data);
        const rangeSelector = RangeSelector.render({
            chartData: chartDataUncut,
            container: rangeSelectorContainer,
            onChange: (x1, x2) =>
                rangeSelectorChangeHandlerWrapper.onChange(x1, x2),
            initialX1: InitialData.rangeXMinPercent,
            initialX2: InitialData.rangeXMaxPercent,
            mode: InitialData.mode,
        });

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
            currentPointerX,
            chartData,
            rangeSelector,
        };

        rangeSelectorChangeHandlerWrapper.onChange = (x1: number, x2: number) =>
            handleRangeSelectionChange(x1, x2, { ...params, self: instance });

        svg.addEventListener('mousemove', event =>
            handleMouseMove(event, {
                ...params,
                self: instance,
            }),
        );
        svg.addEventListener('mouseleave', event =>
            handleMouseLeave(event, {
                ...params,
                self: instance,
            }),
        );

        window.addEventListener(
            'resize',
            EventUtils.throttle(
                () => handleResize({ ...params, self: instance }),
                66,
            ),
            false,
        );
    } else {
        // no need this for contest, may be somewhen later
    }

    return instance;
};

export const Chart = ComponentUtils.create(render);

export type ChartInstance = ReturnType<typeof Chart.render>;
