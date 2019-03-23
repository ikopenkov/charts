import { ChartDataMock } from 'src/ChartDataMock';
import { Chart } from 'src/components/Chart/Chart';
import { DomUtils } from 'src/utils/DomUtils';
import { StyleUtils } from 'src/utils/StyleUtils';
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

// @ts-ignore
ChartDataMock = [ChartDataMock[4]];

const allChartsContainer = document.getElementsByClassName(
    'chartWrapper',
)[0] as HTMLDivElement;

const charts = ChartDataMock.map(data => {
    const container = document.createElement('div');
    DomUtils.setElementStyle(container, {
        width: '100%',
        height: 'calc(100vh - 64px)',
        boxSizing: 'border-box',
        padding: '0 15px',
    });

    allChartsContainer.appendChild(container);

    return Chart.render({
        container,
        data,
        mode: 'day',
    });
});

const footer = document.getElementsByClassName('footer')[0] as HTMLElement;
allChartsContainer.appendChild(footer);

const dayNightSwitch = document.getElementsByClassName(
    'dayNightSwitch',
)[0] as HTMLElement;

const textsByMode = {
    day: 'Switch to Night Mode',
    night: 'Switch to Day Mode',
};
let currentMode: keyof typeof textsByMode = 'day';
DomUtils.setElementStyle(dayNightSwitch, {
    fontSize: '16px',
    color: '#1F8DE0',
});

dayNightSwitch.addEventListener('click', () => {
    currentMode = currentMode === 'day' ? 'night' : 'day';
    dayNightSwitch.innerText = textsByMode[currentMode];
    charts.forEach(chart => chart.reRender({ mode: currentMode }));
    const colors = StyleUtils.getColors({ mode: currentMode });
    DomUtils.setElementStyle(footer, {
        backgroundColor: colors.background,
    });
    DomUtils.setElementStyle(document.body, {
        backgroundColor: colors.background,
    });
});
