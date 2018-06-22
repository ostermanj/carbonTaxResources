import createDropdown from './dropdown.js';
import createRadio from './radio.js';

export default function(options, i){
    
    if (options.userOptions){
        if (options.userOptions.type === 'dropdown') {
            createDropdown(options, i);
        } else {
            createRadio(options, i);
        }
    }
}