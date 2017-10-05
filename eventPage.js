(function () {
    "use strict";

    ///// Testing Area ////
    /*
    chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
        console.log('message');
        try {
            if (request.method === 'repository') {
                sendResponse(repo[message.key]);
            }
        } catch (error) {
            alert(error.message);
        }
    });
*/
    chrome.tabs.onActivated.addListener(
        function () {
            chrome.runtime.sendMessage('testing...', function (response) {
                // console.log('resp ' + response);
            });
            // httpExecute('GET', 'https://en.wikipedia.org/w/api.php?action=opensearch&format=json&search=nepal')
        });

    chrome.runtime.onMessage.addListener(
        function (request, sender, sendResponse) {
            console.log(sender.tab ?
                "from a content script:" + sender.tab.url :
                "from the extension");
            if (request.searchTerm.length > 0){
                sendResponse({ data: "Nenhum resultado encontrado para " + request.searchTerm });}
        });

    chrome.contextMenus.create({
        title: 'Search \"%s\" on Wikipedia',
        contexts: ["selection"],
        onclick: info => searchTerm(info.selectionText)
    });




    function repo() {

        return {
            searchTerm: httpGet,
        };


        //// Implementation ////

        function httpGet(termString) {
            return httpExecute('GET', `https://en.wikipedia.org/w/api.php?action=opensearch&format=json&search=${termString}`);
        }

        function httpExecute(method, url, data) {
            // 'http://www.w3.org/pub/WWW/TheProject.html'
            httpCall({
                url: url,
                method: method,
                data: data
            }).then(successCallback, errorCallback);

            function successCallback(response) {
                var json = JSON.parse(response.response);
                console.log(response);
                return response;

            }

            function errorCallback(response) {
                console.log(response);
                return response;
            }
        }
    }


    /**
     * @description Beautify http calls
     * @param {{url: string, method: string, data: string, dataType: string}} config 
     */
    function httpCall(config) {
        let httpRequest = new XMLHttpRequest();

        /**
         * 
         * @param {function} successCallback 
         * @param {function} errorCallback 
         */
        function then(successCallback, errorCallback) {

            let concatUrl = config.url + objToQuerystring(config.data);
            httpRequest.open(config.method, concatUrl, true);
            httpRequest.setRequestHeader('Content-Type', config.dataType || 'application/json');
            httpRequest.send();

            httpRequest.onreadystatechange = () => {

                if (httpRequest.readyState === XMLHttpRequest.DONE) {
                    switch (httpRequest.status) {
                        case 200: successCallback(httpRequest);
                            break;
                        default: errorCallback(httpRequest)
                            break;
                    }
                }
            };
        }


        function objToQuerystring(obj) {
            var str = [];
            for (var p in obj)
                str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));

            return str.join("&");
        }

        return {
            then: then
        }
    }
})();