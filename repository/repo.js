
(function () {
    'using strict';

    console.log('repo running');

    chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
        try {
            if (message.module === 'repository') {
                sendResponse(repo()[message.method](message.key));
                console.log(`From repo: ${repo()[method](message.key)}`);
            }
        } catch (error) {
            alert(error.message);
        }
        return true;
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
                let data = {};
                data.title = json[1][0];
                data.body = json[2][0];
                console.log(data);
                return data;

            }

            function errorCallback(response) {
                console.log(response);
                return response.response;
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