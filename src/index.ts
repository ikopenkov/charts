import { ChartDataMock } from 'src/ChartDataMock';
import { Chart } from 'src/components/Chart/Chart';
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

const containerEl = document.getElementsByClassName(
    'svgWrapper',
)[0] as HTMLDivElement;
Chart.render(containerEl, ChartDataMock[0]);
// Chart.render(containerEl, mock);
