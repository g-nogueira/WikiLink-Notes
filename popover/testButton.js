(function () {
    "use strict";

    // initializeMDC();
    document.body.appendChild(fab());
    document.body.appendChild(dialog());
    dialog();
    events();



    function fab() {
        const button = document.createElement('button');
        const span = document.createElement('span');
        const icon = document.createElement('i');

        button.appendChild(span);
        span.appendChild(icon);

        button.classList.add('mdc-fab', 'mdc-fab--mini', 'app-fab--absolute');
        button.id = 'show-dialog';
        span.classList.add('mdc-fab__icon');
        icon.classList.add('material-icons');
        icon.appendChild(document.createTextNode('create'));

        return button;
    }

    function dialog() {

        const dialog = document.createElement('dialog');
        dialog.classList.add('mdl-dialog', 'dialog-container');
        dialog.appendChild(content());
        dialog.appendChild(actions());

        function content() {
            const content = document.createElement('div');
            const toolPanel = (() => {
                const toolPanel = document.createElement('section');
                const iconsGroups = [
                    ['format_bold', 'format_italic', 'format_underlined'],
                    ['border_color', 'format_color_text'],
                    ['format_list_bulleted', 'format_list_numbered'],
                    ['format_align_left', 'format_align_center', 'format_align_right'],
                    ['format_indent_increase', 'format_indent_decrease']
                ];

                toolPanel.classList.add('tool-panel');
                toolPanel.appendChild(toolsGroupSection([fontFamilyDiv(), fontSizeDiv()], iconsGroups[0]));
                toolPanel.appendChild(toolsGroupSection([], iconsGroups[1]));
                toolPanel.appendChild(toolsGroupSection([], iconsGroups[2]));
                toolPanel.appendChild(toolsGroupSection([], iconsGroups[3]));
                toolPanel.appendChild(toolsGroupSection([], iconsGroups[4]));



                function toolsGroupSection(extraElements = [], icons = []) {
                    const section = document.createElement('section');
                    section.classList.add('toolsGroup');

                    extraElements.forEach(el => section.appendChild(el));

                    icons.forEach(val => {
                        const i = document.createElement('i');
                        i.classList.add('material-icons');
                        i.textContent = val;

                        section.appendChild(i);
                    });

                    return section;
                }

                function fontFamilyDiv() {
                    const div = document.createElement('div');
                    const input = document.createElement('input');
                    input.classList.add('font-family--input');
                    div.appendChild(input);

                    return div;
                }

                function fontSizeDiv() {
                    const div = document.createElement('div');
                    const input = document.createElement('input');
                    input.classList.add('font-size--input');
                    div.appendChild(input);

                    return div;
                }

                return toolPanel;
            })();
            const mainPanel = (() => {
                const mainPanel = document.createElement('section');
                const input = document.createElement('input');
                const textArea = document.createElement('textarea');

                input.classList.add('title-area');
                input.placeholder = 'Title';
                textArea.classList.add('mdc-textfield__input', 'text-area');
                textArea.rows = 10;
                textArea.cols = 30;
                textArea.placeholder = 'What are you thinking about?';

                mainPanel.classList.add('main-panel', 'mdc-typography--body1');
                mainPanel.appendChild(input);
                mainPanel.appendChild(textArea);

                return mainPanel;
            })();

            content.classList.add('mdl-dialog__content', 'panels-wrapper');
            content.appendChild(toolPanel);
            content.appendChild(mainPanel);

            return content;
        }

        function actions() {
            const actions = document.createElement('div');
            const saveBtn = document.createElement('button');
            const cancelBtn = document.createElement('button');

            saveBtn.classList.add('mdl-button');
            saveBtn.textContent = 'Save';
            cancelBtn.classList.add('mdl-button', 'close');
            cancelBtn.textContent = 'Cancel';

            actions.classList.add('mdl-dialog__actions');
            actions.appendChild(saveBtn);
            actions.appendChild(cancelBtn);

            return actions;
        }

        return dialog;
    }

    function events() {
        const dialog = document.querySelector('dialog');
        const showDialogButton = document.querySelector('#show-dialog');
        if (!dialog.showModal) {
            dialogPolyfill.registerDialog(dialog);
        }
        showDialogButton.addEventListener('click', function () {
            dialog.showModal();
        });
        dialog.querySelector('.close').addEventListener('click', function () {
            dialog.close();
        });
    }

})();