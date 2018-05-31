const d3 = require('d3-collection'); // requiring subset of D3 to handle the data nesting
import { HighchartsDefaults } from '../chart-configs/highcharts-defaults.js';
import createUserOptions from '../components/user-options.js';

var fullAPI = (function(){
    /* global Highcharts */
    "use strict";

    var dataController = {
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
    
    var chartController = {
        isInitialized: false,
        init(chartConfigs){
            var initTimer = setTimeout(() => {
                console.log('timer');
                this.initCharts(chartConfigs);
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
                        this.initCharts(chartConfigs);
                    }
                });
            } else {
                window.addEventListener('load', function(){
                    clearTimeout(initTimer);
                    if ( !this.isInitialized ){ 
                        this.initCharts(chartConfigs);
                    }
                });
            }
        },
        initCharts(chartConfigs){
            /* set default options */
            Highcharts.setOptions(HighchartsDefaults);
            this.charts = []; 
            chartConfigs.forEach((options,i) => {
                options.series = options.seriesCreator(options.dataSource);
                options.index = i;
                options.Highchart = new Highcharts.chart('chart-' + i, options);
                this.charts.push(options.Highchart);
                createUserOptions(options);
                options.updateFunction(...options.initialUpdateParams); 
            });
        },
    };
    
    return {
        dataController,
        chartController
    };
    
}()); // end IIFE 

export default fullAPI;
export const dataController = fullAPI.dataController;