(function () {
    "use strict";

    test();


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
        span.classList.add('mdc-fab__icon');
        icon.classList.add('material-icons');
        icon.appendChild(document.createTextNode('create'));

        document.body.appendChild(button);
    }

})();