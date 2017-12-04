"use strict";

/*******************************************************
 * on class Note.htmlElement
 *      >titleSpan.onclick needs to be implemented correctly; SOLVED (I guess...)
 * 
 *******************************************************/

initializeLayout();
loadNotes();

const pages = new Pages();
const newNote = {
    titleElem: document.getElementById('noteTitleSection'),
    bodyElem: document.getElementById('noteBodySection')
};

function getElement(identifier) {
    return document.querySelector(identifier);
}
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
function loadNotes(notesList = []) {

    if (notesList.length !== 0) {
        while (getElement("#notesArea").hasChildNodes()) {
            notesArea.removeChild(notesArea.lastChild);
        }

        notesList.forEach(function (el) {
            let notesArea = document.getElementById('notesArea');
            notesArea.appendChild(el.htmlElement);
        }, this);
    }
    else {
        chrome.storage.sync.get('notes', obj => {
            while (notesArea.hasChildNodes()) {
                notesArea.removeChild(notesArea.lastChild);
            }
            let note;
            let notes = obj.notes || [];

            notes.forEach(function (element) {
                let notesArea = document.getElementById('notesArea');
                note = new Note({
                    title: element.title,
                    body: element.body,
                    id: element.id
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


//// onClick EVENTS ////

pages.header.popoverCheckBox.onclick =
    event => isPopoverActive(event.srcElement.checked);
pages.header.optionsButton.onclick =
    event => pages.toOptions();
pages.header.saveNoteButton.onclick =
    event => {
        let tempNote = document.getElementById('tempNote');
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

getElement("#toNotesListPage2").onclick =
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
        getElement('#closeSearchInput').classList.remove('hidden');
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
getElement('#closeSearchInput').onclick =
    event => {
        pages.header.searchNoteInput.classList.add('hidden');
        event.target.classList.add('hidden');
        pages.header.searchNoteButton.classList.remove('hidden');

    };
getElement('#expandWindowsButton').onclick =
    event => {
        let popoutUrl = chrome.runtime.getURL("popup/popout.html");
        chrome.tabs.query({ url: popoutUrl }, tabs => {
            if (tabs.length > 0) {
                chrome.windows.update(tabs[0].windowId, { 'focused': true },
                    () => {
                        chrome.tabs.update(tabs[0].id, { 'active': true })
                    })
            } else {
                chrome.windows.create({
                    'url': popoutUrl,
                    'type': 'popup',
                    'width': 640,
                    'height': 456
                })
            }
            pages.toNoteCreation();
        });
    };