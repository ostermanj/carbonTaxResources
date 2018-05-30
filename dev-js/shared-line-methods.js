export const sharedLineMethods = { // as an exported module `this` depends on context in which method is called
   /* setData(aeo, taxLevel, isInitial){
        var rtn = aeo.values.map(s => { 
            var match = s.values.find(v => v.tax === taxLevel);
            console.log(match);
            if ( match !== undefined ) {
                return ( isInitial || match.value === null ) ? [s.key, 0] : [s.key, match.value];
            }
        });
        console.log(rtn);
        return rtn;
    },*/
    createSeries(data){ 
        var array = data.map((series, i) => {
            console.log(series);
            var data = [];
            for ( var year = 2000; year < 2036; year++ ){
                if ( series[year.toString()] === null ){
                    data.push(null);
                } else {
                    break;
                }
            }
            return {
                name: series.series,
                data: data,
                className: i === 0 ? 'solid' : 'shortdot'
            }
        });
        
        return array;
    },
    updateChart(){
        this.Highchart.setClassName('predicted-sales');
        var togglableElements = this.Highchart.container.querySelectorAll('.highcharts-title, .highcharts-subtitle, .highcharts-yaxis-grid, .highcharts-axis, .highcharts-axis-labels, .highcharts-legend, .highcharts-credits, .highcharts-note');
        togglableElements.forEach(el => {
            el.style.opacity = 0;
        });

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

        function annotateYear(series, year, text, position){
            var options = {
            
                labelOptions: {
                    allowOverlap: true,
                    verticalAlign: 'top',
                    visible: false,
                    align: 'left',
                    x: 10
                },
                labels: [{
                    point: {
                        xAxis: 0,
                        yAxis: 0,
                        x: year,
                        y: this.dataSource[series][year.toString()]
                    },
                    text: text
                }]    
            };
            if ( position && Array.isArray(position) ){
                options.labels[0].point.x = position[0];
                options.labels[0].point.y = position[1];
            }
            if ( position === 'top-right' ){
                options.labels[0].point.x = this.Highchart.axes[0].getExtremes().max;
                options.labels[0].point.y = this.Highchart.axes[1].getExtremes().max;
            }
            if ( position === 'bottom-right' ){
                options.labels[0].point.x = this.Highchart.axes[0].getExtremes().max;
                options.labels[0].point.y = this.Highchart.axes[1].getExtremes().min;
            }
            if ( position === 'bottom-left' ){
                options.labels[0].point.x = this.Highchart.axes[0].getExtremes().min;
                options.labels[0].point.y = this.Highchart.axes[1].getExtremes().min;
            }
            if ( position === 'top-left' ){
                options.labels[0].align = 'right';
                options.labels[0].point.x = this.Highchart.axes[0].getExtremes().min;
                options.labels[0].point.y = this.Highchart.axes[1].getExtremes().max;
            }
            if ( position === 'bottom-middle' ){
                options.labels[0].point.x = ( this.Highchart.axes[0].getExtremes().min + this.Highchart.axes[0].getExtremes().max) / 2;
                options.labels[0].point.y = this.Highchart.axes[1].getExtremes().min;
            }
           this.Highchart.addAnnotation(options);
           this.Highchart.annotations[this.Highchart.annotations.length - 1].setVisible(true);
        }
     /*   function animateSeries(series, begin, end){
            console.log(this);
            var current = begin;
            var interval = setInterval(() => {
                var lastPoint;
                if ( current <= end ){
                    this.Highchart.series[series].addPoint(this.dataSource[0][current.toString()]);
                    current++;
                } else {
                    lastPoint = this.Highchart.series[series].points[this.Highchart.series[series].points.length - 1];
                    lastPoint.select(true, true);
                    clearInterval(interval);
                    return new Promise(function(resolve,reject){
                        setTimeout(() => {
                            resolve(true);
                        },500);
                    });
                }
            },500);
            return interval;
        }*/
        function backfillSeries(series, begin, end ){ // ie 2006, 2009
            this.Highchart.series[series].addPoint(this.dataSource[series][begin.toString()]); // place the first point
            for ( let i = begin + 1; i < end ; i++){
                this.Highchart.series[series].addPoint(null); // put in null placeholders for the points in between
            }
            this.Highchart.series[series].addPoint(this.dataSource[series][end.toString()]); // place the last point
            var yearSpan = end - begin; // ie 3
            for ( let i = yearSpan; i > 1; i-- ){ //update the placeholders with data
                this.Highchart.series[series].points[this.Highchart.series[series].points.length - i].update(this.dataSource[series][(end - i + 1).toString()]);
            }

        }
        function animateSeries(series, begin, end, delay = 500){
            //console.log(this);
            return new Promise((resolve,reject) => {
              //  console.log(this);
                var current = begin;
                var interval = setInterval(() => {
                    if ( current <= end ){
                        this.Highchart.series[series].addPoint(this.dataSource[series][current.toString()]);
                        current++;
                    } else {
                        toggleLastPoint.call(this, series);
                        setTimeout(() => {
                            resolve(true);
                        },delay);
                        clearInterval(interval);
                    }
                },500);
            });
        }
        function toggleLastPoint(series){
            var lastPoint = this.Highchart.series[series].points[this.Highchart.series[series].points.length - 1];
            lastPoint.select(null, true);
        }
    }
};