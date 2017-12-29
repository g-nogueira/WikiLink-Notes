(function () {
    'using strict';


    initializeLayout();
    displayNotes();


    function displayNotes() {
        const notesArea = utils.getElement("#notesArea");

        manager.retrieveAll('notes', notes => {
            notes.forEach(note => {
                const html = uiNotesList.generateHtml({

                    type: 'noteLabel',
                    title: note.title,
                    date: note.date,
                    onclick: () => {
                        pages.toNoteCreation();
                        utils.getElement('#noteTitleSection').value = params.title;
                        newNote.bodyElem.value = body;

                        let span = document.createElement('span');
                        span.setAttribute('id', 'tempNote');
                        span.value = params.id;
                        document.body.appendChild(span);
                    },
                    deleteEvent: () => {
                        const div = document.getElementById(`${note.id}`)
                        div.parentNode.removeChild(div);
                    }

                });
                notesArea.appendChild(html);
            });
        });
    }

    /**
     * 
     * @param {string} pageName The name of the page to reload.
     */
    function reloadPage(pageName) {
        const f = {
            notesList: uiNotesList.reloadPage,
            noteEdition: UINoteEdition.reloadPage
        };

        f[pageName]();
    }
})();