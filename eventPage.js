(function () {
    "use strict";

    initializeDB();

    function initializeDB() {
        manager.retrieve('language').then(obj => {
            if (typeof obj !== 'string')
                manager.update({ key: 'language', value: 'us' });
        });

        manager.retrieve('notes').then(obj => {
            if (!Array.isArray(obj))
                manager.update({ key: 'notes', value: [] });
        });

        manager.retrieve('popover').then(obj => {
            if (typeof obj !== 'object')
                manager.update({ key: 'popover', value: {isEnabled: true, shortcuts: []}});
        });

        manager.retrieve('wikipedia-showThumbnail').then(obj => {
            if (typeof obj !== 'boolean')
                manager.update({ 'wikipedia-showThumbnail': true });
        });

        manager.retrieve('drafts').then(obj => {
            if (!Array.isArray(obj))
                manager.update({ key: 'drafts', value: [] });
        });
    }

    chrome.contextMenus.create({
        title: 'Search \"%s\" on Wikipedia',
        contexts: ["selection"],
        onclick: function (info) {
            const url = `http://www.wikipedia.org/w/index.php?title=Special:Search&search=${info.selectionText}`;
            chrome.tabs.create({ url: url });
        }

    });

})();