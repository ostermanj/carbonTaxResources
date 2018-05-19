/* global Highcharts */
const d3 = require('d3-collection'); // requiring subset of D3 to handle the data nesting
const generationData = require('../data/generation.json');
const decompositionData = require('../data/decomposition.json');
const chart0Options = require('./generation-options.json');
const chart1Options = require('./decomposition-options.json');

import { CreateDropdown } from './dropdown.js';
import { HighchartsDefaults } from './highcharts-defaults.js';

(function(){
    "use strict";

/*
 * Set up data and options
 *
 */ var dataController = {
        nestData(data, nestBy, nestType = 'series'){
        // nestBy = string or array of field(s) to nest by, or a custom function, or an array of strings or functions;
            var prelim,
                nestByArray;

            if ( typeof nestBy === 'string' || typeof nestBy === 'function' ) { // ie only one nestBy field or funciton
                nestByArray = [nestBy];
            } else {
                if (!Array.isArray(nestBy)) { throw 'nestBy variable must be a string, function, or array of strings or functions'; }
                nestByArray = nestBy;
            }
            prelim = this.nestPrelim(nestByArray);
            
            if ( nestType === 'object' ){
                return prelim
                    .object(data);
            } else {
                return prelim
                    .entries(data);
            }
        },
        nestPrelim(nestByArray){
            // recursive  nesting function used by summarizeData and returnKeyValues
            return nestByArray.reduce((acc, cur) => {
                if (typeof cur !== 'string' && typeof cur !== 'function' ) { throw 'each nestBy item must be a string or function'; }
                var rtn;
                if ( typeof cur === 'string' ){
                    rtn = acc.key(function(d){
                        return d[cur];
                    });    
                }
                if ( typeof cur === 'function' ){
                    rtn = acc.key(function(d){
                        return cur(d);
                    });
                }
                
                return rtn;
            }, d3.nest());
        }
    }; // end dataController
    
    window.scenarioDict = [ // TO DO: where to place this???
        {key: 'baseline', value: 'No carbon tax'},
        {key: 'twenty-five', value: '$25/ton tax'},
        {key: 'fifty', value: '$50/ton tax'} 
    ];
    
    var viewController = {
        isInitialized: false,
        setTimers(){
            var initTimer = setTimeout(() => {
                console.log('timer');
                this.initCharts();
            },5000);
            if ( document.fonts !== undefined ){ // highcharts lays out the charts according to font characteristics, how much space
                                                 // a line or paragraph or label takes up, for instance. If it loads before the fonts are
                                                 // ready, it may not look right, and the layout will change slightly when the chart is
                                                 // updated. this fn tests the browser for document.fonts (FontFaceSet) support and if supported
                                                 // fires init() when the fonts are ready. otherwise it fires on window load (which could take some time),
                                                 // with a timed back up in case load takes too long
                document.fonts.ready.then(() => {
                    clearTimeout(initTimer);
                    if ( !this.isInitialized ){
                        this.initCharts();
                    }
                });
            } else {
                window.addEventListener('load', function(){
                    clearTimeout(initTimer);
                    if ( !this.isInitialized ){ 
                        this.initCharts();
                    }
                });
            }
        },
        initCharts(){
            /* set default options */
            Highcharts.setOptions(HighchartsDefaults);
            this.charts = []; 
            this.optionsCollection.forEach((oc,i) => {
                oc.series = oc.seriesCreator(i);
                this.charts.push(new Highcharts.chart('chart-' + i, oc));
                checkSubtitle(i);
                CreateDropdown(i);
                updateChart(i, oc.initialCategory); 
            });
        }
    };
      
    /* set options for the specific charts */ 
    window.optionsCollection = [chart0Options,chart1Options];
     
/*
 * Set up triggers to initialize charts
 *
 */  

    var isInitialized = false;
    
    
    function initCharts(){
        
    }

    function checkSubtitle(index){
        var chart = window.charts[index];
        if ( chart.options.subtitle.verticalAlign === 'bottom' ){
            var svg = chart.container.querySelector('.highcharts-root');
            console.log(svg);
            var viewBoxArray = svg.getAttribute('viewBox').split(' ');
            viewBoxArray[3] = svg.getBBox().height;
            svg.setAttribute('height', viewBoxArray[3]);
            svg.setAttribute('viewBox', viewBoxArray.join(' '));
        }
    }

    function setData(aeo, taxLevel, isInitial){
        return aeo.values.map(s => { 
            console.log(s.key);
            var match = s.values.find(v => v.tax === taxLevel);
            console.log(match);
            if ( match !== undefined) {
                return isInitial ? [s.key, 0] : [s.key, match.value];
            }
        });
    } 
    function createBarSeries(index){ // jshint ignore:line

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
    }
    function updateChart(index, taxLevel){ // NEED TO APPLY TO SPECIFIC INDEX OF WINDOW.CHARTS
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
     //   window.charts[index].setTitle({text: `Electricity generation in 2030 by source, with ${ window.scenarioDict.find(s => s.key === taxLevel).value }`}); // HOW TO HANDLE THIS?
    }
    
    window.updateChart = updateChart;

    
}()); // end IIFE 
