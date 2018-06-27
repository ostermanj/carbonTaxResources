const dataSource = require('../data/sales.json');
import { sharedLineMethods } from '../dev-js/shared-line-methods.js';

function customUpdate(){ // update function for this chart only
    
    this.Highchart.setClassName('predicted-sales');

    this.Highchart.series[1].update({
        zoneAxis:'x',
        zones: [{
            className: 'anchor',
            value: 2009
        },{
            className:'projection',
            value: undefined
        }]
    });
    this.Highchart.series[2].update({
        zoneAxis:'x',
        zones: [{
            className: 'anchor',
            value: 2011
        },{
            className:'projection',
            value: undefined
        }]
    });
    this.Highchart.series[3].update({
        zoneAxis:'x',
        zones: [{
            className: 'anchor',
            value: 2016
        },{
            className:'projection',
            value: undefined
        }]
    });
    this.initialPointsToShow = [ // array of series-points pairs
        [0,0],
        [0,17],
        [1,30],
        [2, 'last'],
        [3, 'last']
    ];
    
    const annotate = sharedLineMethods.annotate;
    const annotateYear = sharedLineMethods.annotateYear;
    const fillSeries = sharedLineMethods.fillSeries;
    const togglePoint = sharedLineMethods.togglePoint; 
    
    this.animationSteps = [
        function(resolve){ // step 0
            annotate.call(this, 0, `From 2000 to 2007, electricity sales rose to ${ Highcharts.numberFormat(this.dataSource[0]['2007'], 0) } TWh before falling to ${ Highcharts.numberFormat(this.dataSource[0]['2009'], 0) } in 2009, partly in response to the Great Recession.`);
             fillSeries.call(this, 0, 2000, 2009).then(() => {
                this.Highchart.series[0].points[0].select(true, true);
                togglePoint.call(this, 0, 'last');
                resolve(true);
            });
        },
        function(resolve){ // step 2,3
            this.previousChange.extremes[this.currentStep] = [[this.Highchart.xAxis[0].min, this.Highchart.xAxis[0].max],[this.Highchart.yAxis[0].min, this.Highchart.yAxis[0].max]];
            this.Highchart.yAxis[0].setExtremes(3500,4250);
            setTimeout(() => {
                annotate.call(this, 1, `In 2009, an Annual Energy Outlook was released with projections pinned to 2006 numbers. It predicted sales increasing to ${ Highcharts.numberFormat(this.dataSource[1]['2016'], 0) } TWh in 2016.`);
                 fillSeries.call(this, 1, 2006, 2009).then(() => {
                    togglePoint.call(this, 1);
                    setTimeout(() => {
                        togglePoint.call(this, 1);
                        fillSeries.call(this, 1, 2010, 2016).then(() => {
                            togglePoint.call(this, 1);
                            resolve(true);
                        });
                    }, 1000);
                }, 1000);
            })
        },
        function(resolve){ // step 5
            annotate.call(this, 2, `In 2011, another Annual Energy Outlook was released with projections pinned to 2008 numbers. It predicted sales increasing to ${ Highcharts.numberFormat(this.dataSource[2]['2016'], 0) } TWh in 2016.`);
            fillSeries.call(this, 2, 2008, 2011).then(() => {
                togglePoint.call(this, 2);
                setTimeout(() => {
                    togglePoint.call(this, 2);
                    fillSeries.call(this, 2, 2012, 2016).then(() => {
                        togglePoint.call(this, 2);
                        resolve(true);
                    });
                }, 1000);
            });
        },
        function(resolve){ // step 6
            togglePoint.call(this,0);
            annotate.call(this, 0, `Stagnant sales, however, kept the actual numbers below the estimates.`);
            fillSeries.call(this, 0, 2010, 2016).then(() => {
                togglePoint.call(this,0);
                resolve(true);
            });
        },
        function(resolve){ // step 8
            togglePoint.call(this,1);
            togglePoint.call(this,2);
            fillSeries.call(this, 1, 2017, 2030).then(() => {
                togglePoint.call(this,1);
                fillSeries.call(this, 2, 2017, 2035).then(() => {
                    togglePoint.call(this,2);
                    console.log(this.previousChange);
                    this.previousChange.extremes[this.currentStep] = [[this.Highchart.xAxis[0].min, this.Highchart.xAxis[0].max],[this.Highchart.yAxis[0].min, this.Highchart.yAxis[0].max]];
                    this.Highchart.xAxis[0].setExtremes(2000,2035);
                    this.Highchart.yAxis[0].setExtremes(3500,5000);
                    setTimeout(() => {
                        annotate.call(this, 3, `In 2016, another Annual Energy Outlook was released, with projections pinned to 2014 numbers. It predicted sales increasing through 2035, although at slower rate than the previous estimates.`);
                        fillSeries.call(this, 3, 2014, 2016).then(() => {
                            togglePoint.call(this, 3);
                            setTimeout(() => {
                                togglePoint.call(this, 3);
                                fillSeries.call(this, 3, 2017, 2035)
                                togglePoint.call(this, 3);
                                resolve(true);
                            }, 1000);
                        });
                    }, 1000);
                });
            });
        },
        function(resolve){ // step 6
            togglePoint.call(this,0);
            annotate.call(this, 0, `Sales so far, however, have remained low. Low sales have big consequences for estimates of future baseline emissions and the effects of carbon taxes.`);
            fillSeries.call(this, 0, 2017, 2017).then(() => {
                togglePoint.call(this,0);
                resolve(true);
            });
        },
        function(resolve){ // step 12
            this.Highchart.annotations[this.Highchart.annotations.length - 1].setVisible(false);
           
            this.Highchart.update({plotOptions: {series: {
                enableMouseTracking: true,
                allowPointSelect: false
            }}});
            resolve(true);
        }
    ];
}

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
            enableMouseTracking: false,
            connectNulls: true,
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
        text: null
    },           
    title: {
        text: 'U.S. electricity demand, actual and estimated',
    },
    tooltip: {
        valueDecimals: 0,
        valueSuffix: ' TWh'
    },
    xAxis: {
        min: 2000,
        max: 2035,
        startMax: 2017,
        startMin: 2000,
        plotBands: [{
            from: 2007.9,
            to: 2009.5,
            label: {
                text: 'Great Recession',
                align: 'right',
                textAlign: 'left'
            }
        }]
    },
    yAxis: {
        max: 5000,
        min: 3500,
        startMax: 4000,
        startMin: 3500,
        title: {
            text: 'terawatt hours',
            align:'high',
            rotation: 0,
            margin:0,
            y: -25,
            reserveSpace: false,
          //  offset: -110,
            x: -10
        }
    },
    // extends Highcharts options
    dataSource: dataSource,
    seriesCreator: sharedLineMethods.createSeries,
    updateFunction: function(){
        customUpdate.call(this);
        sharedLineMethods.updateChart.call(this);
    },
    initialUpdateParams: [],
    note: '1 terawatt hour = 1 billion kilowatt hours. Sources: U.S. Energy Information Administration (EIA), Annual Energy Outlook (2009, 2011, and 2016); EIA Monthly Energy Review, April 2018.',
};