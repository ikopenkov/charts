const calcAspectRatio = (containerEl: Element) => {
    const containerWidth = containerEl.clientWidth;
    const containerHeight = containerEl.clientHeight;

    return containerWidth / containerHeight;
};

const calcPathData = (
    xPointsInPercents: number[],
    yPointsInPercents: number[],
    aspectRatio: number,
) => {
    const xPointsProportionated = xPointsInPercents.map(x => x * aspectRatio);
    const linesCoordinates = xPointsProportionated.map((x, index) => {
        const y = yPointsInPercents[index];

        return `${x} ${y}`;
    });
    return `M ${linesCoordinates.join(' L ')}`;
};

const render = (
    xPointsInPercents: number[],
    yPointsInPercents: number[],
    svg: SVGSVGElement,
    self?: SVGPathElement,
) => {
    const aspectRatio = calcAspectRatio(svg);
    const pathData = calcPathData(
        xPointsInPercents,
        yPointsInPercents,
        aspectRatio,
    );

    svg.setAttribute('viewBox', `0 0 ${100 * aspectRatio} 100`);
    let path = self;
    if (!path) {
        path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        svg.appendChild(path);
    }

    path.setAttribute('stroke', 'red');
    path.setAttribute('stroke-width', '0.5');
    path.setAttribute('fill', 'none');
    path.setAttribute('d', pathData);

    return path;
};

interface PolyLineRenderParams {
    xPointsInPercents: number[];
    yPointsInPercents: number[];
    svg: SVGSVGElement;
}

export const PolyLine = {
    render,
};
