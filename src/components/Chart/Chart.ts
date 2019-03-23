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
import {
    ColSwitch,
    ColSwitchInstance,
} from 'src/components/ColSwitch/ColSwitch';

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
    });

    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    DomUtils.setElementStyle(svg, {
        width: '100%',
        height: '100%',
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

    const switchContainer = document.createElement('div');
    DomUtils.setElementStyle(switchContainer, {
        flex: '0 0 auto',
        padding: '20px 0',
        position: 'relative',
        display: 'flex',
    });

    container.appendChild(mainContainer);
    mainContainer.appendChild(headerContainer);
    mainContainer.appendChild(svgContainer);
    mainContainer.appendChild(xScaleContainer);
    mainContainer.appendChild(rangeSelectorContainer);
    mainContainer.appendChild(switchContainer);
    svgContainer.appendChild(svg);

    return {
        svg,
        mainContainer,
        headerContainer,
        xScaleContainer,
        rangeSelectorContainer,
        switchContainer,
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
    const { svg } = self;

    self.aspectRatio = DomUtils.getAspectRatio(svg);

    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    render(params);
};

const handleRangeSelectionChange = (
    xMinPercent: number,
    xMaxPercent: number,
    params: Required<Params>,
) => {
    const { self } = params;

    self.xMinPercent = xMinPercent;
    self.xMaxPercent = xMaxPercent;

    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    render(params);
};

const handleCheckedIndexesChange = (
    indexes: number[],
    params: Required<Params>,
) => {
    const { self } = params;
    self.checkedIndexes = indexes;
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    render(params);
};

const reRender = (params: Params) => {
    const { self } = params;
    const {
        svg,
        grid,
        polyLines,
        mousePointer,
        aspectRatio,
        rangeSelector,
    } = self;

    svg.setAttribute('viewBox', `0 0 ${100 * aspectRatio} 100`);

    const chartData = ChartDataUtils.transformDataToRender(params.data, {
        xMinPercent: self.xMinPercent,
        xMaxPercent: self.xMaxPercent,
        includingYIndexes: self.checkedIndexes,
    });

    self.chartData = chartData;

    grid.reRender({ chartData, aspectRatio });

    polyLines.forEach((polyLine, index) => {
        const yCol = chartData.yColumns[index];
        if (yCol) {
            polyLine.reRender({
                xPointsInPercents: chartData.xColumn.pointsPercentised,
                yPointsInPercents: yCol.pointsPercentised,
                aspectRatio,
                color: yCol.color,
                isHidden: false,
            });
        } else {
            polyLine.reRender({
                isHidden: true,
                color: 'black',
            });
        }
    });

    mousePointer.reRender({ chartData, aspectRatio });

    rangeSelector.reRender();
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
    switchContainer: HTMLElement;
    svgContainer: HTMLElement;
    svg: SVGSVGElement;
    chartData: ChartRenderData;
    currentPointerX: number;
    checkedIndexes: number[];
    xMinPercent: number;
    xMaxPercent: number;
    aspectRatio: number;
    colSwitch: ColSwitchInstance;
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
            switchContainer,
            svg,
        } = renderDom(container);

        const chartDataUncut = ChartDataUtils.transformDataToRender(data);
        const checkedIndexes = chartDataUncut.yColumns.map((y, index) => index);

        const checkedIndexesChangeHandlerWrapper = {
            onChage: (indexes: number[]) => {},
        };
        const colSwitch = ColSwitch.render({
            mode: InitialData.mode,
            container: switchContainer,
            chartData: chartDataUncut,
            onChange: indexes =>
                checkedIndexesChangeHandlerWrapper.onChage(indexes),
        });

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
            switchContainer,
            svg,
            polyLines,
            grid,
            mousePointer,
            colSwitch,
            rangeSelector,
            currentPointerX,
            chartData,
            checkedIndexes,
            xMinPercent: InitialData.rangeXMinPercent,
            xMaxPercent: InitialData.rangeXMaxPercent,
            aspectRatio,
        };

        checkedIndexesChangeHandlerWrapper.onChage = (indexes: number[]) =>
            handleCheckedIndexesChange(indexes, { ...params, self: instance });

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
        reRender(params);
    }

    return instance;
};

export const Chart = ComponentUtils.create(render);

export type ChartInstance = ReturnType<typeof Chart.render>;
