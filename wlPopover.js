/*
#### DOM manipulation, data input and output ####
@------------------------------------------------@
| It creates a div element at the displayed page |
| DOM, as well as two cals, for padding sakes.   |
| Gets the ranges of these elements and listen to|
| the onMouseUp event, that gets to selected     |
| text, parses it and request data to the API.   |
| The response will be displayed into a popover. |
|                                                |
|It depends on: css/popover.css                  |
|                                                |
| Known issues:                                  |
| - The popover closes wherever you click,       |
| trigged by the onMouseDown event; Gonna fix it.|
| - The popover hasn't a fixed size; Easy fix... |
|                                                |
|                       ♥                        |
@------------------------------------------------@
*/

(function () {
    "use strict";
    
    var previous = null;    //The previous selected text will keep stored for 2 seconds;
    var rel1, rel2;         //Range of Cals;
    var div;                //The popover inserted;
    var sel = window.getSelection();

    //Immediately insert the cals, the popover div and get their ranges;
    insertCals();
    getRanges();    
    insertDiv();

    document.onmouseup = function () {
        if (!sel.isCollapsed)
            searchSelected();
    };

    document.onmousedown = function () {
        hideDiv();
    }

    function searchSelected() {
        let selText = checkSelection(sel.toString());
        if (selText != previous) {
            showData(selText);
            previous = selText;
            AutoResetPrevious();
        }
    }

    function AutoResetPrevious() {
        setTimeout(function (previous) {
            previous = null;
        }, 2000);
    }

    function checkSelection(text) {
        if (text)
            if (/\S/.test(text))
                return text;
        return previous;
    }

    //Request API should be here.
    function showData(term) {
        div.textContent = term;
        showDiv();
    }

    function insertDiv() {       
        div = document.createElement('div');
        div.setAttribute('class', 'wikilink-popover');
        div.setAttribute('id', 'wikilink-popover');
        document.body.appendChild(div);
    }

    function insertCals() {
        let cal1 = document.createElement('div');
        cal1.setAttribute('id', 'cal1');
        cal1.textContent = '\xa0';
        document.body.appendChild(cal1);
        let cal2 = document.createElement('div');
        cal2.setAttribute('id', 'cal2');
        cal2.textContent = '\xa0';
        document.body.appendChild(cal2);
    }

    function getRanges() {
        rel1 = document.createRange();
        rel1.selectNode(document.getElementById('cal1'));
        rel2 = document.createRange();
        rel2.selectNode(document.getElementById('cal2'));
    }

    function showDiv() {
        let r = sel.getRangeAt(0).getBoundingClientRect();
        let rb1 = rel1.getBoundingClientRect();
        let rb2 = rel2.getBoundingClientRect();
        div.style.top = (r.bottom - rb2.top) * 100 / (rb1.top - rb2.top) + 'px';
        div.style.left = (r.left - rb2.left) * 100 / (rb1.left - rb2.left) + 'px';
        div.style.display = 'block';
    }

    function hideDiv() {
        div.style.display = "none";
    }

})();