(function () {
    "use strict";

    var selection;

    document.onselectionchange = () => {

        selection = document.getSelection();
        setTimeout(() => openFloatingWL(), 2000);

    };

    function openFloatingWL() {

        let div = document.createElement('div');
        div.setAttribute('class', 'modal fade bd-example-modal-sm');
        var tn = document.createTextNode('div tal tal tal');
        div.appendChild(tn);

        document.body.appendChild(div);

    }

    function addAttributes(keyValueAttributes, element) {

    }
})();