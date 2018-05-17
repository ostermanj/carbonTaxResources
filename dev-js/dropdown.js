export const CreateDropdown = function(index){
    var dict = [
        ['baseline', 'No carbon tax'],
        ['twenty-five', '$25/ton tax'],
        ['fifty', '$50/ton tax']
    ];
    var dropdown = document.createElement('select');
    dropdown.setAttribute('id','hc-dropdown-' + index);
    dict.forEach((s,i) => {
        var option = document.createElement('option');
        option.setAttribute('value', s[0]);
        option.innerHTML = s[1];
        option.setAttribute('active', i === 0);
        dropdown.appendChild(option);
    });
    document.getElementById('chart-' + index).insertAdjacentHTML('beforebegin', dropdown.outerHTML);
    document.getElementById('hc-dropdown-' + index).onchange = function(e){
        updateChart(index, this.value, e.target.options[e.target.options.selectedIndex].innerText.toLowerCase());
    }
};