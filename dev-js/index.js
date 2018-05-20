import HighchartApp from './highchart-app.js';
var chartConfigs = [require('./generation-config.js').default, require('./decomposition-config.js').default];
console.log(HighchartApp, chartConfigs);

HighchartApp.chartController.init(chartConfigs);