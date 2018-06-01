const dataSource = require('../data/sales.json');
//const scrollmonitor = require('scrollmonitor');
//import hcApp from '../dev-js/highchart-app.js';
import { sharedLineMethods } from '../dev-js/shared-line-methods.js';

function customUpdate(isReplay){ // update function for this chart only
    console.log(this.Highchart.renderTo);

  /*  var elementWatcher = scrollmonitor.create(this.Highchart.renderTo);
    elementWatcher.fullyEnterViewport(() => {
   //     animate.call(this);
        elementWatcher.destroy();
    });*/

    var replay = document.createElement('button');
    replay.className = 'overlay-replay magazine-button--small';
    replay.setAttribute('title','Click or tap replay the animation');
    replay.innerText = 'replay';
    this.Highchart.renderTo.insertAdjacentHTML('afterbegin',replay.outerHTML);
    var btn = this.Highchart.renderTo.querySelector('.overlay-replay');
    btn.style.opacity = 0;
    btn.onclick = () => {
        btn.parentNode.removeChild(btn);
        animate.call(this);
    };



    this.Highchart.setClassName('predicted-sales');
    
 
    if ( !isReplay ){
        sharedLineMethods.createMask.call(this, animate);
    } 

    function animate(){
        this.Highchart.annotations.forEach(note => {
            note.destroy();
        });
        this.Highchart.annotations = [];
        this.Highchart.yAxis[0].setExtremes(this.yAxis.startMin,this.yAxis.startMax);
        this.Highchart.xAxis[0].setExtremes(this.xAxis.startMin,this.xAxis.startMax);

        
        this.series = sharedLineMethods.createNullSeries(this.dataSource);
        this.Highchart.update({series: this.series});
        //this.Highchart = new Highcharts.chart(container, this);
      //  this.updateFunction(...this.initialUpdateParams, true);

        var togglableElements = this.Highchart.renderTo.querySelectorAll('.overlay-replay');
        togglableElements.forEach(el => {
            el.style.opacity = 0;
        });
    
        const annotateYear = sharedLineMethods.annotateYear;
        const backfillSeries = sharedLineMethods.backfillSeries;
        const animateSeries = sharedLineMethods.animateSeries;
        const togglePoint = sharedLineMethods.togglePoint;


       setTimeout(() => {
            var timeoutDelay = 300; // set back to 3000
            this.Highchart.series[0].addPoint(this.dataSource[0]['2000']);
            this.Highchart.series[0].addPoint(this.dataSource[0]['2001']);
            this.Highchart.series[0].points[1].select(true, true);
            annotateYear.call(this, 0, 2001, `In 2001, electricity sales totaled ${ Highcharts.numberFormat(this.dataSource[0]['2001'], 0) } billion kWh.`, 'left');

            setTimeout(() =>{

                var step1 = animateSeries.call(this, 0, 2002, 2006).then(() => {
                    this.Highchart.annotations[0].setVisible(false);
                    annotateYear.call(this, 0, 2006, `By 2006, sales reached ${ Highcharts.numberFormat(this.dataSource[0]['2006'], 0) } billion kWh.`, 'left');
                    setTimeout(() => {
                        backfillSeries.call(this, 1, 2006, 2009);//.then(() => {
                        this.Highchart.annotations[1].setVisible(false);
                        annotateYear.call(this, 1, 2009, `In 2009, an Annual Energy Outlook was released with projections pinned to 2006 numbers.`, 'right');
                        togglePoint.call(this, 1);
                        setTimeout(() => {
                            togglePoint.call(this, 1);
                            this.Highchart.axes[1].setExtremes(3500,4300);
                            this.Highchart.annotations[2].setVisible(false);

                            
                                backfillSeries.call(this, 1, 2010, 2017);
                                togglePoint.call(this, 1);
                                annotateYear.call(this, 1, 2017, `It predicted sales increasing to ${ Highcharts.numberFormat(this.dataSource[1]['2017'], 0) } billion kWh in 2017.`, 'right');
                                setTimeout(() => {
                                    togglePoint.call(this, 0);
                                    this.Highchart.annotations[3].setVisible(false);
                                    annotateYear.call(this, 0, 2008, `But by 2008, sales had already begun to fall, partly in response to the Great Recession.`, 'left');
                                    animateSeries.call(this, 0, 2007, 2008).then(() => {
                                        setTimeout(() => {
                                            this.Highchart.annotations[4].setVisible(false);
                                            backfillSeries.call(this, 2, 2008, 2011);
                                            annotateYear.call(this, 2, 2011, `In 2011, another Annual Energy Outlook was released with projections pinned to 2008 numbers.`, 'right');
                                            togglePoint.call(this, 2);
                                            setTimeout(() => {
                                                togglePoint.call(this, 2);
                                                this.Highchart.annotations[5].setVisible(false);
                                                backfillSeries.call(this, 2, 2012, 2017);
                                                togglePoint.call(this, 2);
                                                annotateYear.call(this, 2, 2017, `It predicted sales increasing to ${ Highcharts.numberFormat(this.dataSource[2]['2017'], 0) } billion kWh in 2017.`, 'right');
                                                //togglePoint.call(this, 2);
                                                setTimeout(() => {
                                                   this.Highchart.annotations[6].setVisible(false); 
                                                   togglePoint.call(this,0);
                                                   animateSeries.call(this, 0, 2009, 2014).then(() => {
                                                       annotateYear.call(this, 0, 2014, `But by 2014, slow  sales had kept the actual numbers below the estimates.`, 'right');
                                                       setTimeout(() => {
                                                            this.Highchart.annotations[7].setVisible(false); 
                                                            backfillSeries.call(this, 3, 2014, 2016);
                                                            togglePoint.call(this, 3);
                                                            annotateYear.call(this, 3, 2016, `In 2016, another Annual Energy Outlook was released with projections pinned to 2014 numbers.`, 'right');
                                                            setTimeout(() => {
                                                                togglePoint.call(this,3);
                                                                this.Highchart.annotations[8].setVisible(false); 
                                                                animateSeries.call(this, 3, 2017, 2017).then(() => {
                                                                    annotateYear.call(this, 3, 2017, `It predicted sales increasing slightly to  ${ Highcharts.numberFormat(this.dataSource[3]['2017'], 0) } billion kWh in 2017.`, 'right');
                                                                    setTimeout(() => {
                                                                        togglePoint.call(this,0);
                                                                        this.Highchart.annotations[9].setVisible(false); 
                                                                        animateSeries.call(this,0, 2015, 2017).then(() => {
                                                                            annotateYear.call(this, 0, 2017, `Sales, however, have gone down  since 2014.`, 'right');
                                                                            setTimeout(() => {
                                                                                this.Highchart.annotations[10].setVisible(false); 
                                                                                this.Highchart.axes[0].setExtremes(2001,2035);
                                                                                this.Highchart.axes[1].setExtremes(3500,5000);
                                                                                setTimeout(() => {
                                                                                    togglePoint.call(this,1);
                                                                                    togglePoint.call(this,2);
                                                                                    togglePoint.call(this,3);
                                                                                    backfillSeries.call(this, 1, 2018, 2030);
                                                                                    backfillSeries.call(this, 2, 2018, 2035);
                                                                                    backfillSeries.call(this, 3, 2018, 2035);
                                                                                    togglePoint.call(this,1);
                                                                                    togglePoint.call(this,2);
                                                                                    togglePoint.call(this,3);
                                                                                    annotateYear.call(this, 2, 2035, 'The Annual Energy Outlook estimates have flattened over the years in response to lower-than-expected sales. That has consequences for estimates of future baseline emissions and the effects of carbon taxes.', 'left');
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
            },timeoutDelay);
           
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
        max: 2035,
        startMax: 2018,
        startMin: 2001
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
        sharedLineMethods.updateChart.call(this);
        customUpdate.call(this);
    },
    initialUpdateParams: [],
    note: '1 terawatt hour = 1 billion kilowatt hours. Sources: U.S. Energy Information Administration (EIA), Annual Energy Outlook (2009, 2011, and 2016); EIA Monthly Energy Review, April 2018.',
};