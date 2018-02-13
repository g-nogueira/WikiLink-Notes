'using strict';

/************************************************************
 *                       NOTES
 * ✖✔⚠
 * ⚠ SINGLETON Class
 * 
 * 
 ************************************************************/

class UIDrafts {
    constructor() {
        this.mainSection = document.getElementById('draftsPage');
    }

    /**
     * @summary Removes all children nodes from notesArea.
     */
    clearDrafts() {
        uiUtils.removeChildNodes(this.mainSection);
    }

    /**
     * @summary It creates an eventless note node.
     * @param {string} id The id of the note.
     * @param {string} title The title of the note.
     * @param {string} date The date that the note was created on.
     * @returns {DocumentFragment} The document fragment containing the note node.
     */
    createDraftNode(note) {
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
     * @param {object[]} drafts 
     * @param {string} drafts[].title
     * @param {string} drafts[].body
     * @param {string} drafts[].createdOn
     * @param {string} drafts[].id
     * @requires ../repository/Manager.js
     * @requires UI.Utils.js
     */
    appendDrafts(drafts) {
        const draftsFragment = document.createDocumentFragment();

        drafts.forEach(draft => {
            const temp = this.createDraftNode(draft)
            const node = createNoteEvents(temp, draft);
            draftsFragment.appendChild(node);
        });
        this.mainSection.appendChild(draftsFragment);

        function createNoteEvents(noteNode, draft) {
            const clone = noteNode.cloneNode(true);
            const title = clone.getElementById('noteTitle');
            const deleteBtn = clone.getElementById('deleteNote');

            deleteBtn.addEventListener('click', ondelete);
            // title.addEventListener('click', onclick); //Not Working Yet ⚠

            function onclick() {
                uiUtils.showPage('noteEdition');
                uiNoteEdition.setValues({ id: draft.id, title: draft.title, body: draft.body });
                notesManager.cachedNote.set({ note: draft, noteStatus: 'note' });
            }
            function ondelete() {
                const notesArea = document.getElementById('draftsPage');
                notesArea.removeChild(document.getElementById(draft.id));
                notesManager.draft.delete(draft.id)
                    .then(() => {
                        const notification = document.querySelector('#selfToast');
                        notification.MaterialSnackbar.showSnackbar({ message: `"${draft.title}" deleted!` });
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

const uiDrafts = new UIDrafts();