(function () {
    'using strict';

    const CONFIG_SEARCHON = {
        wikipedia: {},
        wiktionary: {},
        youtube: {}
    };
    const HTML = {
        select_MainInfosource: {},
        select_mainLanguage: {},
        chkbx_wpThumbnail: {}
    };

    getElements(
        [['#mainInfoSource', '#mainLanguage', '#wikipedia-showThumbnail'], HTML],
        [['#searchOn_wp', '#searchOn_wt', '#searchOn_yt'], CONFIG_SEARCHON]
    );

    //#region onClick Events
    HTML.select_mainLanguage.onchange = (event) => storage().set({ 'mainLanguage': event.srcElement.value }, () => console.log('mainLanguage Chaged'));
    HTML.select_MainInfosource.onchange = (event) => storage().set({ 'mainInfoSource': event.srcElement.value }, () => console.log('mainInfoSource Chaged'));
    HTML.chkbx_wpThumbnail.onclick = (event) => storage().set({ 'wikipedia-showThumbnail': event.srcElement.checked }, () => console.log('Wikipedia Thumbnail Chaged'));

    //#region SearchOn Option
    CONFIG_SEARCHON.wikipedia.onclick = (event) => storage().set({
        'actionMenu-searchOn':
        {
            wikipedia: event.srcElement.checked,
            wiktionary: CONFIG_SEARCHON.wiktionary.checked,
            youtube: CONFIG_SEARCHON.youtube.checked
        }
    }, () => console.log(`actionMenu-search -Wikipedia- Saved`));

    CONFIG_SEARCHON.wiktionary.onclick = (event) => storage().set({
        'actionMenu-searchOn':
        {
            wikipedia: CONFIG_SEARCHON.wiktionary.checked,
            wiktionary: event.srcElement.checked,
            youtube: CONFIG_SEARCHON.youtube.checked
        }
    }, () => console.log(`actionMenu-search -Wiktionary- Saved`));

    CONFIG_SEARCHON.youtube.onclick = (event) => storage().set({
        'actionMenu-searchOn':
        {
            wikipedia: CONFIG_SEARCHON.wikipedia.checked,
            wiktionary: CONFIG_SEARCHON.wiktionary.checked,
            youtube: event.srcElement.checked
        }
    }, () => console.log(`actionMenu-search -Youtube- Saved`));
    //#endregion

    //#endregion

    function storage() {
        const strg = chrome.storage.sync;

        return {
            get: get,
            set: set
        };

        function get(key, callback) {
            strg.get(key, obj => callback(obj));
        }

        function set(keyValueObj, callback) {
            strg.set(keyValueObj, () => callback());
        }
    }

    /**
     * @description It assigns html elements (array) to object children;
     * @param {[[],{}]} vars
     */
    function getElements(...vars) {
        vars.forEach(element => {
            let i = 0;
            for (var key in element[1]) {
                element[1][key] = getElement(element[0][i]);
                i++;
            }
            i = 0;
        });
    }

    function getElement(identifier) {
        return document.querySelector(identifier);
    }
})();