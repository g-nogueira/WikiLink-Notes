(function () {
    "use strict";

    chrome.storage.sync.get('popoverIsEnabled', obj => {
        optElements.
            wLPopup.checked = obj.popoverIsEnabled;
        if (obj.popoverIsEnabled === {}) {
            chrome.storage.sync.set({ 'popoverIsEnabled': true }, () => { });
        }
    });

    showNotes();

    var notes = [];

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
    optElements.wLPopup.onclick =
        (event) => setPopoverState(event.srcElement.checked);
    optElements.optLink.onclick =
        (event) => redirectToOptions();
    newNote.saveBtn.onclick =
        (event) => saveNote(
            {
                title: newNote.titleElem.value,
                body: newNote.bodyElem.value,
                id: (new Date()).getTime()
            }
        );

    newNote.newNoteBtn.onclick =
        event => {
            document.getElementById('notesListPage')
                .classList.add('hidden');

            document.getElementById('newNotePage')
                .classList.remove('hidden');
        }
    optElements.toNotesListPage.onclick =
        event => {
            document.getElementById('notesListPage')
                .classList.remove('hidden');

            document.getElementById('newNotePage')
                .classList.add('hidden');
        }

    //// EVENTS FUNCTIONS ////
    function setPopoverState(isActive = true) {
        chrome.storage.sync.set({ 'popoverIsEnabled': isActive }, () => {
            console.log(`Settings to WikiLinkPanelPopover toggleable is saved to: ${isActive}`);
        });
    }
    function saveNote(noteContent) {
        // let storage = [noteContent];
        let storage = [];
        chrome.storage.sync.get('notes', (obj) => {
            storage = obj.notes;
            storage.push(noteContent);
            console.log(JSON.stringify(storage));

            chrome.storage.sync.set({ 'notes': storage }, () => {
                console.log(`Notes saved!`);
            });
        });

    }

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
    function redirectToOptions() {
        if (chrome.runtime.openOptionsPage) {
            // New way to open options pages, if supported (Chrome 42+).
            chrome.runtime.openOptionsPage();
        } else {
            // Reasonable fallback.
            window.open(chrome.runtime.getURL('../optionsPage/main.html'));
        }
    }

    function showNotes() {
        chrome.storage.sync.get('notes', obj => {
            // let notesArea = getElement('.notesArea');

            obj.notes.forEach(function (element) {
                let noteItem = newNoteItem({ date: (new Date(element.id)).toLocaleDateString(), title: element.title, id: element.id });
                document.getElementById('notesArea').appendChild(noteItem);
            }, this);
        });

    }

    /**
     * 
     * @param {{date: '', title: '', id: number}} config
     */
    function newNoteItem(config) {
        let divNoteItem = document.createElement('div');
        let section = document.createElement('section');
        let spanDate = document.createElement('span');
        let spanTitle = document.createElement('span');
        let spanBtn = document.createElement('span');
        let delBtn = document.createElement('button');

        divNoteItem.setAttribute('class', 'noteItem');
        divNoteItem.setAttribute('id', config.id);

        spanDate.setAttribute('class', 'noteDate');
        spanDate.appendChild(document.createTextNode(config.date));
        // spanDate.setAttribute('value', config.date);

        spanTitle.setAttribute('class', 'noteTitle');
        spanTitle.appendChild(document.createTextNode(config.title));
        // spanTitle.setAttribute('value', config.title);

        spanBtn.setAttribute('class', 'delBtn');

        section.appendChild(spanDate);
        section.appendChild(spanTitle);

        delBtn.appendChild(document.createTextNode('Del'));
        delBtn.onclick = () => {
            let div = getElement(`#${config.id}`);
            div.parentNode.removeChild(div);            
            deleteNote(config.id);
        };
        spanBtn.appendChild(delBtn);

        divNoteItem.appendChild(section);
        divNoteItem.appendChild(spanBtn);

        return divNoteItem;
    }

    function deleteNote(id) {
        chrome.storage.sync.get('notes', obj => {
            let i = 0;
            let newNotes = [];
            newNotes = obj.notes;
            for (i = 0; i < obj.notes.length; i++) {
                if (obj.notes[i].id == id) {
                    newNotes.slice(i, i+1);
                }
            }
            console.log(`New notes to be stored: ${JSON.stringify(newNotes)}`);
            chrome.storage.sync.set({'notes': newNotes});
        });
    }
})();