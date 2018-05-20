
    var shared = {
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
        createBarSeries(index){ // jshint ignore:line
            var array = [];
            dataCollection[index].forEach((c,i) => {
                c.values.reverse().forEach((aeo, j) => {
                    array.push({
                        name: c.key, 
                        data: setData(aeo, 'baseline', true),
                        stack: aeo.key,
                        linkedTo: j === 0 ? undefined : ':previous',
                        colorIndex: i
                    });
                });
            }); 
            return array;
        },
        updateChart(index, taxLevel){ // NEED TO APPLY TO SPECIFIC INDEX OF WINDOW.CHARTS
            console.log(index, taxLevel, dataCollection[index]);
            /* jshint validthis: true */
            let seriesIndex = 0;
            dataCollection[index].forEach(c => {
                c.values.forEach(aeo => {
                    console.log(index, seriesIndex);
                    window.charts[index].series[seriesIndex].setData(setData(aeo, taxLevel, false));
                    seriesIndex++;
                });
                var titleText = window. optionsCollection[index].title.formatter(window.scenarioDict.find(s => s.key === taxLevel).value.toLowerCase());
                window.charts[index].setTitle({text: titleText});
            });
        } 
    };