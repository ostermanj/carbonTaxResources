const dataSource = require('../data/gas-prices.json');
import { sharedLineMethods } from '../dev-js/shared-line-methods.js';

function customUpdate(isReplay){ // update function for this chart only
    console.log(this.Highchart.renderTo);

    var replay = document.createElement('button');
    replay.classList.add('overlay-replay');
    replay.innerText = 'replay';
    this.Highchart.renderTo.insertAdjacentHTML('afterbegin',replay.outerHTML);
    var btn = this.Highchart.renderTo.querySelector('.overlay-replay');
    btn.onclick = () => {
        btn.parentNode.removeChild(btn);
        replayChart.call(this);
    };



    this.Highchart.setClassName('predicted-gas-prices');
    var togglableElements = this.Highchart.renderTo.querySelectorAll('.overlay-replay, .highcharts-title, .highcharts-subtitle, .highcharts-yaxis-grid, .highcharts-axis, .highcharts-axis-labels, .highcharts-legend, .highcharts-credits, .highcharts-note');
    togglableElements.forEach(el => {
        el.style.opacity = 0;
    });
 
    if ( !isReplay ){
        sharedLineMethods.createMask.call(this, animate);
    } else {
        animate.call(this);
    }

    function replayChart(){
        var chart = this.Highchart;
        var container = chart.renderTo;
        this.Highchart.destroy();
        this.series = this.seriesCreator(this.dataSource);
        this.Highchart = new Highcharts.chart(container, this);
        this.updateFunction(...this.initialUpdateParams, true);
    }

    function animate(){
    
        const annotateYear = sharedLineMethods.annotateYear;
        const backfillSeries = sharedLineMethods.backfillSeries;
        const animateSeries = sharedLineMethods.animateSeries;
        const toggleLastPoint = sharedLineMethods.toggleLastPoint;

        if ( !isReplay ) {
            let overlay = this.Highchart.renderTo.querySelector('.overlay-play');
            overlay.onclick = '';
            overlay.classList.add('clicked');
            setTimeout(() => {
                overlay.style.display = 'none';
            },250);
        }

       this.Highchart.series[0].addPoint(this.dataSource[0]['2000']);
       this.Highchart.series[0].addPoint(this.dataSource[0]['2001']);
       this.Highchart.series[0].points[1].select(true, true);
       annotateYear.call(this, 0, 2001, `In 2001, natural gas prices averaged $${ Highcharts.numberFormat(this.dataSource[0]['2001'], 2) } per million Btu.`, 'left');
       setTimeout(() => {

           
            var timeoutDelay = 3000; // set back to 3000
            var step1 = animateSeries.call(this, 0, 2002, 2006).then(() => {
                this.Highchart.annotations[0].setVisible(false);
                annotateYear.call(this, 0, 2006, `They peaked in 2005 at $${ Highcharts.numberFormat(this.dataSource[0]['2005'], 2) } per million Btu and then fell back to $${ Highcharts.numberFormat(this.dataSource[0]['2006'], 2) } in 2006.`, 'left');
                setTimeout(() => {
                    backfillSeries.call(this, 1, 2006, 2009);//.then(() => {
                    this.Highchart.annotations[1].setVisible(false);
                    annotateYear.call(this, 1, 2009, `In 2009, an Annual Energy Outlook was released with projections pinned to 2006 numbers.`, 'right');
                    toggleLastPoint.call(this, 1);
                    setTimeout(() => {
                        toggleLastPoint.call(this, 1);
                        this.Highchart.annotations[2].setVisible(false);

                        
                            backfillSeries.call(this, 1, 2010, 2017);
                            toggleLastPoint.call(this, 1);
                            annotateYear.call(this, 1, 2017, `It predicted prices increasing slightly to $${ Highcharts.numberFormat(this.dataSource[1]['2017'], 2) } in 2017.`, 'right');
                            setTimeout(() => {
                                toggleLastPoint.call(this, 0);
                                this.Highchart.annotations[3].setVisible(false);
                                annotateYear.call(this, 0, 2008, `In 2008 prices peaked again.`, 'right');
                                animateSeries.call(this, 0, 2007, 2008).then(() => {
                                    setTimeout(() => {
                                        this.Highchart.annotations[4].setVisible(false);
                                        backfillSeries.call(this, 2, 2008, 2011);
                                        annotateYear.call(this, 2, 2011, `In 2011, another Annual Energy Outlook was released with projections pinned to 2008 numbers.`, 'right');
                                        toggleLastPoint.call(this, 2);
                                        setTimeout(() => {
                                            toggleLastPoint.call(this, 2);
                                            this.Highchart.annotations[5].setVisible(false);
                                            backfillSeries.call(this, 2, 2012, 2017);
                                            toggleLastPoint.call(this, 2);
                                            annotateYear.call(this, 2, 2017, `It predicted gas prices falling slightly by 2017, to $${ Highcharts.numberFormat(this.dataSource[2]['2017'], 2) }.`, 'right');
                                            //toggleLastPoint.call(this, 2);
                                            setTimeout(() => {
                                               this.Highchart.annotations[6].setVisible(false); 
                                               toggleLastPoint.call(this,0);
                                               animateSeries.call(this, 0, 2009, 2014).then(() => {
                                                   annotateYear.call(this, 0, 2014, `In 2014 gas prices were just under the 2011 estimate but well below the 2009 estimate.`, 'right');
                                                   setTimeout(() => {
                                                        this.Highchart.annotations[7].setVisible(false); 
                                                        backfillSeries.call(this, 3, 2014, 2016);
                                                        toggleLastPoint.call(this, 3);
                                                        annotateYear.call(this, 3, 2016, `In 2016, an additional Annual Energy Outlook was released with projections pinned to 2014 numbers.`, 'right');
                                                        setTimeout(() => {
                                                            toggleLastPoint.call(this,3);
                                                            this.Highchart.annotations[8].setVisible(false); 
                                                            animateSeries.call(this, 3, 2017, 2017).then(() => {
                                                                annotateYear.call(this, 3, 2017, `It predicted prices increasing a little to $${ Highcharts.numberFormat(this.dataSource[3]['2017'], 2) } in 2017.`, 'right');
                                                                setTimeout(() => {
                                                                    toggleLastPoint.call(this,0);
                                                                    this.Highchart.annotations[9].setVisible(false); 
                                                                    animateSeries.call(this,0, 2015, 2017).then(() => {
                                                                        annotateYear.call(this, 0, 2017, `Prices have remained low since then.`, 'right');
                                                                        setTimeout(() => {
                                                                            this.Highchart.annotations[10].setVisible(false); 
                                                                            this.Highchart.axes[0].setExtremes(2001,2035);
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
                                                                                annotateYear.call(this, 2, 2035, 'The Annual Energy Outlook estimates have decreased considerably over time and predict that gas prices will remain low. Lower-than-expected gas prices have big consequences for estimates of future baseline emissions and the effects of carbon taxes.', 'right');
                                                                                setTimeout(() => {
                                                                                    this.Highchart.annotations[11].setVisible(false); 
                                                                                    togglableElements.forEach(el => {
                                                                                        el.style.opacity = 1;
                                                                                    });
                                                                                    this.Highchart.update({plotOptions: {series: {enableMouseTracking: true}}});
                                                                                },timeoutDelay * 2);
                                                                            }, timeoutDelay / 3 );
                                                                        }, timeoutDelay); 
                                                                    });
                                                                }, timeoutDelay);
                                                            });
                                                        }, timeoutDelay);
                                                   }, timeoutDelay);
                                               });
                                            }, timeoutDelay * 1.3 );
                                        }, timeoutDelay);
                                    }, timeoutDelay);
                                });
                            }, timeoutDelay);
                    }, timeoutDelay);
                }, timeoutDelay);
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
        text: 'Estimates have decreased over the years and now predict that low prices will continue.'
    },           
    title: {
        text: 'U.S. natural gas prices to the electric power sector, actual and estimated',
    },
    tooltip: {
        valueDecimals: 2,
        valueSuffix: ' per million Btu',
        valuePrefix: '$'
    },
    xAxis: {
        min: 2001,
        max: 2018
    },
    yAxis: {
        max: 10,
        min: 0,
        title: {
            text: '$(2011) per million Btu',
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
    note: 'Sources: U.S. Energy Information Administration (EIA), Annual Energy Outlook (2009, 2011, and 2016); EIA Monthly Energy Review, April 2018.',
};