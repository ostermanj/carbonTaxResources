/* global Highcharts */
/* exported HighchartsGroupedCategories, updateChart */
const d3 = require('d3-collection');
const generationData = require('../data/generation.json');
const HighchartsGroupedCategories = require('highcharts-grouped-categories')(Highcharts);
import { CreateDropdown } from './dropdown.js';
(function(){
    "use strict";
    var chart0;
    var nestedData = nestData(generationData, ['fuel','aeo','scenario']);
    console.log(generationData);
    console.log(nestedData); 
    
    function initChart(taxLevel){
        var options = {
            chart: {
                type: 'column',  
                height: '66%'
               // spacingLeft:5,
               // spacingTop: 0
            },
            credits: {
                text: 'Resources for the Future',
                position: {
                    align: 'center',                     
                    
                },
                href: '//www.rff.org' 
            },
            title: {
               text: 'Generation Shares under Baseline Scenarios, 2030',
                align: 'left',
                margin: 30,
                x:-10
                

            },
            subtitle: {
                text: 'terawatt hours',
                align: 'left',
                x:-10
                
            },
            colors: ['#002d55','#706f73','#387b2b','#572600','#de791b','#0064af'],
            plotOptions: {
                column: {
                    stacking: 'normal'
                }
            },
            series: createSeries(taxLevel),
            xAxis: {
                categories: ['Standard Scenario', 'High Gas Prices', 'High Demand', 'High Demand<br />and Gas Prices'],
                labels: {
                    useHTML: true,
                    formatter: function(){
                        console.log();
                        return `${ this.value !== 'High Demand and Gas Prices' ? 'AEO 2011 | AEO 2016' : 'AEO 2011 | n.a.&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'}<br />${this.value}`;
                    }
                }
            },
            yAxis: {
                reversedStacks: false,
                title: {
                    text: null,
                    
                },
                max:5000
            },
            legend: {
                padding:13
            }
        };    
        chart0 = Highcharts.chart('chart-0', options);
    }
    
    function createSeries(taxLevel){
        var array = [];
        nestedData.forEach((f,i) => {
            f.values.reverse().forEach((aeo, j) => {
                array.push({
                    name: f.key, 
                    data: aeo.values.map(s => { 
                        var match = s.values.find(v => v.tax === taxLevel);
                        if ( match !== undefined) {
                            return [s.key, match.value];
                        }
                    }),
                    stack: aeo.key,
                    linkedTo: j === 0 ? undefined : ':previous',
                    colorIndex: i
                });
            });
        });
        return array;
    }
    function updateChart(){
        /* jshint validthis: true */
        console.log(this.value);
        var seriesIndex = 0;
        nestedData.forEach(f => {
            f.values.forEach(aeo => {
                chart0.series[seriesIndex].setData(aeo.values.map(s => { 
                    var match = s.values.find(v => v.tax === this.value);
                    console.log(match);
                    if ( match !== undefined) {
                        return [s.key, match.value];
                    }
                }));
                seriesIndex++;
            });
        });
    }
    window.updateChart = updateChart;
    initChart('baseline');
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
