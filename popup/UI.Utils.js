'using strict';

class UIUtils {
    constructor() {}

    /**
     * @summary Redirects to the page by id.
     * @param {any} pageId The id of the page to be given.
     * @param {String} pageId 'noteEdition'.
     * @param {String} pageId 'home'.
     * @param {String} pageId 'drafts'.
     * @param {String} pageId 'notes'.
     */
    showPage(pageId) {
        const page = {
            noteEdition: () => {
                document.getElementById('page-notesList').classList.add('hidden');
                document.getElementById('page-noteCreation').classList.remove('hidden');
            },
            home: () => {
                document.getElementById('page-notesList').classList.remove('hidden');
                document.getElementById('page-noteCreation').classList.add('hidden');
            },
            drafts: () => {
                document.getElementById('notesArea').classList.add('hidden');
                document.getElementById('draftsArea').classList.remove('hidden');
            },
            notes: () => {
                document.getElementById('notesArea').classList.remove('hidden');
                document.getElementById('draftsArea').classList.add('hidden');
            }
        };

        page[pageId]();
    }

    removeChildNodes(element) {
        while (element.hasChildNodes()) {
            element.removeChild(element.lastChild);
        }
    }
}

const uiUtils = new UIUtils();