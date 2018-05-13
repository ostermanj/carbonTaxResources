var generationData = require('../data/generation.json');
(function(){
    /* global Plotly */
"use strict";
    /* plotly test*/
    console.log(generationData);
    console.log(Plotly);
    var nestedData = nestData(generationData, ['aeo','fuel','scenario']);
    console.log(nestedData);
    var taxLevel = 'baseline';

    nestedData.forEach((aeo, i) => {
        var traces = [];
        aeo.values.forEach(f => {
            var trace = {
                type: 'bar',
                name: f.key,
                x: f.values.map(s => s.key),
                y: f.values.map(s => s.values.find(v => v.tax === taxLevel).value)
            };
            traces.push(trace);
        });
        Plotly.newPlot('chart-' + i, traces, {barmode: 'stack'});
    });
     
   /* var trace1 = {
      x: ['giraffes', 'orangutans', 'monkeys'],
      y: [20, 14, 23],
      name: 'SF Zoo',
      type: 'bar'
    };

    var trace2 = {
      x: ['giraffes', 'orangutans', 'monkeys'],
      y: [12, 18, 29],
      name: 'LA Zoo',
      type: 'bar'
    };

    var data = [trace1, trace2];

    var layout = {barmode: 'stack'};

    Plotly.newPlot('chart-1', data, layout);*/


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
        }, Plotly.d3.nest());
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
