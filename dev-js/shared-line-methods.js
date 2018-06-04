export const sharedLineMethods = { // as an exported module `this` depends on context in which method is called

    updateChart(){
                            
    },
    prepAnimation(){
        this.Highchart.update({plotOptions: {series: {enableMouseTracking: false}}});
        this.Highchart.annotations.forEach(note => {
            note.destroy();
        });
        this.Highchart.annotations = []; // destroy notes and empty the array to keep from doubling annotations
                                         // on replay
        this.Highchart.yAxis[0].setExtremes(this.yAxis.startMin,this.yAxis.startMax);
        this.Highchart.xAxis[0].setExtremes(this.xAxis.startMin,this.xAxis.startMax);
        this.series = sharedLineMethods.createNullSeries(this.dataSource); // replace the series data with nulls as starting point for animation
        this.Highchart.update({series: this.series});
        this.hideShowElements.forEach(el => {
            el.style.opacity = 0;
        });
    },
    createOverlayReplay(replayFn){
        var replay = document.createElement('button');
        replay.className = 'overlay-replay magazine-button--small';
        replay.setAttribute('title','Click or tap replay the animation');
        replay.innerText = 'replay';
        this.Highchart.renderTo.insertAdjacentHTML('afterbegin',replay.outerHTML);
        var btn = this.Highchart.renderTo.querySelector('.overlay-replay');
        btn.style.opacity = 0;
        btn.onclick = () => {
            replayFn.call(this);
        };
    },
    createSeries(data){ 
        var array = data.map((series, i) => {
            var data = [];
            for ( var year = 2000; year < 2036; year++ ){
                data.push(series[year.toString()]);
            }
            return {
                name: series.series,
                data: data,
                className: i === 0 ? 'solid' : 'shortdot'
            }
        });
        
        return array;
    },
    createNullSeries(data){ 
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
        if ( typeof position === 'string' ){
            options.labels[0].useHTML = true;
            options.labels[0].className = position + ' highcharts-color-' + series;
            options.labels[0].point.xAxis = undefined;
            //options.labels[0].point.yAxis = undefined;
            options.labels[0].point.x = 0;
            //options.labels[0].point.y = 0;

        }
       /* if ( position === 'top-right' ){
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
        }*/
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
                    sharedLineMethods.togglePoint.call(this, series);
                    setTimeout(() => {
                        resolve(true);
                    },delay);
                    clearInterval(interval);
                }
            },500);  // set bac to 500;
        });
    },
    togglePoint(series, point = 'last'){
        var lastPoint;
        if ( point === 'last' ){
            lastPoint = this.Highchart.series[series].points[this.Highchart.series[series].points.length - 1];
        } else {
            lastPoint = this.Highchart.series[series].points[point];
        }
        lastPoint.select(null, true);
    },
    createMask(onclickFn){
        var div = document.createElement('div');
        div.className = 'overlay-play';
        div.setAttribute('title','Click or tap to start animation');
        div.setAttribute('tabindex', 0);
        var tri = document.createElement('div');
        tri.className = 'triangle-right';
        div.appendChild(tri);
        var dismiss = document.createElement('button');
        dismiss.innerText = 'skip animation';
        dismiss.className = 'dismiss-button magazine-button--small';
        dismiss.setAttribute('title','Click or tap to skip the animation');
        div.appendChild(dismiss);
        this.Highchart.renderTo.insertAdjacentHTML('afterbegin', div.outerHTML);
        var overlay = this.Highchart.renderTo.querySelector('.overlay-play');
        overlay.onclick = () => {
            onclickFn.call(this);
            removeOverlay();
        };
        this.Highchart.renderTo.querySelector('.dismiss-button').onclick = function(e){
            e.stopPropagation();
            removeOverlay();
        };
        function removeOverlay(){
            overlay.onclick = '';
            overlay.classList.add('clicked');
            setTimeout(() => {
                overlay.style.display = 'none';
            },250);
        }

    }
};