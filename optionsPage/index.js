(function () {
    'using strict';
    const el = (element) => document.querySelector(element);
    const els = (element) => document.querySelectorAll(element);

    // initEvents();
    getUser();
    uiEvents();
    displayNotes();


    function uiEvents() {
        const sidemenu = el('#sideMenu');
        const mainSection = el('#mainSection');

        el('#sideMenuBtn').addEventListener('click', toggleSideMenu);
        el('#notesPageBtn').addEventListener('click', displayNotes);
        el('#userPageBtn').addEventListener('click', loadUserPage);
        el('#definitionsPageBtn').addEventListener('click', () => uiUtils.selectPage('definitionsPage'));
        el('#feedbackPageBtn').addEventListener('click', () => uiUtils.selectPage('feedbackPage'));
        el('#draftsPageBtn').addEventListener('click', loadDraftsPage);
        el('#recyclePageBtn').addEventListener('click', loadTrashPage);

        async function loadUserPage() {
            uiUtils.selectPage('userPage');
        }

        async function loadDraftsPage(ev) {
            uiDrafts.clearDrafts();
            const drafts = await manager.retrieve('drafts');
            if (drafts.length !== 0)
                uiDrafts.appendDrafts(drafts);
            else
                uiDrafts.appendChild(document.createTextNode('It looks like you do not have written notes. 😕'));

            uiUtils.selectPage('draftsPage');
        }

        async function loadTrashPage(ev) {
            uiTrash.clearSection();
            const notes = await manager.retrieve('trash');
            if (notes.length !== 0)
                uiTrash.appendNotes(notes);
            else
                uiTrash.appendChild(document.createTextNode('It looks like you do not have written notes. 😕'));

            uiUtils.selectPage('recyclePage');
        }

        function toggleSideMenu() {
            chrome.identity.getProfileUserInfo(accounts => {
                console.log(accounts);
            });
            el('#sideMenuBtn').classList.toggle('sidemenu-open');
            el('#sideMenu').classList.toggle('sidemenu-close');
        }
    }

    function initEvents() {

        // document.getElementById('signInGoogle').onclick = googleSignin;


        function googleSignin() {
            http.get('http://localhost:8080/auth/google/?redirect=chrome-extension://lckbiclbfdooecdkjkbebanadchafmbn/optionsPage/index.html');
        }
    }

    async function getUser() {
        let user = await http.get('http://localhost:8080/user/google');
    };

    async function displayNotes() {
        uiNotes.clearMainSection();
        const notes = await manager.retrieve('notes');
        if (notes.length !== 0)
            uiNotes.appendNotes(notes);
        else
            uiNotes.appendChild(document.createTextNode('It looks like you do not have written notes. 😕'));

        uiUtils.selectPage('notesPage');
    }

})();