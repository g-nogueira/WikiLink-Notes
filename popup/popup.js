(function () {
    "use strict";

    chrome.storage.sync.get('popoverIsEnabled', obj => {
        optElements.
            wLPopup.checked = obj.popoverIsEnabled;
        if (obj.popoverIsEnabled === {}) {
            chrome.storage.sync.set({ 'popoverIsEnabled': true }, () => { });
        }
    });

    var optElements = {
        wLPopup: {},
        optLink: {}
    };
    var notes = {
        titleElem: {},
        bodyElem: {},
        saveBtn: {}
    };

    getElements(
        [['#wlWindowIsActive', '#goToOptions'], optElements],
        [['#notesTitle', '#notesBody', '#saveNotes'], notes]
    );

    //// INPUTS EVENTS ////
    optElements.wLPopup.
        onclick = (event) => setPopoverState(event.srcElement.checked);
    optElements.optLink.
        onclick = (event) => redirectToOptions();
    notes.saveBtn
        .onclick = (event) => saveNotes(
            {
                title: notes.titleElem.value,
                body: notes.bodyElem.value
            }
        );


    //// EVENTS FUNCTIONS ////
    function setPopoverState(isActive = true) {
        chrome.storage.sync.set({ 'popoverIsEnabled': isActive }, () => {
            console.log(`Settings to WikiLinkPanelPopover toggleable is saved to: ${isActive}`);
        });
    }

    function saveNotes(noteContent) {
        // let storage = [noteContent];
        let storage = [];
        chrome.storage.sync.get('notes', (obj) => {
            storage = obj.notes;
            console.log(`Notes before:\n${JSON.stringify(storage)}`);
            storage.push(noteContent);
            console.log(`Notes after:\n${JSON.stringify(storage)}`);

            chrome.storage.sync.set({ 'notes': storage }, () => {
                console.log(`Notes saved!`);
            });
        });

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


    function redirectToOptions() {
        if (chrome.runtime.openOptionsPage) {
            // New way to open options pages, if supported (Chrome 42+).
            chrome.runtime.openOptionsPage();
        } else {
            // Reasonable fallback.
            window.open(chrome.runtime.getURL('../optionsPage/main.html'));
        }
    }
})();