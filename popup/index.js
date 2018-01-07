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
        const notesArea = utils.getElement("#notesArea");
        uiNotesList.reloadPage();
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
                        uiNoteEdition.setProperties({ title: note.title || '', body: note.body || '' });
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