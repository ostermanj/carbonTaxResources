export const sharedMethods = { // as an exported module `this` depends on context in which method is called
    setData(aeo, taxLevel, isInitial){
        return aeo.values.map(s => { 
            console.log(s.key);
            var match = s.values.find(v => v.tax === taxLevel);
            console.log(match);
            if ( match !== undefined) {
                return isInitial ? [s.key, 0] : [s.key, match.value];
            }
        });
    },
    createBarSeries(data){ 
        
        var array = [];
        data.forEach((c,i) => {
            c.values.reverse().forEach((aeo, j) => {
                array.push({
                    name: c.key, 
                    data: sharedMethods.setData(aeo, 'baseline', true),
                    stack: aeo.key,
                    linkedTo: j === 0 ? undefined : ':previous',
                    colorIndex: i
                });
            });
        }); 
        return array;
    },
    updateChart(taxLevel){ 
        console.log(this); 
        var seriesIndex = 0;
        this.dataSource.forEach(c => {
            c.values.forEach(aeo => {
                this.Highchart.series[seriesIndex].setData(sharedMethods.setData(aeo, taxLevel, false));
                seriesIndex++;
            });
            var titleText = this.title.formatter(this.userOptions.options.find(s => s.key === taxLevel).value.toLowerCase());
            this.Highchart.setTitle({text: titleText});
        });
    },
    userOptions: {
        type: 'radio',
        options: [
            {key: 'baseline', value: 'No carbon tax'},
            {key: 'twenty-five', value: '$25/ton tax'},
            {key: 'fifty', value: '$50/ton tax'}
        ]
    }
};