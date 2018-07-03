const dataSource = require('../data/generation.json');
import { dataController } from '../dev-js/highchart-app.js';
import { sharedMethods } from '../dev-js/shared-methods.js';

export default { 
    chart: {  
        height: 500,
        type: 'column',
        className: 'generation'  
    },
    plotOptions: {
        column: {
            stacking: 'normal'
        }   
    },  
    subtitle: {
        text: 'New projections show carbon taxes drastically increase power generation from wind and solar.',
    },           
    title: {
        /* extends Highcharts */
        formatter: function(scenario){
            return `Electricity generation in 2030 by source, with ${ ( scenario === 'none') ? 'no' : scenario } tax`;
        }
        /* end */
    },
    tooltip: {
        valueDecimals: 0,
        valueSuffix: ' TWh'
    },
    xAxis: {
        categories: ['Standard<br />Scenario', 'High Gas Price<br/ >Scenario', 'High Demand<br />Scenario', 'High Demand and<br />Gas Price Scenario'], // TO DO: set programatically
        labels: {
            y: 40,
            useHTML: true
        }
    },
    yAxis: {
        max:5000, // TO DO: set programmatically
        reversedStacks: false,
        endOnTick:false,
        stackLabels: {
            crop: false,
            enabled: true,
            formatter: function() {
                return this.total !== 0 ? this.stack : 'n.a.'; 
            },
            overflow: 'none',
            verticalAlign: 'bottom',
            y: 20
        },
        title: {
            text: 'terawatt hours',
            align:'high',
            reserveSpace: false,
            rotation: 0,
            margin:0,
            y: -25,
           // offset: -60,
            x: -10
        } 
    },
    /* extends highcharts */
    dataSource: dataController.nestData(dataSource, ['category','aeo','scenario']),
    initialCategory: 'baseline',
    initialUpdateParams: ['baseline'],
    seriesCreator: sharedMethods.createBarSeries,
    updateFunction: sharedMethods.updateChart,
    userOptions: sharedMethods.userOptions,
    note: 'RFF Haiku model projections based on Annual Energy Outlook projections from 2011 (old) and 2016 (new). ' + 
          'Projections from 2016 do not have the “high demand and gas prices” scenario. ' + 
          'Projections from 2011 for the “high gas prices” and “high demand” scenarios are not available for the the $50/ton tax option. ' + 
          'Carbon-tax levels change over time—dollar amounts correspond to 2018 levels. Source: RFF Haiku model output.',
};