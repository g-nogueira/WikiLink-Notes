'using strict';




/************************************************************
 *                       NOTES
 * 
 * ⚠ SINGLETON Class
 * 
 * ✔ 1. ReloadPage function working.
 * ✔ 2. SetProperties function working.
 * ✖ 3. SaveNote function unfinished.
 * 
 * 
 ************************************************************/
class UINoteEdition {
    constructor() {
        this.titleElem = document.getElementById('noteTitleSection');
        this.bodyElem = document.getElementById('noteBodySection');
        this.saveNoteBtn = document.getElementById('saveNote');
        this.backBtn = document.getElementById('noteCreationbtn-back');
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
     * @param {String} prop.title The note title.
     * @param {String} prop.body The note body.
     */
    setValues(prop) {
        //⚠ It will save the current noteId in cache
        this.titleElem.value = prop.title;
        this.bodyElem.value = prop.body;
    }

}

const uiNoteEdition = new UINoteEdition();