'using strict';

/************************************************************
 *                       NOTES
 * ✖✔⚠
 * ⚠ SINGLETON Class
 * 
 * 
 ************************************************************/

class UINotesList {
    constructor() {
        this.mainSection = document.getElementById('notesArea');
        this.draftsSection = document.getElementById('draftsArea');
        this.createNoteBtn = document.getElementById('createNoteBtn');
        this.popoverChkbx = document.getElementById('popoverChkbx');
        this.showNotesBtn = document.getElementById('notesBtn');
        this.showTempsBtn = document.getElementById('tempsBtn');
        this.searchField = {
            openBtn: document.getElementById('searchNoteBtn'),
            input: document.getElementById('searchNoteInput'),
            closeBtn: document.getElementById('closeSearchInput')
        };
    }

    /**
     * @summary Removes all children nodes from notesArea.
     */
    clearMainSection() {
        uiUtils.removeChildNodes(this.mainSection);
    }

    /**
     * @summary Removes all children nodes from draftsArea
     */
    clearDraftsSection() {
        uiUtils.removeChildNodes(this.draftsSection);
    }


    /**
     * @summary
     * @param {Object[]} notes The notes array to load in the page
     */
    setProperties(notes) {
        //It will save the current noteId in cache
    }

    /**
     * @summary It gets the noteModel element and generate a note html based on the model.
     * @param {Object} params 
     * @param {String} type The element to be generated.
     * @param {number} params.id The id of the item.
     * @param {String} params.title The title of a noteLabel.
     * @param {String} params.date The date of a noteLabel.
     * @param {function} params.deleteEvent The function expression to be executed on delete button click.
     * @param {function} params.onclick The function expression to be executed on click.
     * @returns {Node}
     */
    elementGenerator(type, params) {
        return ({ noteLabel: noteLabel })[type]();

        function noteLabel(title = params.title, date = params.date, onclick = params.onclick, deleteEvent = params.deleteEvent) {
            const noteModel = document.getElementById('noteModel').cloneNode(true);
            const noteLeftSection = noteModel.children.noteLeftSection;
            const noteRightSection = noteModel.children.noteRightSection;

            noteModel.setAttribute('id', params.id);
            noteModel.classList.remove('hidden');
            noteModel.onmouseenter = onmouseenter;
            noteModel.onmouseleave = onmouseleave;

            noteLeftSection.onclick = onclick;

            noteRightSection.children.deleteBtn.onclick = deleteEvent;
            noteRightSection.children.date.appendChild(document.createTextNode(date));
            noteLeftSection.children.title.appendChild(document.createTextNode(title));

            function onmouseenter() {
                noteRightSection.children.deleteBtn.classList.remove('hidden');
            }
            function onmouseleave() {
                noteRightSection.children.deleteBtn.classList.add('hidden');
            }
            
            return noteModel;
        }
    }

    /**
     * 
     * @param {object[]} notes 
     * @param {string} notes[].title
     * @param {string} notes[].body
     * @param {string} notes[].createdOn
     * @param {string} notes[].id
     */
    appendNotes(notes) {
        notes.forEach(note => {
            const html = generateHtml.apply(this, [note]);
            this.mainSection.appendChild(html);
        });

        function generateHtml(note) {
            return this.elementGenerator('noteLabel', {
                id: note.id,
                title: note.title,
                date: note.createdOn,
                onclick: () => {
                    uiUtils.showPage('noteEdition');
                    uiNoteEdition.setValues({ id: note.id, title: note.title, body: note.body });
                    notesManager.cachedNote.set({ note: note, noteStatus: 'note' });
                },
                deleteEvent: () => {
                    const notesArea = document.getElementById('notesArea');
                    notesArea.removeChild(document.getElementById(note.id));
                    notesManager.note.delete(note.id).then(() => {
                        const notification = document.querySelector('.mdl-js-snackbar');
                        notification.MaterialSnackbar.showSnackbar({ message: `Note "${note.title}" deleted!` });
                    });
                }
            });
        }
    }

    appendDrafts(drafts) {
        drafts.forEach(draft => {
            const html = generateHtml.apply(this, [draft]);
            this.draftsSection.appendChild(html);
        });

        function generateHtml(draft) {
            return this.elementGenerator('noteLabel', {
                id: draft.id,
                title: draft.title,
                date: draft.createdOn,
                onclick: () => {
                    uiUtils.showPage('noteEdition');
                    uiNoteEdition.setValues({ id: draft.id, title: draft.title, body: draft.body });
                    notesManager.cachedNote.set({ note: draft, noteStatus: 'draft' });
                },
                deleteEvent: () => {
                    const draftsArea = document.getElementById('draftsArea');
                    draftsArea.removeChild(document.getElementById(draft.id));
                    notesManager.draft.delete(draft.id).then(() => {
                        const notification = document.querySelector('.mdl-js-snackbar');
                        notification.MaterialSnackbar.showSnackbar({ message: `Draft "${draft.title}" deleted!` });
                    });
                }
            });
        }
    }

    /**
     * @summary Appends a html element on the main section of the page.
     * @param {*} element 
     */
    appendChild(element) {
        this.mainSection.appendChild(element);
    }
}

const uiNotesList = new UINotesList();