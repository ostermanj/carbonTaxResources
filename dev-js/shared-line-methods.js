export const sharedLineMethods = { // as an exported module `this` depends on context in which method is called

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
    annotateYear(series, year, text, position){
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
    },
    backfillSeries(series, begin, end ){ // ie 2006, 2009
        this.Highchart.series[series].addPoint(this.dataSource[series][begin.toString()]); // place the first point
        for ( let i = begin + 1; i < end ; i++){
            this.Highchart.series[series].addPoint(null); // put in null placeholders for the points in between
        }
        this.Highchart.series[series].addPoint(this.dataSource[series][end.toString()]); // place the last point
        var yearSpan = end - begin; // ie 3
        for ( let i = yearSpan; i > 1; i-- ){ //update the placeholders with data
            this.Highchart.series[series].points[this.Highchart.series[series].points.length - i].update(this.dataSource[series][(end - i + 1).toString()]);
        }

    },
    animateSeries(series, begin, end, delay = 500){
        //console.log(this);
        return new Promise((resolve,reject) => {
          //  console.log(this);
            var current = begin;
            var interval = setInterval(() => {
                if ( current <= end ){
                    this.Highchart.series[series].addPoint(this.dataSource[series][current.toString()]);
                    current++;
                } else {
                    sharedLineMethods.toggleLastPoint.call(this, series);
                    setTimeout(() => {
                        resolve(true);
                    },delay);
                    clearInterval(interval);
                }
            },500);
        });
    },
    toggleLastPoint(series){
        var lastPoint = this.Highchart.series[series].points[this.Highchart.series[series].points.length - 1];
        lastPoint.select(null, true);
    },
    createMask(onclickFn){
        var div = document.createElement('div');
        div.className = 'overlay-play';
        div.setAttribute('title','Click or tap to start animation');
        var tri = document.createElement('div');
        tri.className = 'triangle-right';
        div.appendChild(tri);
        this.Highchart.renderTo.insertAdjacentHTML('afterbegin', div.outerHTML);
        var overlay = this.Highchart.renderTo.querySelector('.overlay-play');
        overlay.onclick = () => {
            onclickFn.call(this);
        };

    }
};