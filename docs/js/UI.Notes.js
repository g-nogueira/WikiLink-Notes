'using strict';

/************************************************************
 *                       NOTES
 * ✖✔⚠
 * ⚠ SINGLETON Class
 * 
 * 
 ************************************************************/

class UINotes {
    constructor() {
        this.mainSection = document.getElementById('notesPage');
    }

    /**
     * @summary Removes all children nodes from notesArea.
     */
    clearMainSection() {
        uiUtils.removeChildNodes(this.mainSection);
    }

    /**
     * @summary It creates an eventless note node.
     * @param {string} id The id of the note.
     * @param {string} title The title of the note.
     * @param {string} date The date that the note was created on.
     * @returns {DocumentFragment} The document fragment containing the note node.
     */
    createNoteNode(note) {
        const node =
            `<div id="${note.id}" class="mdl-card mdl-shadow--2dp self-note--card">
            <div id="noteTitle" class="mdl-card__title pointer">
                <h2 class="mdl-card__title-text">${note.title}</h2>
            </div>
            <div class="self-mdl-card mdl-card__supporting-text">${note.body}</div>
            <div class="self-card--actions mdl-card__actions self-row">
                <section class="self-column card-note--dates">
                    <span>Modified: </span>
                    <span>Created: ${note.createdOn}</span>
                </section>
                <i id="deleteNote" class="material-icons pointer">delete</i>
            </div>
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
     * @requires ../repository/Manager.js
     * @requires UI.Utils.js
     */
    appendNotes(notes) {
        const notesFragment = document.createDocumentFragment();

        notes.forEach(note => {
            const temp = this.createNoteNode(note)
            const node = createNoteEvents(temp, note);
            notesFragment.appendChild(node);
        });
        this.mainSection.appendChild(notesFragment);

        function createNoteEvents(noteNode, note) {
            const clone = noteNode.cloneNode(true);
            const title = clone.getElementById('noteTitle');
            const deleteBtn = clone.getElementById('deleteNote');

            deleteBtn.addEventListener('click', ondelete);
            // title.addEventListener('click', onclick); //Not Working Yet ⚠

            function onclick() {
                uiUtils.showPage('noteEdition');
                uiNoteEdition.setValues({ id: note.id, title: note.title, body: note.body });
                notesManager.cachedNote.set({ note: note, noteStatus: 'note' });
            }
            function ondelete() {
                const notesArea = document.getElementById('notesPage');
                notesArea.removeChild(document.getElementById(note.id));
                notesManager.note.trash(note.id)
                    .then(() => {
                        const notification = document.querySelector('#selfToast');
                        notification.MaterialSnackbar.showSnackbar({ message: `"${note.title}" has been moved to the Trash!` });
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

const uiNotes = new UINotes();