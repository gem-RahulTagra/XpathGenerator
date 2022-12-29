document.onclick= function(event) {
    if (event===undefined) event= window.event;        
    var target= 'target' in event? event.target : event.srcElement;

    var root= document.compatMode==='CSS1Compat'? document.documentElement : document.body;
    var mxy= [event.clientX+root.scrollLeft, event.clientY+root.scrollTop];
    console.log(target);
    var path= getPathTo(target);
    var txy= getPageXY(target);
    var message = 'You clicked the element '+path+' at offset '+(mxy[0]-txy[0])+', '+(mxy[1]-txy[1]);
    alert(message);
}

function getPathTo(element) {
    let atts=element.getAttributeNames();
    console.log(atts);
    let path="//"+element.tagName.toLowerCase();
   
    if(atts.length===0){
        var ix= 0;
    var siblings= element.parentNode.childNodes;
    for (var i= 0; i<siblings.length; i++) {
        var sibling= siblings[i];
        
        if (sibling===element) return getPathTo(element.parentNode) + '/' + element.tagName.toLowerCase() + '[' + (ix + 1) + ']';
        
        if (sibling.nodeType===1 && sibling.tagName === element.tagName) {
            ix++;
        }
    }
    }

    else if(atts.length===1){
        path=path+"[@"+atts[0]+"='"+element.getAttribute(atts[0])+"']";
    }

    else{

    for(let i=0;i<atts.length;i++){
        if(i===0){
            path=path+"["+"@"+atts[i]+"='"+element.getAttribute(atts[i])+"' and ";
        }
        else if(i===atts.length-1){
        path=path+"@"+atts[i]+"='"+element.getAttribute(atts[i])+"'] ";
        }
        else{
            path=path+"@"+atts[i]+"='"+element.getAttribute(atts[i])+"' and ";
        }
    }

}
    return path;

    // if (element.id!=='')
    //     return "//"+element.tagName.toLowerCase()+"[@id='"+element.id+"']"; 

    // if(element.className!='')
    //     return "//"+element.tagName.toLowerCase()+"[@class='"+element.className+"']"; 

    // if (element===document.body)
    //     return element.tagName.toLowerCase();

    // var ix= 0;
    // var siblings= element.parentNode.childNodes;
    // for (var i= 0; i<siblings.length; i++) {
    //     var sibling= siblings[i];
        
    //     if (sibling===element) return getPathTo(element.parentNode) + '/' + element.tagName.toLowerCase() + '[' + (ix + 1) + ']';
        
    //     if (sibling.nodeType===1 && sibling.tagName === element.tagName) {
    //         ix++;
    //     }
    // }
}

function getPageXY(element) {
    var x= 0, y= 0;
    while (element) {
        x+= element.offsetLeft;
        y+= element.offsetTop;
        element= element.offsetParent;
    }
    return [x, y];
}