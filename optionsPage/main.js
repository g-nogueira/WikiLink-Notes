(function () {
    'using strict';

    const CHKBX_WPTHUMBNAIL = getElement('#wikipedia-showThumbnail');
    const SELECT_MAINLANGUAGE = getElement('#mainLanguage');
    const SELECT_MAININFOSOURCE = getElement('#mainInfoSource');
    const CHKBXGROUP_SEARCHON = {};

    //#region var Initialization
    CHKBXGROUP_SEARCHON.wikipedia = getElement('#searchOn_wp');
    CHKBXGROUP_SEARCHON.wiktionary = getElement('#searchOn_wt');
    CHKBXGROUP_SEARCHON.youtube = getElement('#searchOn_yt');
    //#endregion

    //#region onClick Events
    SELECT_MAINLANGUAGE.onchange = (event) => storage().set({ 'mainLanguage': event.srcElement.value }, () => console.log('mainLanguage Chaged'));
    SELECT_MAININFOSOURCE.onchange = (event) => storage().set({ 'mainInfoSource': event.srcElement.value }, () => console.log('mainInfoSource Chaged'));
    CHKBX_WPTHUMBNAIL.onclick = (event) => storage().set({ 'wikipedia-showThumbnail': event.srcElement.checked }, () => console.log('Wikipedia Thumbnail Chaged'));

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

    function getElement(identifier) {
        return document.querySelector(identifier);
    }
})();