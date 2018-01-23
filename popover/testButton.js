(function () {
    "use strict";

    // initializeMDC();
    test();
    dialog();
    events();


    function initializeMDC() {
        const MDCComponent = mdc.base.MDCComponent;
        const MDCFoundation = mdc.base.MDCFoundation;
        const MDCTextfield = mdc.textfield.MDCTextfield;
        const MDCTextfieldFoundation = mdc.textfield.MDCTextfieldFoundation;
        // Add event listener to some button to toggle the menu on and off.
    }

    async function test(params) {
        const button = document.createElement('button');
        const span = document.createElement('span');
        const icon = document.createElement('i');

        button.appendChild(span);
        span.appendChild(icon);

        button.classList.add('mdc-fab', 'mdc-fab--mini', 'app-fab--absolute');
        button.id = 'show-modal';
        span.classList.add('mdc-fab__icon');
        icon.classList.add('material-icons');
        icon.appendChild(document.createTextNode('create'));

        document.body.appendChild(button);
    }

    function dialog() {
        const dialog = document.createElement('dialog');
        const contentDiv = document.createElement('div');
        const btnOk = document.createElement('button');
        const btnCancel = document.createElement('button');
        const buttonsDiv = document.createElement('div');


        dialog.style.width = '750px';
        
        dialog.classList.add('mdl-dialog');
        contentDiv.classList.add('mdl-dialog__content');
        btnOk.classList.add('mdl-button');
        btnCancel.classList.add('mdl-button', 'close');
        contentDiv.appendChild(getNotesArea());


        btnOk.appendChild(document.createTextNode('Ok'));

        btnCancel.appendChild(document.createTextNode('Cancel'));

        buttonsDiv.classList.add('mdl-dialog__actions', 'mdl-dialog__actions--full-width');
        buttonsDiv.appendChild(btnOk);
        buttonsDiv.appendChild(btnCancel);

        dialog.appendChild(contentDiv);
        dialog.appendChild(buttonsDiv);


        document.body.appendChild(dialog);
    }

    function events() {
        const dialog = document.querySelector('dialog');
        const showModalButton = document.querySelector('#show-modal');
        if (!dialog.showModal) {
            dialogPolyfill.registerDialog(dialog);
        }
        showModalButton.addEventListener('click', function () {
            dialog.showModal();
        });
        dialog.querySelector('.close').addEventListener('click', function () {
            dialog.close();
        });
    }

    function getNotesArea() {
        const section = document.createElement('section');
        section.classList.add('mdc-typography--body1', 'noteArea');

        const input = document.createElement('input');
        input.classList.add('noteTitleInput');
        input.placeholder = 'Title';

        const textArea = document.createElement('textarea');
        textArea.classList.add('mdc-textfield__input', 'noteBodySection');
        textArea.placeholder = 'What are you thinking about?';

        section.appendChild(input);
        section.appendChild(textArea);

        return section;
    }

})();