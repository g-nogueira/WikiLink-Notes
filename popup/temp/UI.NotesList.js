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
        const notesSection = utils.getElement("#notesArea");
        const bodyElem = utils.getElement('#noteBodySection');
        const saveBtn = utils.getElement('#saveNotes');
    }

    /**
     * @summary Reload the list of notes.
     */
    reloadPage() {
        manager.retrieveAll('notes', notes => {
            utils.removeChildNodes(notesSection);
        });
    }


    /**
     * @summary
     * @param {Array} notes The notes array to load in the page
     */
    setProperties(notes) {
        //It will save the current noteId in cache

    }

    /**
     * 
     * @param {Object} params 
     * @param {String} params.type The element to be generated
     * @param {number} params.id The element to be generated
     * @param {String} params.title The title of a noteLabel
     * @param {Date} params.date The date of a noteLabel
     * @param {function} params.deleteEvent The function expression to be executed on delete button click.
     * @param {function} params.onclick The function expression to be executed on click.
     */
    generateHtml(params) {
        f[params.type]();

        const f = {
            noteLabel: noteLabel
        };

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
}

const uiNotesList = new UINotesList();