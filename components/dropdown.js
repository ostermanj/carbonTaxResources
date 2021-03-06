import GAEventHandler from '../dev-js/ga-event-handler.js';
export default function(options){
    var dropdown = document.createElement('select');
    options.userOptions.options.forEach((s,i) => {
        var option = document.createElement('option');
        option.setAttribute('value', s.key);
        option.innerHTML = s.value;
        dropdown.appendChild(option);
    });
    options.Highchart.renderTo.insertAdjacentHTML('afterbegin', dropdown.outerHTML);
    console.log(options.Highchart.renderTo);
    var rendered = options.Highchart.renderTo.querySelector('select');
    rendered.value = options.initialCategory;
    rendered.onchange = function(){
        GAEventHandler('selectUserOption', this.value + '--' + options.chart.className);
        options.updateFunction.call(options,rendered.value);
    };
};