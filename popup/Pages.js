'using strict';

class Pages {
    constructor() {
    }

    get header() {
        return {
            popoverCheckBox: getElement('#wlWindowIsActive'),
            optionsButton: getElement('#goToOptPage'),
            gobackButton: getElement('#toNotesListPage'),
            saveNoteButton: getElement('#saveNotes'),
            noteCreationButton: getElement('#toNewNotePage'),
            searchNoteButton: getElement("#searchNoteBtn"),
            searchNoteInput: getElement("#searchNoteInput")
        };
    }
    getNotes() {
        return new Promise((resolve, reject) => {
            chrome.storage.sync.get('notes', keyValueObj => {
                resolve(keyValueObj.notes);
            });
        });
    }
    toNoteCreation() {
        document.getElementById('newNotePage')
            .classList.remove('hidden');
        document.getElementById('notesListPage')
            .classList.add('hidden');
    }
    toNotesList() {
        document.getElementById('notesListPage')
            .classList.remove('hidden');
        document.getElementById('newNotePage')
            .classList.add('hidden');
    }
    toOptions() {
        if (chrome.runtime.openOptionsPage) {
            // New way to open options pages, if supported (Chrome 42+).
            chrome.runtime.openOptionsPage();
        } else {
            // Reasonable fallback.
            window.open(chrome.runtime.getURL('../optionsPage/main.html'));
        }
    }
}