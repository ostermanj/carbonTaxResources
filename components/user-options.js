import createDropdown from './dropdown.js';
import createRadio from './radio.js';

export default function(options){
    
    if (options.userOptions){
        if (options.userOptions.type === 'dropdown') {
            createDropdown(options);
        } else {
            createRadio(options);
        }
    }
}