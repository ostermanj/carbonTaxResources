const d3 = require('d3-collection');
const generationData = require('../data/generation.json');
(function(){
    /* global Highcharts */
"use strict";
    var nestedData = nestData(generationData, ['aeo','fuel','scenario']);
    console.log(nestedData);

    function initCharts(taxLevel){
        nestedData.forEach((aeo, i) => { // ie 2011 and 2016 
            var options = {
                chart: {
                    type: 'column'
                },
                 // to do: colors
                plotOptions: {
                    column: {
                        stacking: 'normal'
                    }
                },
                series: aeo.values.map(f => {
                    return {
                        name: f.key,
                        data: f.values.map(s => {
                            var match = s.values.find(v => v.tax === taxLevel);
                            if ( match !== undefined) {
                                return [s.key, match.value];
                            }
                        })
                    };
                })
            };  


            Highcharts.chart('chart-' + i, options);
        });
    }
    
    initCharts('baseline');
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
