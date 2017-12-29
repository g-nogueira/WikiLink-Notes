'using strict';


class Utils {
    constructor(){};

    /**
     * @async
     * @param {function} f
     */
    getNotes(f) {
        chrome.storage.sync.get('notes', f);
    }

    getElement(identifier) {
        return document.querySelector(identifier);
    }

    removeChildNodes(element){
        while (element.hasChildNodes()) {
            notesArea.removeChild(notesArea.lastChild);
        }
    }
}

const utils = new Utils();