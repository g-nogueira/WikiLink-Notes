(function () {
    'using strict';
    const el = (element) => document.querySelector(element);
    const els = (element) => document.querySelectorAll(element);

    // initEvents();
    getUser();
    uiEvents();


    function uiEvents() {
        const sidemenu = el('#sideMenu');
        const mainSection = el('#mainSection');

        el('#sideMenuBtn').addEventListener('click', toggleSideMenu);
        el('#dropdownBtn').addEventListener('click', toggleUserDropdown);
        document.body.addEventListener('click', closeUserDropown);


        el('#notesPageBtn').addEventListener('click', showPage);
        el('#switchTheme').addEventListener('click', setThemeWhite);
        el('#userPageBtn').addEventListener('click', showPage);
        el('#definitionsPageBtn').addEventListener('click', showPage);
        el('#feedbackPageBtn').addEventListener('click', showPage);
        el('#draftsPageBtn').addEventListener('click', showPage);
        el('#recyclePageBtn').addEventListener('click', showPage);

        function showPage(ev) {
            const pages = mainSection.querySelectorAll('.page');
            const sidebarBtns = sidemenu.querySelectorAll('.sidebar-item');
            const selectedBtn = ev.target;
            const selectedPage = selectedBtn.id.slice(0,-3);

            pages.forEach(el => el.classList.contains('hidden')?null:el.classList.add('hidden'));
            sidebarBtns.forEach(el => el.classList.contains('active')?el.classList.remove('active'):null)
            el(`#${selectedPage}`).classList.remove('hidden');
            selectedBtn.classList.add('active');
        
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

})();