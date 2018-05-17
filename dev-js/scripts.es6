/* global Highcharts */
const d3 = require('d3-collection'); // requiring subset of D3 to handle the data nesting
const generationData = require('../data/generation.json');
const decompositionData = require('../data/decomposition.json');
import { CreateDropdown } from './dropdown.js';
import { HighchartsDefaults } from './highcharts-defaults.js';
(function(){
    "use strict";

/*
 * Set up data and options
 *
 */ 
    window.scenarioDict = [
        {key: 'baseline', value: 'No carbon tax'},
        {key: 'twenty-five', value: '$25/ton tax'},
        {key: 'fifty', value: '$50/ton tax'}
    ];
    var dataCollection = [];
    dataCollection[0] = nestData(generationData, ['category','aeo','scenario']);
    dataCollection[1] = nestData(decompositionData, ['category','aeo','scenario']);
    
    /* set default options */
    Highcharts.setOptions(HighchartsDefaults);
      
    /* set options for the specific charts */
    window.optionsCollection = [];
    
    window.optionsCollection[0] = { // first chart's options
        initialCategory: 'baseline',
        chart: {  
            type: 'column',   
            height: 600
        },
        title: {
            formatter: function(scenario){
                return `Electricity generation in 2030 by source, with ${ scenario }`;
            }
        },
        subtitle: {
            text: 'Annual Energy Outlook estimates from 2011 (old) and 2016 (new). ' + 
                  'Estimates from 2016 do not have the “high demand and gas prices” scenario. ' + 
                  'Estimates from 2011 for the “high gas prices” and “high demand” scenarios are not available for the the $50/ton tax option. ' + 
                  'Carbon-tax levels change over time—dollar amounts correspond to 2018 levels. Source: U.S. Energy Information Administration.',
        },           
        plotOptions: {
            column: {
                stacking: 'normal'
            }   
        },  
      //  series: createSeries(0),
        
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
        },
        tooltip: {
            valueDecimals: 0,
            valueSuffix: ' TWh'
        }
    }; 

    window.optionsCollection[1] = { // second chart's options
        initialCategory: 'twenty-five', 
        chart: { 
            type: 'column',   
            height: 600
        },
        title: {
            formatter: function(scenario){
                return `Net emissions and emissions reductions in 2030 by type, with ${ scenario }`;
            }
        },
        subtitle: {
            text: 'LMDI decomposition of emissions reductions from Annual Energy Outlook estimates from 2011 (old) and 2016 (new). ' + 
                  'Estimates from 2016 do not have the “high demand and gas prices” scenario. ' + 
                  'Estimates from 2011 for the “high gas prices” and “high demand” scenarios are not available for the the $50/ton tax option. ' + 
                  'Carbon-tax levels change over time—dollar amounts correspond to 2018 levels. Source: U.S. Energy Information Administration.',
        },           
        plotOptions: {
            column: {
                stacking: 'normal'
            }
        },  
       // series: createSeries(1), //this is problematic
        
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
                text: 'megatons',
                align:'high',
                rotation: 0,
                margin:0,
                y: -25,
                offset: -40,
                x: -10
            },
            max:3000, // TO DO: set programmatically
        },
        tooltip: {
            valueDecimals: 0,
            valueSuffix: ' megatons'
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
        window.optionsCollection.forEach((oc,i) => {
            oc.series = createSeries(i);
            window.charts.push(new Highcharts.chart('chart-' + i, oc));
            checkSubtitle(i);
            CreateDropdown(i);
            updateChart(i, oc.initialCategory); 
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
            console.log(s.key);
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
