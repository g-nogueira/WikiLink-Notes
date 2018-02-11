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
        el('#dropdownBtn').addEventListener('click', toggleUserDropdown);
        document.body.addEventListener('click', closeUserDropown);


        el('#notesPageBtn').addEventListener('click', displayNotes);
        el('#switchTheme').addEventListener('click', setThemeWhite);
        el('#userPageBtn').addEventListener('click', showUser);
        el('#definitionsPageBtn').addEventListener('click', () => showPage('definitionsPage'));
        el('#feedbackPageBtn').addEventListener('click', () => showPage('feedbackPage'));
        el('#draftsPageBtn').addEventListener('click', showDrafts);
        el('#recyclePageBtn').addEventListener('click', showTrash);

        function showUser() {
            showPage('userPage');
        }

        async function showDrafts(ev) {
            uiDrafts.clearDrafts();
            const drafts = await manager.retrieve('drafts');
            if (drafts.length !== 0)
                uiDrafts.appendDrafts(drafts);
            else
                uiDrafts.appendChild(document.createTextNode('It looks like you do not have written notes. 😕'));

            showPage('draftsPage');
        }

        async function showTrash(ev) {
            uiTrash.clearSection();
            const notes = await manager.retrieve('trash');
            if (notes.length !== 0)
                uiTrash.appendNotes(notes);
            else
                uiTrash.appendChild(document.createTextNode('It looks like you do not have written notes. 😕'));

            showPage('recyclePage');
        }

        function closeUserDropown(ev) {
            if (ev.target != el('#userDropdown') && ev.target != el('#dropdownBtn')) {
                el('#userDropdown').classList.remove('dropdown-open');
            }
        }

        function toggleUserDropdown() {
            el('#userDropdown').classList.toggle('dropdown-open');
        }

        function toggleSideMenu() {
            el('#sideMenuBtn').classList.toggle('sidemenu-open');
            el('#sideMenu').classList.toggle('sidemenu-close');
        }

        function setThemeWhite() {
            el('#sideMenu').style.backgroundColor = '#F9F9F9';
            el('#sideMenu').style.color = '#000000e0';
            el('.sidebar-header').style.backgroundColor = '#F9F9F9';
            el('.self-navbar').style.backgroundColor = '#00897bed';
            el('.self-navbar').style.color = '#003F38';
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
            uiNotes.mainSection.appendChild(document.createTextNode('It looks like you do not have written notes. 😕'));

        showPage('notesPage');
    }

    function showPage(targetPage) {
        const pages = mainSection.querySelectorAll('.page');
        const sidebarBtns = el('#sideMenu').querySelectorAll('.sidebar-item');
        // const selectedBtn = ev.target;
        // const selectedPage = selectedBtn.id.slice(0, -3);

        pages.forEach(el => el.classList.contains('hidden') ? null : el.classList.add('hidden'));
        sidebarBtns.forEach(el => el.classList.contains('active') ? el.classList.remove('active') : null)
        el(`#${targetPage}`).classList.remove('hidden');
        el(`#${targetPage}Btn`).classList.add('active');

    }
})();