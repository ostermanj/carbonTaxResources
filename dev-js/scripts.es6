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
        isInitialized = true;
        initChart();
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
                isInitialized = true;
                initChart();
            }
        });
    } else {
        window.addEventListener('load', function(){
            clearTimeout(initTimer);
            if ( !isInitialized ){
                isInitialized = true;
                initChart();
            }
        });
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
            title: {
               text: 'Electricity generation in 2030 by source, with no carbon tax',
            },
            subtitle: {
                text: 'Annual Energy Outlook estimates of power generation in 2030. The "old" estimate is from 2011; the "new" is from 2016. Carbon-tax levels change over time—dollar amounts correspond to 2018 levels.', 
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
    function setData(aeo, taxLevel){
        return aeo.values.map(s => { 
            var match = s.values.find(v => v.tax === taxLevel);
            console.log(match);
            if ( match !== undefined) {
                return [s.key, match.value];
            }
        });
    } 
    function createSeries(){
        var array = [];
        nestedData.forEach((f,i) => {
            f.values.reverse().forEach((aeo, j) => {
                array.push({
                    name: f.key, 
                    data: setData(aeo, 'baseline'),
                    stack: aeo.key,
                    linkedTo: j === 0 ? undefined : ':previous',
                    colorIndex: i
                });
            });
        });
        return array;
    }
    function updateChart(taxLevel, e){
        console.log(taxLevel);
        /* jshint validthis: true */
        var seriesIndex = 0;
        nestedData.forEach(f => {
            f.values.forEach(aeo => {
                chart0.series[seriesIndex].setData(setData(aeo, taxLevel));
                seriesIndex++;
            });
        });
        console.log(e);
        chart0.setTitle({text: `Generation Shares with ${e.target.options[e.target.options.selectedIndex].innerText.toLowerCase()}, 2030`});
    }
    
    window.updateChart = updateChart;

    CreateDropdown();
    //initCharts('baseline');
/*    function makeTraces(aeo, taxLevel){
        var traces = [];
        aeo.values.forEach(f => {  // fuel
            var trace = {
                type: 'bar',
                name: f.key,
                x: f.values.map(s => s.key), // scenario, reference, gas, demand, both
                y: f.values.map(s => {
                    var match = s.values.find(v => v.tax === taxLevel);
                    return match !== undefined ? s.values.find(v => v.tax === taxLevel).value : '';
                })
            };
            traces.push(trace);
        });
        return traces;
    }
    function initPlots(taxLevel){
        nestedData.forEach((aeo, i) => {
            
            var chartOptions = {
                barmode: 'stack',
                updatemenus: [{
                    y: 0.8,
                    yanchor: 'top',
                    buttons: [{
                        method: 'animate',
                        args: ['traces', makeTraces(aeo, 'baseline')],
                        label: 'Baseline'
                    }, {
                        method: 'restyle',
                        args: ['traces', makeTraces(aeo, 'twenty-five')],
                        label: '$25'
                    }, {
                        method: 'restyle',
                        args: ['traces', makeTraces(aeo, 'fifty')],
                        label: '$50'
                    }]
                }]
            };
            Plotly.newPlot('chart-' + i, makeTraces(aeo, taxLevel), chartOptions);
        });
    } */

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











    /* end plotly test*/
/*
    var nestedData = nestData(generationData, ['aeo','tax','scenario']);
    console.log(nestedData);

    var margin = {
        top: 1,
        right: 1,
        bottom: 5,
        left: 5
    };

    var svg = d3.select('#chart-0')
      .append('svg')
      .attr('width', '100%')
      .attr('xmlns','http://www.w3.org/2000/svg')
      .attr('version','1.1')
      .attr('viewBox', '0 0 100 50')
      .attr('focusable',false)
      .attr('aria-labelledby', 'SVGTitle SVGDesc')
      .attr('role','img');

    svg.append('title')
        .attr('id', 'SVGTitle')
        .text('Stacked column graph of energy generation');

    svg.append('desc')
        .attr('id','SVGDesc')
        .text('Stacked column graph of energy generation ....'); // TODO: add to description

    svg
      .append('g')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');



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
    }*/
}()); // end IIFE 
