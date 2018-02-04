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
     * @summary It creates an eventless note node.
     * @param {string} id The id of the note.
     * @param {string} title The title of the note.
     * @param {string} date The date that the note was created on.
     * @returns {DocumentFragment} The document fragment containing the note node.
     */
    createNoteNode(id, title, date) {
        const node =
            `<div id="${id}" class="noteItem">
            <section id="noteLeftSection" class="noteTitle">
                <span id="title">${title}</span>
            </section>
            <section id="noteRightSection" class="noteItemSection">
                <span id="date" class="noteDate">${date}</span>
                <i id="deleteBtn" class="material-icons deleteIcon pointer hidden" title="Delete">clear</i>
            </section>
        </div>`;
        return document.createRange().createContextualFragment(node);
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
        const notesFragment = document.createDocumentFragment();

        notes.forEach(note => {
            const temp = this.createNoteNode(note.id, note.title, note.createdOn)
            const node = createNoteEvents(temp, note);
            notesFragment.appendChild(node);
        });
        this.mainSection.appendChild(notesFragment);

        function createNoteEvents(noteNode, note) {
            const clone = noteNode.cloneNode(true);
            const noteItem = clone.getElementById(note.id);
            const leftSection = clone.getElementById('noteLeftSection');
            const rightSection = clone.getElementById('noteRightSection');
            const deleteBtn = clone.getElementById('deleteBtn');

            noteItem.addEventListener('mouseenter', onmouseenter);
            noteItem.addEventListener('mouseleave', onmouseleave);
            deleteBtn.addEventListener('click', ondelete);
            leftSection.addEventListener('click', onclick);

            function onmouseenter() {
                deleteBtn.classList.remove('hidden');
            }
            function onmouseleave() {
                deleteBtn.classList.add('hidden');
            }
            function onclick() {
                uiUtils.showPage('noteEdition');
                uiNoteEdition.setValues({ id: note.id, title: note.title, body: note.body });
                notesManager.cachedNote.set({ note: note, noteStatus: 'note' });
            }
            function ondelete() {
                const notesArea = document.getElementById('notesArea');
                notesArea.removeChild(document.getElementById(note.id));
                notesManager.note.delete(note.id).then(() => {
                    const notification = document.querySelector('.mdl-js-snackbar');
                    notification.MaterialSnackbar.showSnackbar({ message: `Note "${note.title}" deleted!` });
                });
            }

            return clone;
        }
    }

    appendDrafts(drafts) {
        const draftsFragment = document.createDocumentFragment();
        drafts.forEach(draft => {
            const temp = this.createNoteNode(draft.id, draft.title, draft.createdOn)
            const node = createNoteEvents(temp, draft);
            draftsFragment.appendChild(node);
        });
        this.draftsSection.appendChild(draftsFragment);

        function createNoteEvents(noteNode, draft) {
            const clone = noteNode.cloneNode(true);
            const noteItem = clone.getElementById(draft.id);
            const leftSection = clone.getElementById('noteLeftSection');
            const rightSection = clone.getElementById('noteRightSection');
            const deleteBtn = clone.getElementById('deleteBtn');

            noteItem.addEventListener('mouseenter', onmouseenter);
            noteItem.addEventListener('mouseleave', onmouseleave);
            deleteBtn.addEventListener('click', ondelete);
            leftSection.addEventListener('click', onclick);

            function onmouseenter() {
                deleteBtn.classList.remove('hidden');
            }
            function onmouseleave() {
                deleteBtn.classList.add('hidden');
            }
            function onclick() {
                uiUtils.showPage('noteEdition');
                uiNoteEdition.setValues({ id: draft.id, title: draft.title, body: draft.body });
                notesManager.cachedNote.set({ note: draft, noteStatus: 'draft' });
            }
            function ondelete() {
                const draftsArea = document.getElementById('draftsArea');
                draftsArea.removeChild(document.getElementById(draft.id));
                notesManager.draft.delete(draft.id).then(() => {
                    const notification = document.querySelector('.mdl-js-snackbar');
                    notification.MaterialSnackbar.showSnackbar({ message: `Draft "${draft.title}" deleted!` });
                });
            }

            return clone;
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