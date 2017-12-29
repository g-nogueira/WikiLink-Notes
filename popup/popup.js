"use strict";

/*******************************************************
 * on class Note.htmlElement
 *      >titleSpan.onclick needs to be implemented correctly;
 * 
 *******************************************************/

initializeLayout();
loadNotes();

const pages = new Pages();
const newNote = {
    titleElem: utils.getElement('#noteTitleSection'),
    bodyElem: utils.getElement('#noteBodySection')
};

function isPopoverActive(isActive = true) {
    chrome.storage.sync.set({ 'popoverIsEnabled': isActive }, () => {
        console.log(`Settings to WikiLinkPanelPopover toggleable is saved to: ${isActive}`);
    });
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
/**
 * 
 * @param {Array} notes - A list of Note object
 */
function loadNotes(notesList = []) { //⚠ Changed to "displayNotes"
    const notesArea = utils.getElement("#notesArea");

    //If it is already loaded, reload the UI
    if (notesList.length !== 0) {
        utils.removeChildNodes(notesArea);

        notesList.forEach(function (el) {
            notesArea.appendChild(el.htmlElement);
        }, this);
    }
    //else, get notes from cloud
    else {
        utils.getNotes(obj => {
            utils.removeChildNodes(notesArea);
            let note;
            let notes = obj.notes || [];

            notes.forEach(function (note) {
                note = new Note({
                    title: note.title,
                    body: note.body,
                    id: note.id
                });
                notesArea.appendChild(note.htmlElement);
            }, this);
            if (notes.length === 0) {
                let textNode = document.createTextNode('There aren\'t any notes to show here...');
                notesArea.appendChild(textNode);
            }
        });
    }

}
function initializeLayout() {
    const MDCComponent = mdc.base.MDCComponent;
    const MDCFoundation = mdc.base.MDCFoundation;
    const MDCTextfield = mdc.textfield.MDCTextfield;
    const MDCTextfieldFoundation = mdc.textfield.MDCTextfieldFoundation;
    const menu = new mdc.menu.MDCSimpleMenu(document.querySelector('.mdc-simple-menu'));

    chrome.storage.sync.get('popoverIsEnabled', obj => {
        pages.header.popoverCheckBox.checked = obj.popoverIsEnabled;
        if (obj.popoverIsEnabled === {}) {
            chrome.storage.sync.set({ 'popoverIsEnabled': true }, () => { });
        }
    });

    // Add event listener to some button to toggle the menu on and off.
    document.querySelector('#goToOptions').addEventListener('click', () => menu.open = !menu.open)
}

/*************************************************
 *              IMPLEMENTATION
 * ✔ 1.
 * ✖ 2.
 * 
 * 
 *************************************************/


//// onClick EVENTS ////

pages.header.popoverCheckBox.onclick =
    event => isPopoverActive(event.srcElement.checked);
pages.header.optionsButton.onclick =
    event => pages.toOptions();
pages.header.saveNoteButton.onclick =
    event => {
        let tempNote = utils.getElement('#tempNote');
        let note = new Note({ title: newNote.titleElem.value, body: newNote.bodyElem.value });
        if (tempNote)
            note.removeNoteFromStorage(tempNote.value);
        setTimeout(() => note.storeNote(), 500);
        newNote.titleElem.value = '';
        newNote.bodyElem.value = '';
    };
pages.header.noteCreationButton.onclick =
    event => {
        pages.toNoteCreation();
        newNote.bodyElem.value = '';
        newNote.titleElem.value = '';
    };
pages.header.gobackButton.onclick =
    event => {
        newNote.titleElem.value = '';
        newNote.bodyElem.value = '';
        pages.toNotesList();
        loadNotes();
    };

utils.getElement("#toNotesListPage2").onclick =
    event => {
        newNote.titleElem.value = '';
        newNote.bodyElem.value = '';
        pages.toNotesList();
        loadNotes();
    };

let notes = [];
pages.header.searchNoteButton.onclick =
    event => {
        event.target.classList.add('hidden');
        utils.getElement('#closeSearchInput').classList.remove('hidden');
        pages.getNotes()
            .then(response => {
                pages.header.searchNoteInput.classList.remove('hidden');
                notes = response;
                pages.header.searchNoteInput.focus();
            });

    };
pages.header.searchNoteInput.onkeyup =
    event => {
        let searchResult = [];

        searchResult = notes
            .filter(note => note.title.toLowerCase().includes(event.target.value.toLowerCase()))
            .map(note => new Note({ title: note.title, body: note.body, id: note.id }));

        loadNotes(searchResult);

    };
utils.getElement('#closeSearchInput').onclick =
    event => {
        pages.header.searchNoteInput.classList.add('hidden');
        event.target.classList.add('hidden');
        pages.header.searchNoteButton.classList.remove('hidden');

    };
utils.getElement('#expandWindowsButton').onclick =
    event => {
        let popoutUrl = chrome.runtime.getURL("popout/popout.html");
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
            }
            pages.toNoteCreation();
        });
    };