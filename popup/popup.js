(function () {
    "use strict";

    chrome.storage.sync.get('popoverIsEnabled', obj => {
        optElements.
            wLPopup.checked = obj.popoverIsEnabled;
        if (obj.popoverIsEnabled === {}) {
            chrome.storage.sync.set({ 'popoverIsEnabled': true }, () => { });
        }
    });
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

            dateSpan.classList.add('noteDate');
            dateSpan.appendChild(document.createTextNode(this.createdOn));

            titleSpan.classList.add('noteTitle');
            titleSpan.appendChild(document.createTextNode(this.title));

            
            section.appendChild(dateSpan);
            section.appendChild(titleSpan);
            
            delIcon.classList.add('material-icons', 'deleteIcon');
            delIcon.appendChild(document.createTextNode('clear'));
            delBtn.classList.add('mdc-button', 'mdc-button--dense');
            delBtn.appendChild(delIcon);
            delBtn.onclick = () => {
                removeNoteElement(this);
                removeNoteFromStorage(this);
            };
            btnSpan.classList.add('delBtn');
            btnSpan.appendChild(delBtn);

            noteItem.appendChild(section);
            noteItem.appendChild(btnSpan);



            return noteItem;

            function removeNoteElement(self) {
                let div = document.getElementById(`${self.id}`)
                div.parentNode.removeChild(div);
            }
            function removeNoteFromStorage(self) {
                chrome.storage.sync.get('notes', keyValueArray => {
                    let notes = keyValueArray.notes;
                    let newNotes = [];
                    let i;
                    for (i = 0; i < notes.length; i++) {
                        if (notes[i].id == self.id) {
                            newNotes = notes.slice(0, i);
                            console.log(notes.slice(i + 1));
                            newNotes = newNotes.concat(notes.slice(i + 1));
                        }
                    }
                    chrome.storage.sync.set({ 'notes': newNotes });
                });
            }
        }
        storeNote() {
            let storage = [];
            chrome.storage.sync.get('notes', (keyValueObj) => {
                storage = keyValueObj.notes;
                storage.push(this);
                console.log(JSON.stringify(storage));

                chrome.storage.sync.set({ 'notes': storage }, () => {
                    console.log(`Notes saved!`);
                });
            });
        }
    }
    class Pages {
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
    }

    displayNotes();

    var optElements = {
        wLPopup: {},
        optLink: {},
        toNotesListPage: {},
    };
    var newNote = {
        titleElem: {},
        bodyElem: {},
        saveBtn: {},
        newNoteBtn: {}
    };



    getElements(
        [['#wlWindowIsActive', '#goToOptions', '#toNotesListPage'], optElements],
        [['#notesTitle', '#notesBody', '#saveNotes', '#toNewNotePage',], newNote]
    );

    //// onClick EVENTS ////
    var pages = new Pages();

    optElements.wLPopup.onclick =
        event => isPopoverActive(event.srcElement.checked);
    optElements.optLink.onclick =
        () => redirectToOptions();
    newNote.saveBtn.onclick =
        () => {
            (new Note({ title: newNote.titleElem.value, body: newNote.bodyElem.value })).storeNote()
            newNote.titleElem.value = '';
            newNote.bodyElem.value = '';
        };
    newNote.newNoteBtn.onclick =
        () => pages.toNoteCreation();
    optElements.toNotesListPage.onclick =
        () => {
            pages.toNotesList();
            displayNotes();
        };



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
            obj.notes.forEach(function (element) {
                let notesArea = document.getElementById('notesArea');
                let note = new Note({
                    title: element.title,
                    body: element.body,
                    id: element.id
                });
                notesArea.appendChild(note.htmlElement);
            }, this);
        });

    }
    function initializeElemValues() {
        chrome.storage.sync.get('popoverIsEnabled', obj => {
            optElements.
                wLPopup.checked = obj.popoverIsEnabled;
            if (obj.popoverIsEnabled === {}) {
                chrome.storage.sync.set({ 'popoverIsEnabled': true }, () => { });
            }
        });
    }
    //#endregion

})();