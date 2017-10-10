(function () {
    "use strict";

    var opts = {};



    chrome.runtime.onMessage.addListener(
        function (request, sender, sendResponse) {
            if (request.searchTerm) {
                sendResponse({ data: "Nenhum resultado encontrado para " + request.searchTerm });
            }
        });

    chrome.contextMenus.create({
        title: 'Search \"%s\" on Wikipedia',
        contexts: ["selection"],
        onclick: function (info) {
            // searchTerm(info.selectionText)
            let url = encodeURI(`http://www.wikipedia.org/w/index.php?title=Special:Search&search=${info.selectionText}`);
            // var url = encodeURI(localStorage["protocol"] + localStorage["language"] + ".wikipedia.org/w/index.php?title=Special:Search&search=" +info.selectionText);
            chrome.tabs.create({ url: url });
        }

    });

    function searchTerm(term) {
        var url = encodeURI(`http://www.wikipedia.org/w/index.php?title=Special:Search&search=${info.selectionText}`);
        // var url = encodeURI(localStorage["protocol"] + localStorage["language"] + ".wikipedia.org/w/index.php?title=Special:Search&search=" +info.selectionText);
        chrome.tabs.create({ url: url });
    }
})();