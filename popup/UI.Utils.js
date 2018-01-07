'using strict';

class UIUtils {
    constructor() {}

    /**
     * @summary Redirects to the page by id.
     * @param {any} pageId The id of the page to be given.
     * @param {String} pageId 'noteEdition'.
     * @param {String} pageId 'notesList'.
     */
    redirectToPage(pageId) {
        const page = {
            noteEdition: () => {
                document.getElementById('page-notesList').classList.add('hidden');
                document.getElementById('page-noteCreation').classList.remove('hidden');
            },
            notesList: () => {
                document.getElementById('page-notesList').classList.remove('hidden');
                document.getElementById('page-noteCreation').classList.add('hidden');
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