import { PointUtils } from 'src/utils/PointUtils/PointUtils';
import { PolyLine } from './elements/PolyLine/PolyLine';
// import { ChartData } from '../chartData';

const containerEl = document.getElementsByClassName('svgWrapper')[0];

const xPointsRaw = [
    1542412800000,
    1542499200000,
    1542585600000,
    1542672000000,
    1542758400000,
    1542844800000,
    1542931200000,
    1543017600000,
    1543104000000,
];
const yPointsRaw = [37, 20, 32, 39, 32, 35, 19, 65, 36];

const xPercents = PointUtils.transformAbsPointsToPercents(xPointsRaw);
const yPercents = PointUtils.transformAbsPointsToPercents(yPointsRaw);

const createSvg = (container: Element) => {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');

    container.appendChild(svg);

    return svg;
};

const svg = createSvg(containerEl);

const polyLine1 = PolyLine.render(xPercents, yPercents, svg);

const actualResizeHandler = () => {
    PolyLine.render(xPercents, yPercents, svg, polyLine1);
};

let resizeTimeout;
const resizeThrottler = () => {
    // ignore resize events as long as an actualResizeHandler execution is in the queue
    if (!resizeTimeout) {
        resizeTimeout = setTimeout(() => {
            resizeTimeout = null;
            actualResizeHandler();

            // The actualResizeHandler will execute at a rate of 15fps
        }, 66);
    }
};

window.addEventListener('resize', resizeThrottler, false);
