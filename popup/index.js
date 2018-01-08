(function () {
    'using strict';


    initializeMDC();
    initializeEvents();
    displayNotes();


    /*************************************************************************************
     *                              IMPLEMENTATION
     * ✔ 1. DisplayNotes function
     * ✔ 2. WriteNote function
     * ✖ 3. InitializeEvents function not finished: uiNoteEdition.saveBtn.onclick
     * 
     * 
     * 
     * 
     * 
     *************************************************************************************/



    function displayNotes() {
        uiNotesList.clearMainSection();

        manager
            .retrieve('notes')
            .then(notes => {
                uiNotesList.appendNotes(notes);
            })
            .catch(reason => uiNotesList.appendChild(document.createTextNode('It looks like you do not have written notes. 😕')));
    }

    function writeNote() {
        uiNoteEdition.setProperties({ title: '', body: '' });
        uiUtils.redirectToPage('noteEdition');
    }

    function initializeEvents() {
        uiNotesList.createNoteBtn.onclick =
            event => {
                uiNoteEdition.tempNote('get')
                    .then(note => {
                        uiNoteEdition.setProperties({ title: note.title, body: note.body });
                        uiUtils.redirectToPage('noteEdition');
                    })
                    .catch(reason => {
                        uiNoteEdition.setProperties({ title: '', body: '' });
                        uiUtils.redirectToPage('noteEdition');
                    });
            };

        uiNoteEdition.backBtn.onclick =
            event => uiUtils.redirectToPage('notesList');

        uiNoteEdition.saveNoteBtn.onclick =
            event => {
                uiNoteEdition.saveNote({
                    title: uiNoteEdition.titleElem.value,
                    body: uiNoteEdition.bodyElem.value,
                });
                uiNoteEdition.tempNote('delete');
            }


        //#region Not refactored yet
        document.getElementById('searchNoteBtn').onclick =
            event => {
                event.target.classList.add('hidden');
                document.getElementById('closeSearchInput').classList.remove('hidden');
                manager.retrieve('notes').then(list => {
                    document.getElementById('searchNoteInput').classList.remove('hidden');
                    notes = list.slice();
                    document.getElementById('searchNoteInput').focus();
                });

            };
        document.getElementById('searchNoteInput').onkeyup =
            event => {
                let searchResult = [];

                manager.retrieve('notes').then(list => {
                    const notes = list.slice();
                    searchResult = notes.filter(note => note.title.toLowerCase().includes(event.target.value.toLowerCase()));
                    uiNotesList.clearMainSection();
                    uiNotesList.appendNotes(searchResult);
                });

            };

        document.getElementById('closeSearchInput').onclick =
            event => {
                document.getElementById('searchNoteInput').classList.add('hidden');
                event.target.classList.add('hidden');
                document.getElementById('searchNoteBtn').classList.remove('hidden');

            };

        document.getElementById('expandWindowsButton').onclick =
            event => {
                const popoutUrl = chrome.runtime.getURL("popout/popout.html");
                chrome.tabs.query({ url: popoutUrl }, tabs => {
                    if (tabs.length > 0) {
                        chrome.windows.update(tabs[0].windowId, { 'focused': true },
                            () => {
                                chrome.tabs.update(tabs[0].id, { 'active': true })
                            })
                    } else {
                        chrome.windows.create({
                            'url': popoutUrl,
                            // 'width': 640,
                            // 'height': 456,
                            'type': 'popup'
                        })
                    };
                });
            };
        //#endregion

    }


    ///Function here just for testing
    function initializeMDC() {
        const MDCComponent = mdc.base.MDCComponent;
        const MDCFoundation = mdc.base.MDCFoundation;
        const MDCTextfield = mdc.textfield.MDCTextfield;
        const MDCTextfieldFoundation = mdc.textfield.MDCTextfieldFoundation;
        const menu = new mdc.menu.MDCSimpleMenu(document.querySelector('.mdc-simple-menu'));
        document.getElementById('goToOptions').onclick = () => menu.open = !menu.open;

        manager.retrieve('popover').then(isEnabled => {
            if (typeof isEnabled !== 'boolean') {
                uiNotesList.popoverChkbx.checked = true;
                manager.create({ 'popover': true }, () => { });
            } else uiNotesList.popoverChkbx.checked = isEnabled;

        });

        // Add event listener to some button to toggle the menu on and off.
    }
})();