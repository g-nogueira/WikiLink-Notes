(function () {
    "use strict";

    var doc = document;

    chrome.tabs.onActivated.addListener(activeInfo => {
        //alert('Tab changed') It works
        //chrome.tabs.executeScript({code: ''}, function callback);
        chrome.tabs.get(activeInfo.tabId, function (tab) {
            var t = tab;
            chrome.windows.get(tab.windowId, window => {
                let w = window;
            });
        });
        enableEventListener();
        doc = document;
        doc.addEventListener("selectstart", function () {
            alert("Selection started on -onselectstart-");
        });

    });

    doc.onselectstart = function () {
        alert("Selection started on -onselectstart-");
    };

    function enableEventListener() {
    }

    function verifySelection() {
        //document.addEventListener("selectstart", () => { alert('Selection Started') });
    }

})();