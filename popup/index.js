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


    async function displayNotes() {
        uiNotesList.clearMainSection();
        const notes = await manager.retrieve('notes')
            .catch(reason => uiNotesList.appendChild(document.createTextNode('It looks like you do not have written notes. 😕')));
        uiNotesList.appendNotes(notes);
    }

    function writeNote() {
        uiNoteEdition.setValues({ title: '', body: '' });
        uiUtils.redirectToPage('noteEdition');
    }

    async function initializeEvents() {
        uiNotesList.createNoteBtn.onclick = event => {
            uiNoteEdition.setValues({ title: '', body: '' });
            uiUtils.redirectToPage('noteEdition');
        }

        uiNoteEdition.backBtn.onclick = async event => {
            const tempNote = await uiNoteEdition.tempNote('get');

            if (tempNote.id) {
                const note = {
                    id: tempNote.id,
                    title: uiNoteEdition.titleElem.value,
                    body: uiNoteEdition.bodyElem.value,
                    createdOn: tempNote.createdOn
                };

                await manager.update({ key: 'notes', value: note, id: tempNote.id });
            } else {
                const note = {
                    title: uiNoteEdition.titleElem.value,
                    body: uiNoteEdition.bodyElem.value,
                };
                uiNoteEdition.saveNote(note, true);
            }

            uiNoteEdition.tempNote('delete');
            displayNotes();
            uiUtils.redirectToPage('notesList');
        };

        uiNoteEdition.saveNoteBtn.onclick = event => {
            const note = {
                title: uiNoteEdition.titleElem.value,
                body: uiNoteEdition.bodyElem.value,
            };
            uiNoteEdition.saveNote(note);
            uiNoteEdition.tempNote('delete');
        };

        uiNotesList.showNotesBtn.onclick = () => uiUtils.redirectToPage('notesArea');
        uiNotesList.showTempsBtn.onclick = () => uiUtils.redirectToPage('tempNotes');


        //#region Not refactored yet
        uiNotesList.searchField.openBtn.onclick = event => {
            event.target.classList.add('hidden');
            uiNotesList.searchField.closeBtn.classList.remove('hidden');

            manager.retrieve('notes').then(list => {
                uiNotesList.searchField.input.classList.remove('hidden');
                notes = list.slice();
                uiNotesList.searchField.input.focus();
            });

        };
        uiNotesList.searchField.input.onkeyup = event => {
            let searchResult = [];

            manager.retrieve('notes').then(list => {
                const notes = list.slice();
                searchResult = notes.filter(note => note.title.toLowerCase().includes(event.target.value.toLowerCase()));
                uiNotesList.clearMainSection();
                uiNotesList.appendNotes(searchResult);
            });

        };

        uiNotesList.searchField.closeBtn.onclick = event => {
            uiNotesList.searchField.input.classList.add('hidden');
            event.target.classList.add('hidden');
            uiNotesList.searchField.openBtn.classList.remove('hidden');

        };

        document.getElementById('expandWindowsButton').onclick = event => {
            const popoutUrl = chrome.runtime.getURL("popout/popout.html");
            chrome.tabs.query({ url: popoutUrl }, tabs => {
                if (tabs.length > 0)
                    chrome.windows.update(
                        tabs[0].windowId,
                        { 'focused': true },
                        () => chrome.tabs.update(tabs[0].id, { 'active': true })
                    );
                else chrome.windows.create({ 'url': popoutUrl, 'type': 'popup' });
                //chrome.windows.create({ 'url': popoutUrl, // 'width': 640, // 'height': 456, 'type': 'popup' });
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

        manager.retrieve('popover').then(popover => {
            if (typeof popover.isEnabled !== 'boolean') {
                uiNotesList.popoverChkbx.checked = true;
            } else uiNotesList.popoverChkbx.checked = popover.isEnabled;

        });
        // Add event listener to some button to toggle the menu on and off.
    }
})();