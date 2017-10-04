(function () {
    "use strict";
    
    chrome.storage.sync.get('wlWindowIsToggleble', obj => {switch_WLWindow.checked = obj.wlWindowIsToggleble; console.log(switch_WLWindow.checked);})

    
    var switch_WLWindow = document.querySelector('#wlWindowIsActive');
    var button_Options = document.querySelector('#goToOptions');
    
    
    //// INPUTS EVENTS ////
    switch_WLWindow.onclick = () => setWLWindowActiveState(switch_WLWindow.checked);
    button_Options.onclick = () => redirectToOptions();
    
    
    //// EVENTS FUNCTIONS ////
    function setWLWindowActiveState(isActive = true) {
        chrome.storage.sync.set({ 'wlWindowIsToggleble': isActive }, () => {
            console.log(`Settings to WikiLinkPanel toggleble is saved to: ${isActive}`);
        });
    }


    function redirectToOptions() {
        if (chrome.runtime.openOptionsPage) {
            // New way to open options pages, if supported (Chrome 42+).
            chrome.runtime.openOptionsPage();
        } else {
            // Reasonable fallback.
            window.open(chrome.runtime.getURL('../optionsPage/main.html'));
        }
    }
})();