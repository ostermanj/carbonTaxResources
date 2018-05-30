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
function adjustYAxesTitlePositions(){
    this.yAxis.forEach(axis => {
        if ( axis.options.title.align === 'high' ){
            axis.axisGroup.element.className.baseVal = axis.axisGroup.element.className.baseVal + ' title-high';
        }
    });
}
function onLoadFunction(){
    addNote.call(this);
    adjustYAxesTitlePositions.call(this);
}

export const HighchartsDefaults = {
    lang: {
          thousandsSep: ','
    },
    chart: {
        backgroundColor: 'none',
        events: {
          load: onLoadFunction,
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

    },
    yAxis: {
        labels: {
            format: '{value:,.0f}'
        }
    }
};