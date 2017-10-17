(function () {
    "use strict";

    /*******************************************************
     * on class Note.htmlElement
     *      >titleSpan.onclick needs to be implemented correctly;
     * 
     * 
     * 
     * 
     * 
     *******************************************************/

    initializeElemValues();
    displayNotes();

    var newNote = {
        titleElem: {},
        bodyElem: {},
    };

    getElements(
        [['#noteTitleArea', '#noteBodyArea'], newNote]
    );

    //#region Implementation
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
    function displayNotes() {
        chrome.storage.sync.get('notes', obj => {
            while (notesArea.hasChildNodes()) {
                notesArea.removeChild(notesArea.lastChild);
            }
            let note;
            obj.notes.forEach(function (element) {
                let notesArea = document.getElementById('notesArea');
                note = new Note({
                    title: element.title,
                    body: element.body,
                    id: element.id
                });
                notesArea.appendChild(note.htmlElement);
            }, this);
            if (obj.notes.length === 0) {
                let textNode = document.createTextNode('There aren\'t any notes to show here...');
                notesArea.appendChild(textNode);
            }
        });

    }
    function initializeElemValues() {
        chrome.storage.sync.get('popoverIsEnabled', obj => {
            pages.header.popoverCheckBox.checked = obj.popoverIsEnabled;
            if (obj.popoverIsEnabled === {}) {
                chrome.storage.sync.set({ 'popoverIsEnabled': true }, () => { });
            }
        });
    }
    //#endregion
    //#region Classes
    class Note {
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

            delIcon.classList.add('material-icons', 'deleteIcon');
            delIcon.appendChild(document.createTextNode('clear'));
            delIcon.onclick = () => {
                removeNoteElement(this);
                this.removeNoteFromStorage(this.id);
            };

            // delBtn.classList.add('mdc-button', 'mdc-button--dense');
            // delBtn.appendChild(delIcon);

            // btnSpan.classList.add('delBtn');
            // btnSpan.appendChild(delBtn);

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
            chrome.storage.sync.get('notes', (keyValueObj) => {
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
                optionsButton: getElement('#goToOptions'),
                gobackButton: getElement('#toNotesListPage'),
                saveNoteButton: getElement('#saveNotes'),
                noteCreationButton: getElement('#toNewNotePage')
            };
            // let popoverCheckBox = getElement('#wlWindowIsActive');
            // let optionsButton = getElement('#goToOptions');
            // let gobackButton = getElement('#toNotesListPage');
            // let saveNoteButton = getElement('#saveNotes');
            // let noteCreationButton = getElement('#toNewNotePage');

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
    var pages = new Pages();
    //#endregion

    //// onClick EVENTS ////
    pages.header.popoverCheckBox.onclick =
        event => isPopoverActive(event.srcElement.checked);
    pages.header.optionsButton.onclick =
        () => pages.toOptions();
    pages.header.saveNoteButton.onclick =
        () => {
            let tempNote = document.getElementById('tempNote');
            let note = new Note({ title: newNote.titleElem.value, body: newNote.bodyElem.value });
            if (tempNote)
                note.removeNoteFromStorage(tempNote.value);
            setTimeout(() => note.storeNote(), 500);
            newNote.titleElem.value = '';
            newNote.bodyElem.value = '';
        };
    pages.header.noteCreationButton.onclick =
        () => {
            pages.toNoteCreation();
            newNote.bodyElem.value = '';
            newNote.titleElem.value = '';
        };
    pages.header.gobackButton.onclick =
        () => {
            newNote.titleElem.value = '';
            newNote.bodyElem.value = '';
            pages.toNotesList();
            displayNotes();
        };

})();