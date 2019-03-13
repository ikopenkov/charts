import { PointUtils } from 'src/utils/PointUtils/PointUtils';

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
console.log({
    xPercents,
    yPercents,
});

const points = xPercents.map((x, index) => {
    const y = yPercents[index];

    return [x, y] as PointUtils.Point;
});
console.log(points);

const pathDAttr = `M ${points.map(xy => xy.join(' ')).join(' L ')}`;
console.log(pathDAttr);

const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
svg.setAttribute('viewBox', '0 0 100 100');
// svg.setAttribute('width', '500');
// svg.setAttribute('height', '500');

// svg.style.width = '100%';
// svg.style.height = '100%';
const path1 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
path1.setAttribute('stroke', 'red');
path1.setAttribute('stroke-width', '0.5');
path1.setAttribute('fill', 'none');
path1.setAttribute('d', pathDAttr);
// <path id="lineAB" d="M 100 350 l 150 -300 l 150 -200" stroke="red" stroke-width="3" fill="none" />

// const cir1 = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
// cir1.setAttribute('cx', '80');
// cir1.setAttribute('cy', '80');
// cir1.setAttribute('r', '30');
// cir1.setAttribute('fill', 'red');

svg.appendChild(path1);

const containerEl = document.getElementsByClassName('svgWrapper')[0];

containerEl.appendChild(svg);
