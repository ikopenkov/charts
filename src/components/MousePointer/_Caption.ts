import { ComponentUtils } from 'src/utils/ComponentUtils';
import { DomUtils } from 'src/utils/DomUtils';
import { ChartRenderData } from 'src/utils/ChartDataUtils/ChartData.types';

const renderDescriptionHtml = (value: number, name: string) =>
    `<div style="font-weight: bold;">${value}</div><div style="margin-top: 2px; font-size: 10px">${name}</div>`;

type Self = {
    rootEl: HTMLElement;
    headerEl: HTMLElement;
    descriptionsWrapper: HTMLElement;
    descriptionEls: HTMLElement[];
};

export type CaptionStyle = {
    backgroundColor: string;
    headerColor: string;
};

type RenderParams = {
    x: number;
    container: HTMLElement;
    aspectRatio: number;
    style: CaptionStyle;
    chartData: ChartRenderData;
    header: string;
    yValuesOriginal: number[];
    self?: Self;
};

const render = ({
    container,
    chartData,
    style,
    x,
    aspectRatio,
    header,
    yValuesOriginal,
    self,
}: RenderParams) => {
    let instance = self;
    if (!instance) {
        const rootEl = document.createElement('div');
        DomUtils.setElementStyle(rootEl, {
            minWidth: '100px',
            fontSize: '14px',
            boxSizing: 'border-box',
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

    let xSafe = x - 10;
    if (xSafe < 0) {
        xSafe = 0;
    }
    const rightOffsetPx =
        container.clientWidth -
        ((xSafe * container.clientWidth) / 100 + instance.rootEl.offsetWidth);
    if (rightOffsetPx <= 0) {
        DomUtils.setElementStyle(instance.rootEl, {
            left: 'auto',
            right: '0',
        });
    } else {
        DomUtils.setElementStyle(instance.rootEl, {
            left: `${xSafe}%`,
            right: 'auto',
        });
    }

    DomUtils.setElementStyle(instance.rootEl, {
        padding: '5px 10px',
        position: 'absolute',
        backgroundColor: style.backgroundColor,
        boxShadow: '0px 0px 3px 1px rgba(0, 0, 0, 0.1)',
        borderRadius: '5px',
        top: '10%',
    });

    instance.headerEl.innerText = header;

    instance.descriptionEls.forEach((el, index) => {
        const yCol = chartData.yColumns[index];
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
    });

    return instance;
};

export const Caption = ComponentUtils.create(render);

export type CaptionInstance = ReturnType<typeof Caption.render>;
