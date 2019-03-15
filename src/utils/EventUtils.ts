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

export const EventUtils = {
    throttle,
};
