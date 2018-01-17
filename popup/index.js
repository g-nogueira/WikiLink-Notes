(function () {
    'using strict';


    initializeMDC();
    initializeEvents();
    displayNotes();
    displayTempNotes();


    /*************************************************************************************
     *                              IMPLEMENTATION                                       *
     *                                                                                   *
     * These functions are responsible for initializing DOM Events callbacks and         *
     * Material Design Components.                                                       *
     *                                                                                   *
     *                                                                                   *
     *************************************************************************************/


    async function displayNotes() {
        uiNotesList.clearMainSection();
        const notes = await manager.retrieve('notes')
        if (notes.length === 0)
            uiNotesList.mainSection.appendChild(document.createTextNode('It looks like you do not have written notes. 😕'));
        else
            uiNotesList.appendNotes(notes);
    }

    async function displayTempNotes() {
        uiNotesList.clearTempsSection();
        const notes = await manager.retrieve('tempNotes');
        if (notes.length === 0)
            uiNotesList.tempNotesSection.appendChild(document.createTextNode('It looks like you do not have drafts. 😕'));
        else
            uiNotesList.appendNotes(notes, true);
    }

    function initializeEvents() {

        observeMainPage();
        observeNotesArea();
        observeTempNotesArea();

        uiNotesList.showNotesBtn.onclick = ev => uiUtils.showPage('notesArea');
        uiNotesList.showTempsBtn.onclick = ev => uiUtils.showPage('tempNotes');
        uiNotesList.searchField.openBtn.onclick = ev => searchFieldActions('open', ev);
        uiNotesList.searchField.input.onkeyup = ev => searchFieldActions('search', ev);
        uiNotesList.searchField.closeBtn.onclick = ev => searchFieldActions('close', ev);
        uiNotesList.createNoteBtn.onclick = ev => noteCreationAction(ev);

        uiNoteEdition.backBtn.onclick = ev => backButtonAction(ev);
        uiNoteEdition.saveNoteBtn.onclick = ev => saveNoteAction(ev);

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

    }

    function observeMainPage() {
        const observer = new MutationObserver(ev => {
            if (ev[0].oldValue.includes('hidden')) //If notesArea is set to not hidden, load notes.
            {
                displayNotes();
                displayTempNotes();
            }
        });
        observer.observe(document.getElementById('page-notesList'), { attributes: true, attributeFilter: ['class'], attributeOldValue: true });
    }

    function observeTempNotesArea() {
        const observer = new MutationObserver(ev => {
            if (ev[0].oldValue.includes('hidden')) //If notesArea is set to not hidden, load notes.
                displayTempNotes();
        });
        observer.observe(uiNotesList.tempNotesSection, { attributes: true, attributeFilter: ['class'], attributeOldValue: true });
    }

    function observeNotesArea() {
        const observer = new MutationObserver(ev => {
            if (ev[0].oldValue.includes('hidden')) //If notesArea is set to not hidden, load notes.
                displayNotes();
        });
        observer.observe(uiNotesList.mainSection, { attributes: true, attributeFilter: ['class'], attributeOldValue: true });
    }

    async function saveNoteAction(event) {
        const tempNote = await uiNoteEdition.tempNote('get');
        const isDraft = JSON.parse(tempNote.isDraft) || false;
        const note = {
            id: tempNote.id,
            title: uiNoteEdition.titleElem.value,
            body: uiNoteEdition.bodyElem.value,
        };
        uiNoteEdition.saveNote(note, {isNew: !tempNote.id, isDraft: isDraft});
        uiNoteEdition.tempNote('delete');
    }

    function noteCreationAction(event) {
        uiNoteEdition.setValues({ title: '', body: '' });
        uiUtils.showPage('noteEdition');
    }

    async function backButtonAction(event) {
        const tempNote = await uiNoteEdition.tempNote('get');
        const isDraft = JSON.parse(tempNote.isDraft) || false;
        //If it does not have an id, the user clicked to create a new note
        if (tempNote.id) {
            const note = {
                id: tempNote.id,
                title: uiNoteEdition.titleElem.value,
                body: uiNoteEdition.bodyElem.value,
                createdOn: tempNote.createdOn
            };
            await manager.update({ key: isDraft ? 'tempNotes' : 'notes', value: note, id: tempNote.id });
        }
        else {
            const note = {
                title: uiNoteEdition.titleElem.value,
                body: uiNoteEdition.bodyElem.value,
            };
            await uiNoteEdition.saveNote(note, {isNewDraft: true});
        }

        uiNoteEdition.tempNote('delete');
        uiUtils.showPage('notesList');
        uiUtils.showPage(isDraft ? 'tempNotes' : 'notesList');
    }

    async function searchFieldActions(action, event) {

        const notes = await manager.retrieve('notes');
        ({
            close: event => {
                uiNotesList.searchField.input.classList.add('hidden');
                event.target.classList.add('hidden');
                uiNotesList.searchField.openBtn.classList.remove('hidden');
                displayNotes();
            },
            open: event => {
                event.target.classList.add('hidden');
                uiNotesList.searchField.closeBtn.classList.remove('hidden');
                uiNotesList.searchField.input.classList.remove('hidden');
                uiNotesList.searchField.input.focus();
            },
            search: event => {
                const searchResult = notes.filter(note => note.title.toLowerCase().includes(event.target.value.toLowerCase()));
                uiNotesList.clearMainSection();
                uiNotesList.appendNotes(searchResult);
            }
        })[action](event);
    }

    ///Function not refactored yet
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