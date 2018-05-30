const dataSource = require('../data/sales.json');
const scrollmonitor = require('scrollmonitor');
import { dataController } from '../dev-js/highchart-app.js';
import { sharedLineMethods } from '../dev-js/shared-line-methods.js';

function customUpdate(){ // update function for this chart only
    console.log(this.Highchart.renderTo);

    var elementWatcher = scrollmonitor.create(this.Highchart.renderTo);
    elementWatcher.fullyEnterViewport(() => {
        animate.call(this);
    });

    this.Highchart.setClassName('predicted-sales');
    var togglableElements = this.Highchart.container.querySelectorAll('.highcharts-title, .highcharts-subtitle, .highcharts-yaxis-grid, .highcharts-axis, .highcharts-axis-labels, .highcharts-legend, .highcharts-credits, .highcharts-note');
    togglableElements.forEach(el => {
        el.style.opacity = 0;
    });
 
    sharedLineMethods.createMask.call(this, animate);

    function animate(){
    
        const annotateYear = sharedLineMethods.annotateYear;
        const backfillSeries = sharedLineMethods.backfillSeries;
        const animateSeries = sharedLineMethods.animateSeries;
        const toggleLastPoint = sharedLineMethods.toggleLastPoint;

        var overlay = this.Highchart.renderTo.querySelector('.overlay-play');
            overlay.onclick = null;
            overlay.classList.add('clicked');
            setTimeout(() => {
                overlay.style.display = 'none';
            },250);

       this.Highchart.setClassName('predicted-sales');
       this.Highchart.series[0].addPoint(this.dataSource[0]['2000']);
       this.Highchart.series[0].addPoint(this.dataSource[0]['2001']);
       this.Highchart.series[0].points[1].select(true, true);
       annotateYear.call(this, 0, 2001, `In 2001, electricity sales totaled ${ Highcharts.numberFormat(this.dataSource[0]['2001'], 0) } billion kWh.`);
        setTimeout(() => {

            /* 
             * actual prices 2001 – 2006
             *
             */
            
            var step1 = animateSeries.call(this, 0, 2002, 2006).then(() => {
                this.Highchart.annotations[0].setVisible(false);
                annotateYear.call(this, 0, 2006, `By 2006, sales reached ${ Highcharts.numberFormat(this.dataSource[0]['2006'], 0) } billion kWh.`);
                setTimeout(() => {
                    backfillSeries.call(this, 1, 2006, 2009);//.then(() => {
                    this.Highchart.annotations[1].setVisible(false);
                    annotateYear.call(this, 1, 2009, `In 2009, an Annual Energy Outlook<br />was released with projections<br />pinned to 2006 numbers.`);
                    toggleLastPoint.call(this, 1);
                    setTimeout(() => {
                        toggleLastPoint.call(this, 1);
                        this.Highchart.axes[1].setExtremes(3500,4300);
                        this.Highchart.annotations[2].setVisible(false);

                        /* 
                         * 2009 estimate 2009 – 2017
                         *
                         */
                            backfillSeries.call(this, 1, 2010, 2017);
                            toggleLastPoint.call(this, 1);
                            annotateYear.call(this, 1, 2017, `It predicted sales increasing to ${ Highcharts.numberFormat(this.dataSource[1]['2017'], 0) } billion kWh in 2017.`, 'top-right');
                            setTimeout(() => {
                                toggleLastPoint.call(this, 0);
                                this.Highchart.annotations[3].setVisible(false);
                                annotateYear.call(this, 0, 2008, `But by 2008, sales had already begun to fall,<br />partly in response to the Great Recession.`, [2008,3800]);
                                animateSeries.call(this, 0, 2007, 2008).then(() => {
                                    setTimeout(() => {
                                        this.Highchart.annotations[4].setVisible(false);
                                        backfillSeries.call(this, 2, 2008, 2011);
                                        annotateYear.call(this, 2, 2011, `In 2011, another Annual<br />Energy Outlook was<br />released with projections<br />pinned to 2008 numbers.`);
                                        toggleLastPoint.call(this, 2);
                                        setTimeout(() => {
                                            toggleLastPoint.call(this, 2);
                                            this.Highchart.annotations[5].setVisible(false);
                                            backfillSeries.call(this, 2, 2012, 2017);
                                            toggleLastPoint.call(this, 2);
                                            annotateYear.call(this, 2, 2017, `It predicted sales increasing to ${ Highcharts.numberFormat(this.dataSource[2]['2017'], 0) } billion kWh in 2017.`, 'top-right');
                                            //toggleLastPoint.call(this, 2);
                                            setTimeout(() => {
                                               this.Highchart.annotations[6].setVisible(false); 
                                               toggleLastPoint.call(this,0);
                                               animateSeries.call(this, 0, 2009, 2014).then(() => {
                                                   annotateYear.call(this, 0, 2014, `But by 2014, slow<br /> sales had kept the actual<br />numbers below the<br />estimates.`, [2012,3750]);
                                                   setTimeout(() => {
                                                        this.Highchart.annotations[7].setVisible(false); 
                                                        backfillSeries.call(this, 3, 2014, 2016);
                                                        toggleLastPoint.call(this, 3);
                                                        annotateYear.call(this, 3, 2016, `In 2016, yet another Annual<br />Energy Outlook was<br />released with projections<br />pinned to 2014 numbers.`, [2016,3800]);
                                                        setTimeout(() => {
                                                            toggleLastPoint.call(this,3);
                                                            this.Highchart.annotations[8].setVisible(false); 
                                                            animateSeries.call(this, 3, 2017, 2017).then(() => {
                                                                annotateYear.call(this, 3, 2017, `This one predicted sales<br />increasing slightly to<br /> ${ Highcharts.numberFormat(this.dataSource[3]['2017'], 0) } billion kWh in 2017.`, [2017,3750]);
                                                                setTimeout(() => {
                                                                    toggleLastPoint.call(this,0);
                                                                    this.Highchart.annotations[9].setVisible(false); 
                                                                    animateSeries.call(this,0, 2015, 2017).then(() => {
                                                                        annotateYear.call(this, 0, 2017, `Sales, however, have gone down<br /> since 2014.`, [2017, 3750]);
                                                                        setTimeout(() => {
                                                                            this.Highchart.annotations[10].setVisible(false); 
                                                                            this.Highchart.axes[0].setExtremes(2001,2035);
                                                                            this.Highchart.axes[1].setExtremes(3500,5000);
                                                                            setTimeout(() => {
                                                                                toggleLastPoint.call(this,1);
                                                                                toggleLastPoint.call(this,2);
                                                                                toggleLastPoint.call(this,3);
                                                                                backfillSeries.call(this, 1, 2018, 2030);
                                                                                backfillSeries.call(this, 2, 2018, 2035);
                                                                                backfillSeries.call(this, 3, 2018, 2035);
                                                                                toggleLastPoint.call(this,1);
                                                                                toggleLastPoint.call(this,2);
                                                                                toggleLastPoint.call(this,3);
                                                                                annotateYear.call(this, 0, 2017, 'The Annual Energy Outlook estimates have<br />flattened over the years in response to<br />lower-than-expected sales. That has<br />consequences for estimates of future<br />baseline emissions and the effects of<br />carbon taxes.', 'top-left');
                                                                                setTimeout(() => {
                                                                                    this.Highchart.annotations[11].setVisible(false); 
                                                                                    togglableElements.forEach(el => {
                                                                                        el.style.opacity = 1;
                                                                                    });
                                                                                    this.Highchart.update({plotOptions: {series: {enableMouseTracking: true}}});
                                                                                },6000);
                                                                            }, 1000);
                                                                        }, 3000); 
                                                                    });
                                                                }, 3000);
                                                            });
                                                        }, 3000);
                                                   }, 3000);
                                               });
                                            }, 4000);
                                        }, 3000);
                                    }, 3000);
                                });
                            }, 3000);
                    }, 3000);
                }, 3000);
                //   animateSeries.call(this, 2, 2008, 2035).then(() => {
                      // animateSeries.call(this, 3, 2014, 2035) 
                   // });
               // });
            });
        }, 2000);
    }
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
            connectNulls: true,
            enableMouseTracking: false, // will be set to true after animation is finished
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
        text: 'Estimates have flattened over the years as actual demand has fallen short of expectations.'
    },           
    title: {
        text: 'U.S. electricity demand, actual and estimated',
    },
    tooltip: {
        valueDecimals: 2,
        valueSuffix: ' TWh'
    },
    xAxis: {
        min: 2001,
        max: 2018
    },
    yAxis: {
        max: 4000,
        min: 3500,
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
    updateFunction: customUpdate,
    initialUpdateParams: [],
    note: '1 terawatt hour = 1 billion kilowatt hours. Sources: U.S. Energy Information Administration (EIA), Annual Energy Outlook (2009, 2011, and 2016); EIA Monthly Energy Revoew, April 2018.',
};