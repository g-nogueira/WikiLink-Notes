(function () {
    "use strict";

    /*******************************************************
     * on class Note.htmlElement
     *      >titleSpan.onclick needs to be implemented correctly; SOLVED (I guess...)
     * 
     *******************************************************/

    initializeLayout();
    loadNotes();

    const newNote = {
        titleElem: document.getElementById('noteTitleArea'),
        bodyElem: document.getElementById('noteBodyArea')
    };

    //#region Implementation
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
            while (notesArea.hasChildNodes()) {
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
    //#endregion

    //#region Classes
    class Note {
        /**
         * 
         * @param {Object} config - new note details
         * @param {String} config.title - new note title
         * @param {String} config.body - new note text body
         * @param {Date} config.id - new note text body
         */
        constructor(config) {
            this.title = config.title;
            this.body = config.body;
            this.id = config.id || (new Date()).getTime();
            this.createdOn = (new Date(this.id)).toLocaleDateString();
        }

        get htmlElement() {
            let noteItem = document.createElement('div');
            let section = document.createElement('section');
            let dateSpan = document.createElement('span');
            let titleSpan = document.createElement('span');
            let btnSpan = document.createElement('span');
            let delBtn = document.createElement('button');
            let delIcon = document.createElement('i');

            noteItem.classList.add('noteItem');
            noteItem.setAttribute('id', this.id);

            titleSpan.classList.add('noteTitle');
            titleSpan.appendChild(document.createTextNode(this.title));
            titleSpan.onclick = () => {
                pages.toNoteCreation();
                getElement('#noteTitleArea').value = this.title;
                newNote.bodyElem.value = this.body;

                let span = document.createElement('span');
                span.setAttribute('id', 'tempNote');
                span.value = this.id;
                document.body.appendChild(span);
            };

            section.classList.add('noteItemSection');
            section.appendChild(dateSpan);
            section.appendChild(delIcon);

            dateSpan.classList.add('noteDate');
            dateSpan.appendChild(document.createTextNode(this.createdOn));

            delIcon.classList.add('material-icons', 'deleteIcon', 'btn');
            delIcon.setAttribute('title', 'Delete');
            delIcon.appendChild(document.createTextNode('clear'));
            delIcon.onclick = () => {
                removeNoteElement(this);
                this.removeNoteFromStorage(this.id);
            };

            noteItem.appendChild(titleSpan);
            noteItem.appendChild(section);

            return noteItem;

            function removeNoteElement(self) {
                let div = document.getElementById(`${self.id}`)
                div.parentNode.removeChild(div);
            }
        }
        removeNoteFromStorage(id) {
            chrome.storage.sync.get('notes', keyValueArray => {
                let notes = keyValueArray.notes || [];
                let newNotes = [];
                let i;
                let notesDeleted = 0;
                for (i = 0; i < notes.length; i++) {
                    if (notes[i].id == id) {
                        newNotes = notes.slice(0, i);
                        console.log(`Note deleted: ${notes.slice(i + 1)}`);
                        newNotes = newNotes.concat(notes.slice(i + 1));
                        notesDeleted++;
                    }
                }
                newNotes = notesDeleted !== 0 ? newNotes : notes;
                console.log(`Notes after deleted note: ${JSON.stringify(newNotes)}`)
                chrome.storage.sync.set({ 'notes': newNotes });
            });
        }
        storeNote() {
            let storage = [];
            chrome.storage.sync.get('notes', keyValueObj => {
                storage = keyValueObj.notes || [];
                storage.push(this);

                chrome.storage.sync.set({ 'notes': storage }, (obj) => {
                    console.log(`Notes saved! ${JSON.stringify(storage)}`);
                });
            });
        }
    }
    class Pages {
        constructor() {
        }

        get header() {
            return {
                popoverCheckBox: getElement('#wlWindowIsActive'),
                optionsButton: getElement('#goToOptPage'),
                gobackButton: getElement('#toNotesListPage'),
                saveNoteButton: getElement('#saveNotes'),
                noteCreationButton: getElement('#toNewNotePage'),
                searchNoteButton: getElement("#searchNoteBtn"),
                searchNoteInput: getElement("#searchNoteInput")
            };
        }
        getNotes() {
            return new Promise((resolve, reject) => {
                chrome.storage.sync.get('notes', keyValueObj => {
                    resolve(keyValueObj.notes);
                });
            });
        }
        toNoteCreation() {
            document.getElementById('newNotePage')
                .classList.remove('hidden');
            document.getElementById('notesListPage')
                .classList.add('hidden');
        }
        toNotesList() {
            document.getElementById('notesListPage')
                .classList.remove('hidden');
            document.getElementById('newNotePage')
                .classList.add('hidden');
        }
        toOptions() {
            if (chrome.runtime.openOptionsPage) {
                // New way to open options pages, if supported (Chrome 42+).
                chrome.runtime.openOptionsPage();
            } else {
                // Reasonable fallback.
                window.open(chrome.runtime.getURL('../optionsPage/main.html'));
            }
        }
    }
    //#endregion

    //// onClick EVENTS ////
    const pages = new Pages();

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


})();