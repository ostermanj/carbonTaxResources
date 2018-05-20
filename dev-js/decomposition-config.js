const dataSource = require('../data/decomposition.json');
console.log(dataSource);
export default { 
    chart: { 
        type: 'column',   
        height: 600
    },
    plotOptions: {
        column: {
            stacking: 'normal'
        }
    },  
    subtitle: {
        text: 'LMDI decomposition of emissions reductions from Annual Energy Outlook estimates from 2011 (old) and 2016 (new). ' + 
              'Estimates from 2016 do not have the “high demand and gas prices” scenario. ' + 
              'Estimates from 2011 for the “high gas prices” and “high demand” scenarios are not available for the the $50/ton tax option. ' + 
              'Carbon-tax levels change over time—dollar amounts correspond to 2018 levels. Source: U.S. Energy Information Administration.',
    },           
    title: {
        /* extends Highcharts */
        formatter: function(scenario){
            return `Net emissions and emissions reductions in 2030 by type, with ${ scenario }`;
        }
        /* end */
    },
    tooltip: {
        valueDecimals: 0,
        valueSuffix: ' megatons'
    },
    xAxis: {
        categories: ['Standard Scenario', 'High Gas Prices', 'High Demand', 'High Demand<br />and Gas Prices'], // TO DO: set programatically
        labels: {
            y: 40 
        }
    }, 
    yAxis: {
        reversedStacks: false,
        stackLabels: {
              enabled: true,
              verticalAlign: 'bottom',
              crop: false,
              overflow: 'none',
              y: 20, 
              formatter: function() {
                return this.stack;
              }
        },
        title: {
            text: 'megatons',
            align:'high',
            rotation: 0,
            margin:0,
            y: -25,
            offset: -40,
            x: -10
        },
        max:3000, // TO DO: set programmatically
    }    
}