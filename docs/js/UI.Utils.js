'using strict';

class UIUtils {
    constructor() {}

    removeChildNodes(element) {
        while (element.hasChildNodes()) {
            element.removeChild(element.lastChild);
        }
    }

    selectPage(targetPage) {
        const el = (element) => document.querySelector(element);
        const pages = mainSection.querySelectorAll('.page');
        const sidebarBtns = el('#sideMenu').querySelectorAll('.sidebar-item');

        pages.forEach(el => el.classList.contains('hidden') ? null : el.classList.add('hidden'));
        sidebarBtns.forEach(el => el.classList.contains('active') ? el.classList.remove('active') : null)
        el(`#${targetPage}`).classList.remove('hidden');
        el(`#${targetPage}Btn`).classList.add('active');

    }
}

const uiUtils = new UIUtils();