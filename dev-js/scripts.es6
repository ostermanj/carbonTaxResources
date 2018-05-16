/* global Highcharts */
/* exported HighchartsGroupedCategories, updateChart */
const d3 = require('d3-collection'); // requiring subset of D3 to handle the data nesting
const generationData = require('../data/generation.json');
import { CreateDropdown } from './dropdown.js';
import { HighchartsDefaults } from './highcharts-defaults.js';
(function(){
    "use strict";
    var isInitialized = false;
    var initTimer = setTimeout(() => {
        console.log('timer');
        initialize();
    },5000);
    if ( document.fonts !== undefined ){ // highcharts lays out the charts according to font characteristics, how much space
                                         // a line or paragraph or label takes up, for instance. If it loads before the fonts are
                                         // ready, it may not look right, and the layout will change slightly when the chart is
                                         // updated. this fn tests the browser for document.fonts (FontFaceSet) support and if supported
                                         // fires init() when the fonts are ready. otherwise it fires on window load (which could take some time),
                                         // with a timed back up in case load takes too long
        document.fonts.ready.then(() => {
            clearTimeout(initTimer);
            if ( !isInitialized ){
                initialize();
            }
        });
    } else {
        window.addEventListener('load', function(){
            clearTimeout(initTimer);
            if ( !isInitialized ){
                initialize();
            }
        });
    }
    function initialize(){
        isInitialized = true;
        initChart();
        CreateDropdown();
        updateChart('baseline','no carbon tax'); // to do: shd fetch text from key
    }
    
    Highcharts.setOptions(HighchartsDefaults);
    
    var chart0;
    var nestedData = nestData(generationData, ['fuel','aeo','scenario']);
    console.log(generationData);
    console.log(nestedData); 
      
    function initChart(){
        var options = { 
            chart: { 
                type: 'column',   
                height: '70%'
            },
            subtitle: {
                text: 'Annual Energy Outlook estimates of power generation in 2030. The “old” estimate is from 2011; the “new” is from 2016. Carbon-tax levels change over time—dollar amounts correspond to 2018 levels. Source: U.S. Energy Information Administration.'
            },
            plotOptions: {
                column: {
                    stacking: 'normal'
                }
            },  
            series: createSeries(),
            
            xAxis: {
                categories: ['Standard Scenario', 'High Gas Prices', 'High Demand', 'High Demand<br />and Gas Prices'], // TO DO: set programatically
                labels: {
                    y: 40 
                }
            },
            yAxis: {
                reversedStacks: false,
                stackLabels: {
                      enabled: true,
                      verticalAlign: 'bottom',
                      crop: false,
                      overflow: 'none',
                      y: 20, 
                      formatter: function() {
                        return this.stack;
                      }
                },
                title: {
                    text: 'terawatt hours',
                    align:'high',
                    rotation: 0,
                    margin:0,
                    y: -25,
                    offset: -75,
                    x: -10
                },
                max:5000, // TO DO: set programmatically
            }
        };    
        chart0 = Highcharts.chart('chart-0', options);
        window.chart = chart0;

    }
    function setData(aeo, taxLevel, isInitial){
        return aeo.values.map(s => { 
            var match = s.values.find(v => v.tax === taxLevel);
            console.log(match);
            if ( match !== undefined) {
                return isInitial ? [s.key, 0] : [s.key, match.value];
            }
        });
    } 
    function createSeries(){
        var array = [];
        nestedData.forEach((f,i) => {
            f.values.reverse().forEach((aeo, j) => {
                array.push({
                    name: f.key, 
                    data: setData(aeo, 'baseline', true),
                    stack: aeo.key,
                    linkedTo: j === 0 ? undefined : ':previous',
                    colorIndex: i
                });
            });
        });
        return array;
    }
    function updateChart(taxLevel, text){
        console.log(taxLevel);
        /* jshint validthis: true */
        var seriesIndex = 0;
        nestedData.forEach(f => {
            f.values.forEach(aeo => {
                chart0.series[seriesIndex].setData(setData(aeo, taxLevel, false));
                seriesIndex++;
            });
        });
        chart0.setTitle({text: `Electricity generation in 2030 by source, with ${ text }`});
    }
    
    window.updateChart = updateChart;

    function nestData(data, nestBy, nestType = 'series'){
        // nestBy = string or array of field(s) to nest by, or a custom function, or an array of strings or functions;
        var prelim,
            nestByArray;
                        
      
        if ( typeof nestBy === 'string' || typeof nestBy === 'function' ) { // ie only one nestBy field or funciton
            nestByArray = [nestBy];
        } else {
            if (!Array.isArray(nestBy)) { throw 'nestBy variable must be a string, function, or array of strings or functions'; }
            nestByArray = nestBy;
        }
        prelim = nestPrelim(nestByArray);
        
        if ( nestType === 'object' ){
            return prelim
                .object(data);
        } else {
            return prelim
                .entries(data);
        }
    }
    function nestPrelim(nestByArray){
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
}()); // end IIFE 
