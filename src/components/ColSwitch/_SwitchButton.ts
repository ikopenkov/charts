import { ComponentUtils } from 'src/utils/ComponentUtils';
import { DomUtils } from 'src/utils/DomUtils';
import { ColorMode, StyleUtils } from 'src/utils/StyleUtils';

const checkMarkHtml = `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24"><path fill="#fff" d="M20.285 2l-11.285 11.567-5.286-5.011-3.714 3.716 9 8.728 15-15.285z"/></svg>`;

type Instance = {
    root: HTMLElement;
    checkbox: HTMLElement;
    // checkboxMark: HTMLElement;
    text: HTMLElement;
};

type RenderParams = {
    text: string;
    isChecked: boolean;
    container: HTMLElement;
    mode: ColorMode;
    color: string;
    onClick: () => void;
    self?: Instance;
};
const render = ({
    container,
    isChecked,
    mode,
    text,
    color,
    onClick,
    self,
}: RenderParams) => {
    let instance = self;
    if (!instance) {
        const root = document.createElement('div');
        container.appendChild(root);

        root.addEventListener('click', onClick);

        const checkbox = document.createElement('div');
        root.appendChild(checkbox);

        checkbox.innerHTML = checkMarkHtml;

        // const checkboxMark = document.createElement('div');
        // root.appendChild(checkboxMark);

        const textEl = document.createElement('div');
        root.appendChild(textEl);

        instance = {
            root,
            checkbox,
            // checkboxMark,
            text: textEl,
        };
    }

    const colors = StyleUtils.getColors({ mode });

    DomUtils.setElementStyle(instance.root, {
        border: `${StyleUtils.SIZES_PX.lineThin}px solid ${
            colors.switchBorder
        }`,
        borderRadius: '50px',
        padding: '5px 10px',
        display: 'flex',
        alignItems: 'center',
        marginRight: '20px',
        cursor: 'pointer',
    });

    DomUtils.setElementStyle(instance.checkbox, {
        border: `${StyleUtils.SIZES_PX.lineThin}px solid ${color}`,
        backgroundColor: isChecked ? color : colors.background,
        borderRadius: '50px',
        width: '20px',
        height: '20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: '12px',
    });

    DomUtils.setElementStyle(instance.text, {
        color: colors.text,
        fontSize: `${StyleUtils.SIZES_PX.switchText}px`,
    });

    instance.text.innerText = text;

    return instance;
};

export const SwitchButton = ComponentUtils.create(render);

export type SwitchButtonInstance = ReturnType<typeof SwitchButton.render>;
