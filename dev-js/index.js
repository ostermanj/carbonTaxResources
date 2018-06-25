import HighchartApp from './highchart-app.js';
//var chartConfigs = [require('../chart-configs/generation-config.js').default, require('../chart-configs/decomposition-config.js').default, require('../chart-configs/sales-config.js').default, require('../chart-configs/gas-prices-config.js').default];
console.log(document.fonts.status); 
var chartConfigs = [require('../chart-configs/gas-prices-config.js').default, require('../chart-configs/sales-config.js').default, require('../chart-configs/generation-config.js').default, require('../chart-configs/decomposition-config.js').default];
console.log(HighchartApp, chartConfigs);

HighchartApp.chartController.init(chartConfigs);    