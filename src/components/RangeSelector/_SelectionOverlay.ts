import { ComponentUtils } from 'src/utils/ComponentUtils';
import { DomUtils } from 'src/utils/DomUtils';
import { ColorMode, StyleUtils } from 'src/utils/StyleUtils';
import { EventUtils } from 'src/utils/EventUtils';

const borderWidthPx = 5;
const rangerMinWidth = 10;

const handleGrabStart = (cursor: string) => {
    DomUtils.setCursorGlobally(cursor);
    DomUtils.setUserSelectDisabled(true);
};

const handleGrab = (
    xOffset: number,
    renderParams: Required<RenderParams>,
    options: { x1Resize?: boolean; x2Resize?: boolean } = {},

    // Function is long but cant't be easily divided to small separate functions.
    // in this case dividing will lead to more complexity because of
    // context losing & requirement of much same arguments in such functions.
    // eslint-disable-next-line sonarjs/cognitive-complexity
) => {
    const direction: 'left' | 'right' = xOffset < 0 ? 'left' : 'right';

    const { self, container } = renderParams;
    const { x1Initial, x2Initial } = self;
    const pxInPercent = container.clientWidth / 100;
    const offsetPercent = xOffset / pxInPercent;

    let newX1 = x1Initial + offsetPercent;
    let newX2 = x2Initial + offsetPercent;

    if (newX1 <= 0) {
        newX1 = 0;
    }

    if (newX2 >= 100) {
        newX2 = 100;
    }

    const newWidth = newX2 - newX1;
    if (options.x1Resize && options.x2Resize) {
        const initialWidth = self.x2Initial - self.x1Initial;
        const widthDif = initialWidth - newWidth;
        if (direction === 'left' && newX1 === 0) {
            newX2 += widthDif;
        }
        if (direction === 'right' && newX2 === 100) {
            newX1 -= widthDif;
        }
    } else {
        const minWidthLacking = rangerMinWidth - newWidth;
        if (minWidthLacking > 0) {
            if (newX1 === 0) {
                newX2 += minWidthLacking;
            }
            if (newX2 === 100) {
                newX1 -= minWidthLacking;
            }
        }
    }

    if (self.x1 !== newX1 || self.x2 !== newX2) {
        if (options.x1Resize) {
            self.x1 = newX1;
        }
        if (options.x2Resize) {
            self.x2 = newX2;
        }

        // eslint-disable-next-line @typescript-eslint/no-use-before-define
        render({
            ...renderParams,
            self,
        });

        renderParams.onChange(self.x1, self.x2);
    }
};

const handleGrabEnd = (renderParams: Required<RenderParams>) => {
    DomUtils.setCursorGlobally('');
    DomUtils.setUserSelectDisabled(false);

    const { self } = renderParams;
    self.x1Initial = self.x1;
    self.x2Initial = self.x2;
};

type MainPartParams = {
    leftPercent: number | string;
    rightPercent: number | string;
    mode: ColorMode;
    self: HTMLElement;
};
const updateRangerEl = ({
    leftPercent,
    rightPercent,
    mode,
    self,
}: MainPartParams) => {
    const colors = StyleUtils.getColors({ mode });
    const borderLeftStyle = `5px solid ${colors.rangerBorder}`;
    const borderTopStyle = `1px solid ${colors.rangerBorder}`;

    DomUtils.setElementStyle(self, {
        position: 'absolute',
        left: `${leftPercent}%`,
        right: `${rightPercent}%`,
        top: '0',
        bottom: '0',
        borderLeft: borderLeftStyle,
        borderRight: borderLeftStyle,
        borderTop: borderTopStyle,
        borderBottom: borderTopStyle,
        cursor: 'grab',
        touchAction: 'none',
    });
};

const updateBorderEl = ({
    leftPercent,
    rightPercent,
    self,
}: MainPartParams) => {
    const left = leftPercent === 'auto' ? leftPercent : `${leftPercent}%`;
    const right = rightPercent === 'auto' ? rightPercent : `${rightPercent}%`;
    DomUtils.setElementStyle(self, {
        position: 'absolute',
        left,
        right,
        top: '0',
        bottom: '0',
        width: `${borderWidthPx}px`,
        cursor: 'ew-resize',
    });
};

const updateOverlayEl = ({
    leftPercent,
    rightPercent,
    self,
    mode,
}: MainPartParams) => {
    const colors = StyleUtils.getColors({ mode });
    DomUtils.setElementStyle(self, {
        position: 'absolute',
        left: `${leftPercent}%`,
        right: `${rightPercent}%`,
        top: '0',
        bottom: '0',
        backgroundColor: colors.rangerOverlay,
    });
};

type Self = {
    rangerEl: HTMLElement;
    borders: HTMLElement[];
    overlays: HTMLElement[];
    x1: number;
    x2: number;
    x1Initial: number;
    x2Initial: number;
};

export type ChangeHandler = (x1: number, x2: number) => void;

type RenderParams = {
    container: HTMLElement;
    self?: Self;
    onChange: ChangeHandler;
    initialX1: number;
    initialX2: number;
    mode: ColorMode;
};

const render = (params: RenderParams) => {
    const { self, container, initialX1, initialX2 } = params;

    let instance = self;
    if (!instance) {
        const rangerEl = document.createElement('div');
        container.appendChild(rangerEl);

        const x1 = initialX1;
        const x2 = initialX2;

        const borders = [x1, x2].map(() => {
            const border = document.createElement('div');
            container.appendChild(border);
            return border;
        });

        const overlays = [x1, x2].map(() => {
            const overlay = document.createElement('div');
            container.appendChild(overlay);
            return overlay;
        });

        instance = {
            rangerEl,
            borders,
            overlays,
            x1,
            x2,
            x1Initial: x1,
            x2Initial: x2,
        };

        const paramsWithInstance = {
            ...params,
            self: instance,
        };

        EventUtils.addGrabListener({
            element: rangerEl,
            onGrabStart: () => handleGrabStart('grab'),
            onGrab: ({ xOffset }) =>
                handleGrab(xOffset, paramsWithInstance, {
                    x1Resize: true,
                    x2Resize: true,
                }),
            onGrabEnd: () => handleGrabEnd(paramsWithInstance),
        });

        borders.forEach((borderEl, index) => {
            EventUtils.addGrabListener({
                element: borderEl,
                onGrabStart: () => handleGrabStart('ew-resize'),
                onGrab: ({ xOffset }) =>
                    handleGrab(xOffset, paramsWithInstance, {
                        x1Resize: index === 0,
                        x2Resize: index === 1,
                    }),
                onGrabEnd: () => handleGrabEnd(paramsWithInstance),
            });
        });
    }

    const { mode } = params;

    const leftPercent = instance.x1;
    const rightPercent = 100 - instance.x2;

    updateRangerEl({
        self: instance.rangerEl,
        leftPercent,
        rightPercent,
        mode,
    });

    instance.borders.forEach((borderEl, index) => {
        updateBorderEl({
            self: borderEl,
            leftPercent: index === 0 ? leftPercent : 'auto',
            rightPercent: index === 1 ? rightPercent : 'auto',
            mode,
        });
    });

    updateOverlayEl({
        self: instance.overlays[0],
        leftPercent: 0,
        rightPercent: 100 - instance.x1,
        mode,
    });

    updateOverlayEl({
        self: instance.overlays[1],
        leftPercent: instance.x2,
        rightPercent: 0,
        mode,
    });

    return instance;
};

export const SelectionOverlay = ComponentUtils.create(render);

export type SelectionOverlayInstance = ReturnType<
    typeof SelectionOverlay.render
>;
