(function () {
    'using strict';

    const CHKBXGROUP_SEARCHON = {
        wikipedia: {},
        wiktionary: {},
        youtube: {}
    };
    const HTML = {
        select_MainInfosource: {},
        select_mainLanguage: {},
        chkbx_wpThumbnail: {}
    };

    getElements([
        [['#mainInfoSource', '#mainLanguage','#wikipedia-showThumbnail'], HTML],
        [['#searchOn_wp','#searchOn_wt', '#searchOn_yt'], CHKBXGROUP_SEARCHON]
    ]);

    //#region onClick Events
    HTML.select_mainLanguage.onchange = (event) => storage().set({ 'mainLanguage': event.srcElement.value }, () => console.log('mainLanguage Chaged'));
    HTML.select_MainInfosource.onchange = (event) => storage().set({ 'mainInfoSource': event.srcElement.value }, () => console.log('mainInfoSource Chaged'));
    HTML.chkbx_wpThumbnail.onclick = (event) => storage().set({ 'wikipedia-showThumbnail': event.srcElement.checked }, () => console.log('Wikipedia Thumbnail Chaged'));

    //#region SearchOn Option
    CHKBXGROUP_SEARCHON.wikipedia.onclick = (event) => storage().set({
        'actionMenu-searchOn':
        {
            wikipedia: event.srcElement.checked,
            wiktionary: CHKBXGROUP_SEARCHON.wiktionary.checked,
            youtube: CHKBXGROUP_SEARCHON.youtube.checked
        }
    }, () => console.log(`actionMenu-search -Wikipedia- Saved`));

    CHKBXGROUP_SEARCHON.wiktionary.onclick = (event) => storage().set({
        'actionMenu-searchOn':
        {
            wikipedia: CHKBXGROUP_SEARCHON.wiktionary.checked,
            wiktionary: event.srcElement.checked,
            youtube: CHKBXGROUP_SEARCHON.youtube.checked
        }
    }, () => console.log(`actionMenu-search -Wiktionary- Saved`));

    CHKBXGROUP_SEARCHON.youtube.onclick = (event) => storage().set({
        'actionMenu-searchOn':
        {
            wikipedia: CHKBXGROUP_SEARCHON.wikipedia.checked,
            wiktionary: CHKBXGROUP_SEARCHON.wiktionary.checked,
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

    function getElements(...vars) {
        vars.forEach(groupsVars => {
            groupsVars.forEach(element => {
                let i= 0;
                for (var key in element[1]) {
                    element[1][key] = getElement(element[0][i]);
                    i++;
                }
                i = 0;
            });
        });
    }

    function getElement(identifier) {
        return document.querySelector(identifier);
    }
})();