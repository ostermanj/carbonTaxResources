var generationData = require('../data/generation.json');
(function(){
"use strict";
    console.log(generationData);

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
    }
}()); // end IIFE 
