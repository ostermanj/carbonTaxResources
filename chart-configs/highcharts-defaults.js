function addNote(){
    if (this.userOptions.note && this.userOptions.note !== ''){
        this.noteSpan = document.createElement('span');
        this.noteSpan.setAttribute('class','highcharts-note');
        this.noteSpan.setAttribute('style','position: absolute; margin-left: 0px; margin-top: 0px; left: 0px; bottom:0');
        this.noteSpan.innerText = this.userOptions.note;
        this.container.appendChild(this.noteSpan);
        console.log(this.container.offsetHeight, this.noteSpan.offsetHeight, this.container.style);
        adjustContainerSize.call(this);
    }   
}
function adjustContainerSize(){
    if (this.userOptions.note && this.userOptions.note !== ''){
        this.container.style.paddingBottom = ( this.noteSpan.offsetHeight + 10 ) + 'px'; 
    }
}
export const HighchartsDefaults = {
    lang: {
          thousandsSep: ','
    },
    chart: {
        backgroundColor: 'none',
        events: {
          load: addNote,
          redraw: adjustContainerSize
        }
    },
    credits: {
        text: 'Resources for the Future',
        position: {
            align: 'center',                     
        },
        href: '//www.rff.org' 
    },
    title: {
        align: 'left',
        margin: 57,
        x:-10
    },
    subtitle: {
        align: 'left',
        x:-10,
        
    },
    
    legend: {
        padding:13

    }
};