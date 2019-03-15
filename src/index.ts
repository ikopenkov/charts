import { ChartDataMock } from 'src/ChartDataMock';
import { Chart } from 'src/components/Chart/Chart';

const containerEl = document.getElementsByClassName('svgWrapper')[0];
Chart.render(containerEl, ChartDataMock[0]);
