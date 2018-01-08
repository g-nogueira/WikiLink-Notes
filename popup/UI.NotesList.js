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
        this.createNoteBtn = document.getElementById('createNoteBtn');
        this.popoverChkbx = document.getElementById('popoverChkbx');
    }

    /**
     * @summary Reload the list of notes.
     */
    clearMainSection() {
        uiUtils.removeChildNodes(this.mainSection);
    }


    /**
     * @summary
     * @param {Object[]} notes The notes array to load in the page
     */
    setProperties(notes) {
        //It will save the current noteId in cache
    }

    /**
     * 
     * @param {Object} params 
     * @param {String} type The element to be generated.
     * @param {number} params.id The id of the item.
     * @param {String} params.title The title of a noteLabel.
     * @param {String} params.date The date of a noteLabel.
     * @param {function} params.deleteEvent The function expression to be executed on delete button click.
     * @param {function} params.onclick The function expression to be executed on click.
     */
    elementGenerator(type, params) {
        const f = {
            noteLabel: noteLabel
        };

        return f[type]();

        function noteLabel(title = params.title, date = params.date, onclick = params.onclick, deleteEvent = params.deleteEvent) {
            const noteLabel = document.createElement('div');
            const noteLeftSection = document.createElement('section');
            const noteRightSection = document.createElement('section');


            noteLeftSection.onclick = onclick;
            noteLeftSection.classList.add('noteTitle');
            noteLeftSection.appendChild(((title) => {
                const titleSpan = document.createElement('span');
                titleSpan.appendChild(document.createTextNode(params.title));
                return titleSpan;
            })(title));

            noteRightSection.classList.add('noteItemSection');
            noteRightSection.appendChild((
                function getDateSpan(createdOn) {
                    const dateSpan = document.createElement('span');
                    dateSpan.classList.add('noteDate');
                    dateSpan.appendChild(document.createTextNode(createdOn));
                    return dateSpan;
                })(date));
            noteRightSection.appendChild((function getDelIcon(onclick) {
                const delIcon = document.createElement('i');
                delIcon.classList.add('material-icons', 'deleteIcon', 'pointer');
                delIcon.setAttribute('title', 'Delete');
                delIcon.appendChild(document.createTextNode('clear'));
                delIcon.onclick = onclick;
                return delIcon;
            })(deleteEvent));

            noteLabel.classList.add('noteItem');
            noteLabel.setAttribute('id', params.id);
            noteLabel.appendChild(noteLeftSection);
            noteLabel.appendChild(noteRightSection);

            return noteLabel;
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
            const html = this.elementGenerator('noteLabel', {
                id: note.id,
                title: note.title,
                date: note.createdOn,
                onclick: () => {
                    uiUtils.redirectToPage('noteEdition');
                    uiNoteEdition.setProperties({ id: note.id, title: note.title, body: note.body });
                    uiNoteEdition.tempNote('set', note);
                },
                deleteEvent: () => {
                    const div = document.getElementById(note.id)
                    div.parentNode.removeChild(div);
                    manager
                        .delete('notes', note.id)
                        .then(() => window.alert("Deleted"));
                }
            });
            this.mainSection.appendChild(html);
        });

    }

    /**
     * @summary Appends a html element on the main section of the page.
     * @param {*} element 
     */
    appendChild(element){
        this.mainSection.appendChild(element);
    }
}

const uiNotesList = new UINotesList();