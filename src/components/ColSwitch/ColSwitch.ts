import { ComponentUtils } from 'src/utils/ComponentUtils';
import { ColorMode } from 'src/utils/StyleUtils';
import {
    SwitchButton,
    SwitchButtonInstance,
} from 'src/components/ColSwitch/_SwitchButton';
import { ChartRenderData } from 'src/utils/ChartDataUtils/ChartData.types';

const handleClick = (index: number, params: RenderParams) => {
    const { self } = params;
    const isChecked = self.checkedIndexes.includes(index);
    if (isChecked) {
        if (self.checkedIndexes.length > 1) {
            self.checkedIndexes = self.checkedIndexes.filter(i => i !== index);
        }
    } else {
        self.checkedIndexes.push(index);
    }

    const params2 = { ...params, mode: self.mode };

    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    render(params2);

    params.onChange(self.checkedIndexes);
};

type Instance = {
    buttons: SwitchButtonInstance[];
    checkedIndexes: number[];
    mode: ColorMode;
};

type RenderParams = {
    chartData: ChartRenderData;
    container: HTMLElement;
    mode: ColorMode;
    onChange: (checkedIndexes: number[]) => void;
    self?: Instance;
};
const render = (renderParams: RenderParams) => {
    const { chartData, container, mode, self } = renderParams;

    let instance = self;
    if (!instance) {
        const checkedIndexes = chartData.yColumns.map((_, index) => index);

        const clickHandlerWrapper = { handleClick: (index: number) => {} };
        const buttons = chartData.yColumns.map((col, index) => {
            return SwitchButton.render({
                container,
                color: col.color,
                isChecked: true,
                mode,
                text: col.name,
                onClick: () => clickHandlerWrapper.handleClick(index),
            });
        });

        instance = {
            buttons,
            checkedIndexes,
            mode,
        };

        clickHandlerWrapper.handleClick = (index: number) =>
            handleClick(index, { ...renderParams, self: instance });
    } else {
        instance.mode = mode;
        instance.buttons.forEach((button, index) =>
            button.reRender({
                isChecked: instance.checkedIndexes.includes(index),
                mode,
            }),
        );
    }

    return instance;
};

export const ColSwitch = ComponentUtils.create(render);

export type ColSwitchInstance = ReturnType<typeof ColSwitch.render>;
