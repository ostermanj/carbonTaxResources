export default function(action,label){
    if ( window.ga !== undefined ){
        ga('send', 'event', 'dataviz', action, label);
    }
}