const dataSource = require('../data/sales.json');
import { dataController } from '../dev-js/highchart-app.js';
import { sharedLineMethods } from '../dev-js/shared-line-methods.js';
//console.log(sharedMethods);
export default { 
    chart: { 
        type: 'line',   
        height: 500
    },
    plotOptions: {
        series: {
            marker: {
                enabled: false
            },
            pointStart: 2000
        }
    },
    subtitle: {
        text: 'Subtitle.'
    },           
    title: {
        text: 'Title title title'
    },
    tooltip: {
        valueDecimals: 2,
        valueSuffix: ' billion kWh'
    },
    xAxis: {
        min: 2000,
        max: 2035
    },
    yAxis: {
        max: 5000,
        min: 3500,
        title: {
            text: 'billion kilowatt hours',
            align:'high',
            rotation: 0,
            margin:0,
            y: -25,
            offset: -110,
            x: -10
        }
    },
    // extends Highcharts options
    dataSource: dataSource,
    seriesCreator: sharedLineMethods.createSeries,
    updateFunction: sharedLineMethods.updateChart,
    initialUpdateParams: [],
    note: 'this is the note',
};