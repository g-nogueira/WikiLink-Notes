(function () {
    "use strict";

    chrome.tabs.onActivated.addListener(activeInfo => {
        let httpRequest = new XMLHttpRequest();
        httpRequest.onreadystatechange = ()=>{
            if (httpRequest.readyState === XMLHttpRequest.DONE) {
                console.log('successful callback on repo.js');
                
                if (httpRequest.status === 200) {
                    console.log('successful callback status 200 on repo.js');
                }
                else console.log(`failed callback status ${httpRequest.status} on repo.js`);
            }
            else if (httpRequest.readyState === 0) {
                console.log('failed callback on -REQUEST NOT INITIALIZED- repo.js');
            } 
        };
        httpRequest.open('GET', 'http://www.w3.org/pub/WWW/TheProject.html ', true);
        httpRequest.send();
        

    });

})();