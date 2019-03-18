import { ChartDataMock } from 'src/ChartDataMock';
import { Chart } from 'src/components/Chart/Chart';
import { DomUtils } from 'src/utils/DomUtils';
// import { ChartData } from 'src/utils/ChartDataUtils/ChartData.types';

// const mock: ChartData = {
//     columns: [['x', 1, 2, 3, 4], ['y0', 37, 20, 25, 100], ['y1', 5, 10, 1, 15]],
//     types: {
//         y0: 'line',
//         y1: 'line',
//         x: 'x',
//     },
//     names: {
//         y0: '#0',
//         y1: '#1',
//     },
//     colors: {
//         y0: '#3DC23F',
//         y1: '#F34C44',
//     },
// };

// let chart: ChartInstance;

// const switcherEl = document.getElementById('chartSwitcher');
// ChartDataMock.forEach((mock, index) => {
//     const link = document.createElement('a');
//     link.innerText = String(index);
//     link.setAttribute('href', `#${index}`);
//     link.addEventListener('click', () => {
//         chart.reRender({
//             data: ChartDataMock[index],
//         });
//         console.log('click');
//     });
//     switcherEl.appendChild(link);
// });

const allChartsContainer = document.getElementsByClassName(
    'chartWrapper',
)[0] as HTMLDivElement;

ChartDataMock.forEach(data => {
    const container = document.createElement('div');
    DomUtils.setElementStyle(container, {
        width: '100vw',
        height: '100vh',
    });

    allChartsContainer.appendChild(container);

    Chart.render({
        container,
        data,
    });
});
