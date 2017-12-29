'using strict';




/************************************************************
 *                       NOTES
 * ✖✔⚠
 * ⚠ SINGLETON Class
 * 
 * 
 ************************************************************/

class UINoteEdition {
    constructor() {
        const titleElem = utils.getElement('#noteTitleSection');
        const bodyElem = utils.getElement('#noteBodySection');
        const saveBtn = utils.getElement('#saveNotes');
    }

    /**
     * @summary Sets all the values in the page to default.
     */
    reloadPage() {
        this.titleElem.value = "";
        this.bodyElem.value = "";
    }


    /**
     * @summary
     * @param {Object} prop The properties to set in the page.
     * @param {number} prop.id The note id.
     * @param {String} prop.title The note title.
     * @param {String} prop.body The note body.
     */
    setProperties(prop) {
        //⚠ It will save the current noteId in cache
        this.titleElem.value = prop.title;
        this.bodyElem.value = prop.body;
    }
}

const uiNoteEdition = new UINoteEdition();