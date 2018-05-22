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
        var array = data.map(series => {
            var data = [];
            /*for ( var year = 2000; year < 2036; year++ ){
                //data.push(series[year.toString()]);
                data.push(null);
            }*/
            return {
                name: series.series,
                data: data 
            }
        });
        
        return array;
    },
    updateChart(){
        console.log(this);
        animateActual.call(this, 2000,2010);
        function animateActual(begin, end){
            console.log(this);
            var current = begin;
            var interval = setInterval(() => {
                if ( current <= end ){
                    this.Highchart.series[0].addPoint(this.dataSource[0][current.toString()]);
                    current++;
                } else {
                    clearInterval(interval);
                }
            },1000);
        }
    }
};