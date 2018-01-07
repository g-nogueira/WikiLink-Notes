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
    setProperties(prop) {
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
    saveNote(note) {
        const newNote = {
            title: note.title,
            body: note.body,
            createdOn: note.createdOn || ''
        }

        if (note.id) {
            manager.update({key: 'notes', value: newNote, id: note.id});
        }
        else{
            newNote.createdOn = (new Date((new Date()).getTime())).toLocaleDateString();;
            manager.push('notes', newNote).then(() => window.alert(`Note ${note.title} created! :D`));
        }
    }

    /**
     * 
     * @param {String} method The method to perform.
     * @param {String} method "get" "set" "delete".
     * @param {object} [note] The temporary note.
     * @param {String} note.title The title of the note.
     * @param {String} note.body The body of the note.
     * @param {String} note.id The id of the note.
     * @returns {Promise}
     */
    tempNote(method, note){
        return ({
            get: () => manager.retrieve('tempNote'),
            set: () => manager.create({tempNote: note}),
            delete: () => manager.create({tempNote: {}}),
        })[method](note);

    }
}

const uiNoteEdition = new UINoteEdition();