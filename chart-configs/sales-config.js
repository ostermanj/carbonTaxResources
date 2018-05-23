const dataSource = require('../data/sales.json');
import { dataController } from '../dev-js/highchart-app.js';
import { sharedLineMethods } from '../dev-js/shared-line-methods.js';
//console.log(sharedMethods);
export default { 
     /*annotations: [{
        labelOptions: {
            allowOverlap: true,
            //backgroundColor: 'rgba(255,255,255,0.5)',
            verticalAlign: 'bottom',
            y: -15
        },
        labels: [{
            point: {
                xAxis: 0,
                yAxis: 0,
                x: 2000,
                y: 3592
            },
            text: `Hello!`
        }]    
    }],*/
    chart: { 
        animation: {
            duration: 550,
            easing: 'linear'
        },
        type: 'line',   
        height: 500,
    },
    plotOptions: {
        series: {
            allowPointSelect:true,
            connectNulls: true,
            //enableMouseTracking: false, // will be set to true after animation is finished
            marker: {
                radius:0.01,
                states: {
                    select: {
                        radius:4
                    }
                },
                symbol: 'circle'
            },
            pointStart: 2000
        }
    },
    subtitle: {
        text: 'Subtitle.'
    },           
    title: {
        text: 'Title title title',
    },
    tooltip: {
        valueDecimals: 2,
        valueSuffix: ' billion kWh'
    },
    xAxis: {
        min: 2001,
        max: 2018
    },
    yAxis: {
        max: 4000,
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