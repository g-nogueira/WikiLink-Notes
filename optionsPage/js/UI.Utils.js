'using strict';

class UIUtils {
    constructor() {}

    removeChildNodes(element) {
        while (element.hasChildNodes()) {
            element.removeChild(element.lastChild);
        }
    }
}

const uiUtils = new UIUtils();