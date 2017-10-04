//Page used for repository testing
(function () {
    "use strict";

    // import repo from 'repository/repo';

    chrome.tabs.onActivated.addListener(activeInfo => {

        httpExecute('GET', 'https://en.wikipedia.org/w/api.php?action=opensearch&format=json&search=nepal');

    });


    function httpExecute(method, url, data) {
        // 'http://www.w3.org/pub/WWW/TheProject.html'
        httpCall({
            url: url,
            method: method,
            data: data
        }).then(successCallback, errorCallback);

        function successCallback(response) {
            let json = JSON.parse(response.response);
            var searchResult = JSON.parse(response.response);
            var text = `Title: ${searchResult[1][0]} \nBody: ${searchResult[2][0]}`;
            console.log(text);
        }

        function errorCallback(response) {
            console.log(response);
        }
    }


    function httpCall(config) {
        let httpRequest = new XMLHttpRequest();

        /**
         * 
         * @param {function} successCallback 
         * @param {function} errorCallback 
         */
        function then(successCallback, errorCallback) {

            let urlN = config.url + objToQuerystring(config.data)
            httpRequest.open(config.method, urlN, true);
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