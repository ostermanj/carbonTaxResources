export const CreateDropdown = function(index){
    var dropdown = document.createElement('select');
    dropdown.setAttribute('id','hc-dropdown-' + index);
    window.scenarioDict.forEach((s,i) => {
        var option = document.createElement('option');
        option.setAttribute('value', s.key);
        option.innerHTML = s.value;
        dropdown.appendChild(option);
    });
    document.getElementById('chart-' + index).insertAdjacentHTML('beforebegin', dropdown.outerHTML);
    var rendered = document.getElementById('hc-dropdown-' + index);
    rendered.value = window.optionsCollection[index].initialCategory;
    rendered.onchange = function(e){
        updateChart(index, this.value);
    }
};