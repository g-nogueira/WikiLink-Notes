'using strict';




/************************************************************
 *                       NOTES
 * 
 * ⚠ SINGLETON Class
 * 
 * ✔ 1. ReloadPage function working.
 * ✔ 2. SetProperties function working.
 * ✖ 3. SaveNote function unfinished.
 * 
 * 
 ************************************************************/
class UINoteEdition {
    constructor() {
        this.titleElem = document.getElementById('noteTitleSection');
        this.bodyElem = document.getElementById('noteBodySection');
        this.saveNoteBtn = document.getElementById('saveNote');
        this.backBtn = document.getElementById('noteCreationbtn-back');
    }

    /**
     * @summary Sets all the values in the page to default.
     */
    reloadPage() {
        this.titleElem.value = "";
        this.bodyElem.value = "";
    }


    /**
     * @summary
     * @param {Object} prop The properties to set in the page.
     * @param {number} prop.id The note id.
     * @param {String} prop.title The note title.
     * @param {String} prop.body The note body.
     */
    setValues(prop) {
        //⚠ It will save the current noteId in cache
        this.titleElem.value = prop.title;
        this.bodyElem.value = prop.body;
    }

    /**
     * 
     * @param {object} note The note object to be saved.
     * @param {String} note.title The title of the note.
     * @param {String} note.body The text body of the note.
     * @param {String} [note.createdOn] The date that the note was created.
     * @param {String} [note.id] The id of the note to update. If none provided, it will create a new note.
     */
    async saveNote(note, params = { isNew: false, isDraft: false , isNewDraft: false}) {

        const newNote = {
            title: note.title,
            body: note.body,
            createdOn: note.createdOn || ''
        }

        if (params.isNew && !note.id) {
            newNote.createdOn = (new Date((new Date()).getTime())).toLocaleDateString();
            manager.push('notes', newNote).then(() => { });
        }
        else if (params.isDraft && !params.isNew) {
            const notesArea = document.getElementById('tempNotesArea');
            notesArea.removeChild(document.getElementById(note.id));
            const notes = await manager.retrieve('tempNotes');
            let oldNote = notes.find(el => el.id == note.id);
            oldNote.title = note.title;
            oldNote.body = note.body;
            await manager.push('notes', oldNote);
            window.alert(`Note ${note.title} created! :D`);
            manager.delete('tempNotes', note.id);
        }
        else if (params.isNewDraft && !note.id) {
            newNote.createdOn = (new Date((new Date()).getTime())).toLocaleDateString();
            manager.push('tempNotes', newNote).then(() => { });
        }
        else if (!params.isDraft && note.id)
            manager.update({ key: 'notes', value: newNote, id: note.id });

    }

    /**
     * 
     * @param {String} method The method to perform.
     * @param {String} method "get" "set" "delete".
     * @param {object} [note] The temporary note.
     * @param {String} note.title The title of the note.
     * @param {String} note.createdOn 
     * @param {String} note.body The body of the note.
     * @param {String} note.id The id of the note.
     * @returns {Promise}
     */
    tempNote(method, note, isDraft = false) {
        return ({
            get: () => {
                const id = sessionStorage.getItem('id');
                const createdOn = sessionStorage.getItem('createdOn');
                const isDraft = sessionStorage.getItem('isDraft');
                return {
                    id: id,
                    createdOn: createdOn,
                    isDraft: isDraft
                };
            },
            set: () => {
                sessionStorage.setItem('id', note.id);
                sessionStorage.setItem('createdOn', note.createdOn);
                sessionStorage.setItem('isDraft', isDraft);
            },
            delete: () => {
                sessionStorage.removeItem('id');
                sessionStorage.removeItem('createdOn');
                sessionStorage.removeItem('isDraft');
            },
        })[method](note);

    }
}

const uiNoteEdition = new UINoteEdition();