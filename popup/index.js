(function () {
    'using strict';


    initializeMDC();
    initializeEvents();
    displayNotes();
    displayDrafts();


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
        const notes = await manager.retrieve('notes');
        if (notes.length !== 0)
            uiNotesList.appendNotes(notes);
        else
            uiNotesList.mainSection.appendChild(document.createTextNode('It looks like you do not have written notes. 😕'));
    }

    async function displayDrafts() {
        uiNotesList.clearDraftsSection();
        const drafts = await manager.retrieve('drafts');
        if (drafts.length !== 0)
            uiNotesList.appendDrafts(drafts);
        else
            uiNotesList.draftsSection.appendChild(document.createTextNode('It looks like you do not have drafts. 😕'));
    }

    function initializeEvents() {

        observeMainPage();
        observeNotesArea();
        observeTempNotesArea();


        uiNotesList.showNotesBtn.onclick = ev => uiUtils.showPage('notes');;
        uiNotesList.showTempsBtn.onclick = ev => uiUtils.showPage('drafts');;
        uiNotesList.searchField.openBtn.onclick = ev => searchFieldActions('open', ev);
        uiNotesList.searchField.input.onkeyup = ev => searchFieldActions('search', ev);
        uiNotesList.searchField.closeBtn.onclick = ev => searchFieldActions('close', ev);
        uiNotesList.createNoteBtn.onclick = ev => noteCreationBtn(ev);

        uiNoteEdition.backBtn.onclick = ev => backBtn(ev);
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
                displayDrafts();
            }
        });
        observer.observe(document.getElementById('page-notesList'), { attributes: true, attributeFilter: ['class'], attributeOldValue: true });
    }

    function observeTempNotesArea() {
        const observer = new MutationObserver(ev => {
            if (ev[0].oldValue.includes('hidden')) //If notesArea is set to not hidden, load notes.
            {
                displayDrafts();
                document.querySelector('.viewsBtns').style.background = 'linear-gradient(to left, #ffffffc2 50%, #80cbc4 50%)';
            }
        });
        observer.observe(uiNotesList.draftsSection, { attributes: true, attributeFilter: ['class'], attributeOldValue: true });
    }

    function observeNotesArea() {
        const observer = new MutationObserver(ev => {
            if (ev[0].oldValue.includes('hidden')) //If notesArea is set to not hidden, load notes.
            {
                displayNotes();
                document.querySelector('.viewsBtns').style.background = 'linear-gradient(to right, #ffffffc2 50%, #80cbc4 50%)';
            }
        });
        observer.observe(uiNotesList.mainSection, { attributes: true, attributeFilter: ['class'], attributeOldValue: true });
    }

    async function saveNoteAction(event) {
        const cachedNote = await notesManager.cachedNote.get();
        const noteStatus = cachedNote.status;
        const note = {
            id: '',
            title: uiNoteEdition.titleElem.value,
            body: uiNoteEdition.bodyElem.value,
        };

        ({
            new: async () => {
                await notesManager.note.create(note.title, note.body);
                displayToast(`Note "${note.title}" created!`);
                displayNotes();
            },
            draft: async () => {
                await notesManager.draft.delete(cachedNote.id);
                notesManager.note.create(note.title, note.body);
                displayDrafts();
            },
            note: async () => {
                await notesManager.note.update(cachedNote.id, note);
                displayToast(`Note "${note.title}" saved!`);
                displayNotes();
            }
        })[noteStatus]();

        notesManager.cachedNote.delete();
        uiNoteEdition.setValues({ title: '', body: '' });
        uiUtils.showPage('home');

    }

    function noteCreationBtn(event) {
        uiNoteEdition.setValues({ title: '', body: '' });
        notesManager.cachedNote.set({ noteStatus: 'new' });
        uiUtils.showPage('noteEdition');
    }

    async function backBtn(event) {
        const tempNote = await notesManager.cachedNote.get();
        const noteStatus = tempNote.status;
        const note = {
            id: '',
            title: uiNoteEdition.titleElem.value,
            body: uiNoteEdition.bodyElem.value,
            createdOn: tempNote.createdOn
        };

        ({
            new: async () => {
                if (note.body !== '' && note.title !== '')
                    await notesManager.draft.create(note.title, note.body);

                uiUtils.showPage('home');
                uiUtils.showPage('notes');
            },
            draft: async () => {
                await notesManager.draft.update(tempNote.id, note);
                uiUtils.showPage('home');
            },
            note: async () => {
                await notesManager.note.update(tempNote.id, note);
                uiUtils.showPage('home');
            }
        })[noteStatus]();

        notesManager.cachedNote.delete();
    }

    function displayToast(message) {
        const notification = document.querySelector('.mdl-js-snackbar');
        notification.MaterialSnackbar.showSnackbar({ message: message });
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

        document.getElementById('goToOptions').onclick = ev => menu.open = !menu.open;

        manager.retrieve('popover').then(popover => {
            if (typeof popover.isEnabled !== 'boolean') {
                uiNotesList.popoverChkbx.checked = true;
            } else uiNotesList.popoverChkbx.checked = popover.isEnabled;

        });
        // Add event listener to some button to toggle the menu on and off.
    }
})();