const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
svg.setAttribute('viewBox', '0 0 100 100');
// svg.setAttribute('width', '500');
// svg.setAttribute('height', '500');

// svg.style.width = '100%';
// svg.style.height = '100%';

const cir1 = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
cir1.setAttribute('cx', '80');
cir1.setAttribute('cy', '80');
cir1.setAttribute('r', '30');
cir1.setAttribute('fill', 'red');

svg.appendChild(cir1);

const containerEl = document.getElementsByClassName('svgWrapper')[0];

containerEl.appendChild(svg);
