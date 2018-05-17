/* global Highcharts */
/* exported HighchartsGroupedCategories, updateChart */
const d3 = require('d3-collection'); // requiring subset of D3 to handle the data nesting
const generationData = require('../data/generation.json');
//const decompositionData = require('../data/decomposition.json');
import { CreateDropdown } from './dropdown.js';
import { HighchartsDefaults } from './highcharts-defaults.js';
(function(){
    "use strict";
/*
 * Set up data and options
 *
 */ 

    var dataCollection = [];
    dataCollection[0] = nestData(generationData, ['category','aeo','scenario']);
    
    /* set default options */
    Highcharts.setOptions(HighchartsDefaults);
      
    /* set options for the specific charts */
    var optionsCollection = [];
    optionsCollection[0] = { // first chart's options
        chart: { 
            type: 'column',   
            height: '70%'
        },
        subtitle: {
            text: 'Annual Energy Outlook estimates from 2011 (old) and 2016 (new). ' + 
                  '2016 estimates do not have the “high demand and gas prices” scenario. ' + 
                  '2011 estimates for the “high gas prices” and “high demand” scenarios are not available for the the $50/ton tax option. ' + 
                  'Carbon-tax levels change over time—dollar amounts correspond to 2018 levels. Source: U.S. Energy Information Administration.'
        },           
        plotOptions: {
            column: {
                stacking: 'normal'
            }
        },  
        series: createSeries(0),
        
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

/*
 * Set up triggers to initialize charts
 *
 */  

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
        initCharts();
    }
    
    
    function initCharts(){
        window.charts = []; 
        dataCollection.forEach((dc,i) => {
            window.charts.push(Highcharts.chart('chart-' + i, optionsCollection[i]));
            checkSubtitle(i);
            CreateDropdown(i);
            updateChart(i, 'baseline','no carbon tax'); // to do: shd fetch text from key
        });
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
            var match = s.values.find(v => v.tax === taxLevel);
            console.log(match);
            if ( match !== undefined) {
                return isInitial ? [s.key, 0] : [s.key, match.value];
            }
        });
    } 
    function createSeries(index){
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
    function updateChart(index, taxLevel, text){ // NEED TO APPLY TO SPECIFIC INDEX OF WINDOW.CHARTS
        console.log(index, taxLevel, dataCollection);
        /* jshint validthis: true */
        var seriesIndex = 0;
        dataCollection[index].forEach(c => {
            c.values.forEach(aeo => {
                window.charts[index].series[seriesIndex].setData(setData(aeo, taxLevel, false));
                seriesIndex++;
            });
        });
        window.charts[index].setTitle({text: `Electricity generation in 2030 by source, with ${ text }`}); // HOW TO HANDLE THIS?
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
