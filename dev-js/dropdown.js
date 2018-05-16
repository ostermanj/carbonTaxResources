export const CreateDropdown = function(){
    var dict = [
        ['baseline', 'No carbon tax'],
        ['twenty-five', '$25/ton tax'],
        ['fifty', '$50/ton tax']
    ];
    var dropdown = document.createElement('select');
    dropdown.setAttribute('id','hc-dropdown-0');
    dict.forEach((s,i) => {
        var option = document.createElement('option');
        option.setAttribute('value', s[0]);
        option.innerHTML = s[1];
        option.setAttribute('active', i === 0);
        dropdown.appendChild(option);
    });
    document.getElementById('chart-0').insertAdjacentHTML('beforebegin', dropdown.outerHTML);
    document.getElementById('hc-dropdown-0').onchange = function(e){
        updateChart(this.value, e);
    }
};