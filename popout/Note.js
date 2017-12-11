'using strict';

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
            getElement('#noteBodySection').value = this.title;
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
        dateSpan.classList.add('hidden');
        dateSpan.appendChild(document.createTextNode(this.createdOn));

        delIcon.classList.add('material-icons', 'deleteIcon', 'pointer');
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