import { Chart } from 'src/components/Chart/Chart';
import { DomUtils } from 'src/utils/DomUtils';
import { StyleUtils } from 'src/utils/StyleUtils';
import { ChartData } from 'src/utils/ChartDataUtils/ChartData.types';
import chartDataUrl from 'src/assets/chartData.json';

const loadChartData = async () => {
    return (await fetch((chartDataUrl as any) as string).then(data =>
        data.json(),
    )) as ChartData[];
};

loadChartData().then(chartData => {
    const allChartsContainer = document.getElementsByClassName(
        'chartWrapper',
    )[0] as HTMLDivElement;

    const charts = chartData.map(data => {
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
});
