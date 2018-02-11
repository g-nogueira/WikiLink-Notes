'using strict';

class NotesManager {
    constructor() { }

    get note() {
        return {
            create: createNote,
            retrieve: getNote,
            update: updateNote,
            trash: trashNote
        };

        /**
         * @summary
         * @param {String} title 
         * @param {String} body 
         */
        async function createNote(title, body) {

            return new Promise((resolve, reject) => {
                const newNote = {
                    title: title,
                    body: body,
                    createdOn: ''
                }

                newNote.createdOn = (new Date((new Date()).getTime())).toLocaleDateString();
                manager.push('notes', newNote).then(note => resolve(note));
            });
        }

        /**
         * @summary
         * @param {String} id Id of the note to get. If not specified, returns all notes.
         */
        async function getNote(id) {
            return new Promise(async (resolve, reject) => {
                const notes = await manager.retrieve('notes');
                const note = notes.find(note => note.id == id);

                note ? resolve(note) : resolve(notes);
            });
        }

        /**
         * @summary Updates a chosen note with provided params.
         * @summary Absent paramenters will be filled with last valid values.
         * @param {object} note The new parameters values of the chosen note.
         */
        async function updateNote(id, note) {
            return new Promise(async (resolve, reject) => {
                const oldNote = await this.retrieve(id);
                const newNote = {
                    title: note.title,
                    body: note.body,
                    createdOn: oldNote.createdOn
                }

                manager.update({ key: 'notes', value: newNote, id: id })
                    .then(note => resolve(note));
            });
        }

        /**
         * @summary Deletes a note from storage.
         * @param {String} id The id of the note to delete
         */
        async function deleteNote(id) {
            return new Promise((resolve, reject) => {
                manager.delete('notes', id)
                    .then(note => resolve(note));
            });
        }

        /**
         * @summary Sends a note to trash.
         * @param {String} id The id of the note to trash.
         */
        async function trashNote(id) {
            const note = await getNote(id);
            await deleteNote(id);
            return new Promise((resolve, reject) => {
                manager.push('trash', note)
                    .then(note => resolve(note));
            });
        }
    }

    get draft() {
        return {
            create: createDraft,
            retrieve: getDraft,
            update: updateDraft,
            delete: deleteDraft
        };


        /**
         * @summary
         * @param {String} title 
         * @param {String} body 
         */
        async function createDraft(title, body) {

            return new Promise((resolve, reject) => {
                const newDraft = {
                    title: title,
                    body: body,
                    createdOn: ''
                }

                newDraft.createdOn = (new Date((new Date()).getTime())).toLocaleDateString();
                manager.push('drafts', newDraft).then(draft => resolve(draft));
            });
        }

        /**
         * @summary
         * @param {String} id Id of the draft to get. If not specified, returns all drafts.
         */
        async function getDraft(id) {
            return new Promise(async (resolve, reject) => {
                const notes = await manager.retrieve('drafts');
                const note = notes.find(note => note.id == id);

                note ? resolve(note) : resolve(notes);
            });
        }

        /**
         * @summary Updates a chosen note with provided params.
         * @summary Absent paramenters will be filled with last valid values.
         * @param {object} note The new parameters values of the chosen note.
         */
        async function updateDraft(id, draft) {
            return new Promise(async (resolve, reject) => {
                const oldDraft = await this.retrieve(id);
                const updatedDraft = {
                    title: draft.title,
                    body: draft.body,
                    createdOn: draft.createdOn
                }

                manager.update({ key: 'drafts', value: updatedDraft, id: id })
                    .then(note => resolve(note));
            });
        }

        /**
         * @summary
         * @param {String} id The id of the draft to delete.
         */
        async function deleteDraft(id) {
            return new Promise((resolve, reject) => {
                manager.delete('drafts', id)
                    .then(note => resolve(note));
            });
        }

    }

    get cachedNote() {
        return {
            /**
             * @summary Retrieves the note and note status from temporary storage.
             * @returns {object} A note object.
             */
            get: () => {
                const id = sessionStorage.getItem('id');
                const createdOn = sessionStorage.getItem('createdOn');
                const noteStatus = sessionStorage.getItem('noteStatus');
                const note = { id: id, createdOn: createdOn, status: noteStatus };

                return note;
            },
            /**
             * @param {object} params
             * @param {string} params.noteStatus The status of the note. 'new', 'draft', 'note'.
             * @param {object} params.note The note to cache.
             * @param {string} params.note.id The id of the note.
             * @param {string} params.note.createdOn The date of creation of the note.
             */
            set: (params) => {
                const note = params.note || { id: '', createdOn: '' };
                const noteStatus = params.noteStatus;

                sessionStorage.setItem('id', note.id);
                sessionStorage.setItem('createdOn', note.createdOn);
                sessionStorage.setItem('noteStatus', noteStatus);
            },
            /**
             * @summary Removes the note from from temporary storage.
             */
            delete: () => {
                sessionStorage.removeItem('id');
                sessionStorage.removeItem('createdOn');
                sessionStorage.setItem('noteStatus', '');
            },
        };
    }

    get trash() {
        return {
            retrieve: getNote,
            permDelete: permDeleteNote
        };
        /**
         * @summary
         * @param {String} id Id of the note to get from the trash. If not specified, returns all notes.
         */
        async function getNote(id) {
            return new Promise(async (resolve, reject) => {
                const notes = await manager.retrieve('trash');
                const note = notes.find(note => note.id == id);

                note ? resolve(note) : resolve(notes);
            });
        }

        /**
         * @summary
         * @param {String} id The id of the note to permanently delete.
         */
        async function permDeleteNote(id) {
            return new Promise((resolve, reject) => {
                manager.delete('trash', id)
                    .then(note => resolve(note));
            });
        }

    }
}

const notesManager = new NotesManager();