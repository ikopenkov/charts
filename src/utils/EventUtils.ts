const throttle = (handler: Function, timeout: number) => {
    let resizeTimeout: number;
    return () => {
        if (!resizeTimeout) {
            resizeTimeout = window.setTimeout(() => {
                resizeTimeout = null;
                handler();
            }, timeout);
        }
    };
};

type GrabHandlerResult = { xOffset: number; yOffset: number };
export type GrabHandler = (result: GrabHandlerResult) => void;
const addGrabListener = ({
    element,
    onGrabStart = () => {},
    onGrab = () => {},
    onGrabEnd,
}: {
    element: HTMLElement;
    onGrabStart?: () => void;
    onGrab: GrabHandler;
    onGrabEnd?: () => void;
}) => {
    let isDown = false;

    let initialX = 0;
    let initialY = 0;
    element.addEventListener('pointerdown', event => {
        isDown = true;
        initialX = event.x;
        initialY = event.y;
        onGrabStart();
    });

    document.addEventListener('pointermove', event => {
        if (isDown) {
            onGrab({
                xOffset: event.x - initialX,
                yOffset: event.y - initialY,
            });
        }
    });

    // if set on element it is not triggered when pointer out of element
    document.addEventListener('pointerup', event => {
        if (isDown) {
            onGrabEnd();
        }
        isDown = false;
    });
};

export const EventUtils = {
    throttle,
    addGrabListener,
};
