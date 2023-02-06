var logs = [];

document.onmouseover = function (event) {
    if (event === undefined) event = window.event;
    var target = 'target' in event ? event.target : event.srcElement;

    var bgColor = target.style.backgroundColor;
    var BGcolor = target.parentNode.style.backgroundColor;

    target.style.backgroundColor = "yellow";
    target.parentNode.style.backgroundColor = "red";
    target.style.cursor = "crosshair";


    document.onmouseout = function (event) {
        if (event === undefined) event = window.event;
        var target = 'target' in event ? event.target : event.srcElement;

        target.style.backgroundColor = bgColor;
        target.parentNode.style.backgroundColor = BGcolor;
    }

}

document.onclick = function (event) {
    if (event === undefined) event = window.event;
    var target = 'target' in event ? event.target : event.srcElement;

    event.preventDefault();

    var root = document.compatMode === 'CSS1Compat' ? document.documentElement : document.body;
    var mxy = [event.clientX + root.scrollLeft, event.clientY + root.scrollTop];

    console.log(target);
    var path = getPathTo(target);
    var txy = getPageXY(target);
    var message = 'You clicked the element ' + path;
    logs.push(message);

    for (let i = 0; i < logs.length; i++) {
        console.log(logs[i]);
    }


    chrome.storage.sync.set({ "Logs": logs }, function () {
        console.log("Logs Saved");
    });



}

function getPathTo(element) {

    if (element.tagName.toLowerCase().includes('html')) {
        return "//" + element.tagName.toLowerCase();
    }

    if (element.id !== '')
        return "//" + element.tagName.toLowerCase() + "[@id='" + element.id + "']";

    let impAtts = "class,role,aria-label,name";

    let attsString = "";

    let path = "//" + element.tagName.toLowerCase();
    let atts = element.getAttributeNames();

    if (atts.length > 0) {

        for (let i = 0; i < atts.length; i++) {
            if (impAtts.includes(atts[i])) {
                attsString = attsString + "@" + atts[i] + "='" + element.getAttribute(atts[i]) + "',"
            }
        }

        if (attsString == '') {
            var ix = 0;
            var siblings = element.parentNode.childNodes;
            for (var i = 0; i < siblings.length; i++) {

                var sibling = siblings[i];

                if (sibling === element) return getPathTo(element.parentNode) + '//' + element.tagName.toLowerCase() + '[' + (ix + 1) + ']';

                if (sibling.nodeType === 1 && sibling.tagName === element.tagName) {
                    ix++;
                }
            }
        }

        var attributes = attsString.split(',')

        console.log(attsString);

        if (attributes.length === 2) {
            path = path + "[" + attributes[0] + "]";
        }

        else if (attributes.length > 2) {
            for (let i = 0; i < attributes.length - 1; i++) {
                if (i === 0) {
                    path = path + "[" + attributes[i] + " and ";
                }
                else if (i === attributes.length - 2) {
                    path = path + attributes[i] + "]";
                }
                else {
                    path = path + attributes[i] + " and ";
                }
            }
        }

        if (element.className !== '') {
            if (document.getElementsByClassName(element.className).length > 1) {
                let temp = path.substring(0, path.lastIndexOf(']'));
                if (element.innerText !== '') {
                    temp = temp + " and text()='" + element.innerText + "']";
                    return temp;
                }
                return getPathTo(element.parentNode) + path;
            }
            else {
                return path;
            }
        }

    }

}

function getPageXY(element) {
    var x = 0, y = 0;
    while (element) {
        x += element.offsetLeft;
        y += element.offsetTop;
        element = element.offsetParent;
    }
    return [x, y];
}