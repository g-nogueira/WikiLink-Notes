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
let notes = [];

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
            notes = obj.notes || [];
            let temp = obj.notes || [];

            temp.forEach(function (element) {
                let notesArea = document.getElementById('notesArea');
                note = new Note({
                    title: element.title,
                    body: element.body,
                    id: element.id
                });
                notesArea.appendChild(note.htmlElement);
            }, this);
            if (temp.length === 0) {
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

    // chrome.storage.sync.get('popoverIsEnabled', obj => {
    //     pages.header.popoverCheckBox.checked = obj.popoverIsEnabled;
    //     if (obj.popoverIsEnabled === {}) {
    //         chrome.storage.sync.set({ 'popoverIsEnabled': true }, () => { });
    //     }
    // });

    // Add event listener to some button to toggle the menu on and off.
    document.querySelector('#goToOptions').addEventListener('click', () => menu.open = !menu.open)
}


//// onClick EVENTS ////

// pages.header.popoverCheckBox.onclick =
//     event => isPopoverActive(event.srcElement.checked);
// pages.header.optionsButton.onclick =
//     event => pages.toOptions();
// pages.header.saveNoteButton.onclick =
//     event => {
//         let tempNote = document.getElementById('tempNote');
//         let note = new Note({ title: newNote.titleElem.value, body: newNote.bodyElem.value });
//         if (tempNote)
//             note.removeNoteFromStorage(tempNote.value);
//         setTimeout(() => note.storeNote(), 500);
//         newNote.titleElem.value = '';
//         newNote.bodyElem.value = '';
//     };
// pages.header.noteCreationButton.onclick =
//     event => {
//         pages.toNoteCreation();
//         newNote.bodyElem.value = '';
//         newNote.titleElem.value = '';
//     };
// pages.header.gobackButton.onclick =
//     event => {
//         newNote.titleElem.value = '';
//         newNote.bodyElem.value = '';
//         pages.toNotesList();
//         loadNotes();
//     };
// getElement("#toNotesListPage2").onclick =
//     event => {
//         newNote.titleElem.value = '';
//         newNote.bodyElem.value = '';
//         pages.toNotesList();
//         loadNotes();
//     };
getElement('#searchInput').onkeyup =
    event => {
        let searchResult = [];

        searchResult = notes
            .filter(note => note.title.toLowerCase().includes(event.target.value.toLowerCase()))
            .map(note => new Note({ title: note.title, body: note.body, id: note.id }));

        loadNotes(searchResult);

    };