import { ComponentUtils } from 'src/utils/ComponentUtils';
import { DomUtils } from 'src/utils/DomUtils';
import { ChartRenderData } from 'src/utils/ChartDataUtils/ChartData.types';
import { ColorMode, StyleUtils } from 'src/utils/StyleUtils';

const renderDescriptionHtml = (value: number, name: string) =>
    `<div style="font-weight: bold;">${value}</div><div style="margin-top: 2px; font-size: 10px">${name}</div>`;

const updateDescriptionEl = (
    el: HTMLElement,
    index: number,
    chartData: ChartRenderData,
    yValuesOriginal: number[],
) => {
    const yCol = chartData.yColumns[index];
    if (yCol) {
        DomUtils.setElementStyle(
            el,
            {
                color: yCol.color,
                paddingLeft: index === 0 ? '0' : '5px',
            },
            { replaceWholeStyleObject: true },
        );
        // eslint-disable-next-line no-param-reassign
        el.innerHTML = renderDescriptionHtml(yValuesOriginal[index], yCol.name);
    } else {
        DomUtils.setElementStyle(el, {
            display: 'none',
        });
    }
};

const updateElements = (params: RenderParams) => {
    const {
        self,
        isVisible,
        container,
        x,
        aspectRatio,
        mode,
        chartData,
        yValuesOriginal,
        header,
    } = params;
    if (isVisible) {
        const width = self.rootEl.offsetWidth;
        const containerWidth = container.offsetWidth;
        const halfWidth = width / 2;
        const pixelsInPercent = containerWidth / (100 * aspectRatio);
        const xProportionated = x * aspectRatio;
        const xPx = xProportionated * pixelsInPercent;

        const leftSideX = xPx - halfWidth;

        let missingLeft = 0;
        if (leftSideX < 0) {
            missingLeft = leftSideX;
        }
        const rightSideX = leftSideX + width;
        const needStickToRight = rightSideX > containerWidth;

        const colors = StyleUtils.getColors({ mode });
        DomUtils.setElementStyle(self.rootEl, {
            padding: '5px 10px',
            position: 'absolute',
            right: needStickToRight ? '0' : 'auto',
            left: needStickToRight ? 'auto' : `${leftSideX - missingLeft}px`,
            backgroundColor: colors.background,
            boxShadow: '0px 0px 3px 1px rgba(0, 0, 0, 0.1)',
            borderRadius: '5px',
            top: '0',
            color: colors.text,
        });

        self.headerEl.innerText = header;

        self.descriptionEls.forEach((el, index) =>
            updateDescriptionEl(el, index, chartData, yValuesOriginal),
        );

        DomUtils.setElementStyle(self.rootEl, { display: '' });
    } else {
        DomUtils.setElementStyle(self.rootEl, { display: 'none' });
    }
};

type Self = {
    rootEl: HTMLElement;
    headerEl: HTMLElement;
    descriptionsWrapper: HTMLElement;
    descriptionEls: HTMLElement[];
};

type RenderParams = {
    x: number;
    container: HTMLElement;
    aspectRatio: number;
    chartData: ChartRenderData;
    header: string;
    yValuesOriginal: number[];
    isVisible: boolean;
    mode: ColorMode;
    self?: Self;
};

const render = (params: RenderParams) => {
    const { container, chartData } = params;

    let instance = params.self;
    if (!instance) {
        const rootEl = document.createElement('div');
        DomUtils.setElementStyle(rootEl, {
            minWidth: '80px',
            fontSize: '13px',
            boxSizing: 'border-box',
            pointerEvents: 'none',
        });
        container.appendChild(rootEl);

        const headerEl = document.createElement('div');
        DomUtils.setElementStyle(headerEl, {
            flexBasis: '100%',
        });
        rootEl.appendChild(headerEl);

        const descriptionsWrapper = document.createElement('div');
        DomUtils.setElementStyle(descriptionsWrapper, {
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            marginTop: '10px',
        });
        rootEl.appendChild(descriptionsWrapper);

        const descriptionEls = chartData.yColumns.map(col => {
            const el = document.createElement('div');
            descriptionsWrapper.appendChild(el);

            return el;
        });

        instance = {
            rootEl,
            headerEl,
            descriptionsWrapper,
            descriptionEls,
        };
    }

    updateElements({
        ...params,
        self: instance,
    });

    return instance;
};

export const Caption = ComponentUtils.create(render);

export type CaptionInstance = ReturnType<typeof Caption.render>;
