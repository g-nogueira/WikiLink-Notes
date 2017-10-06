(function () {
    'using strict';

    chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
        if (message.module === 'repository') {
            httpGet(message.key)
                .then(
                response => sendResponse(formatReponse(response)),
                err => sendResponse('Ocorreu algum erro ao pesquisar o termo' + message.key + '.')
                );
            return true;
        };
    });

    function formatReponse(response) {
        var json = JSON.parse(response.response);
        return data = {
            module: 'popover',
            title: json[1][0],
            body: json[2][0]
        };
    }

    function httpGet(termString) {
        return httpExecute('GET', `https://en.wikipedia.org/w/api.php?action=opensearch&format=json&search=${termString}`);
    }

    function httpExecute(method, url) {
        return httpCall({ url: url, method: method });
    }

    /**
     * @description Beautify http calls
     * @param {{url: string, method: string}} config 
     */
    function httpCall(config) {
        /**
         * 
         * @param {function} successCallback 
         * @param {function} errorCallback 
         */

        let xhr = new XMLHttpRequest();
        xhr.open(config.method, config.url, true);
        xhr.send();

        function then(successCallback, errorCallback) {
            xhr.onreadystatechange = function () {
                if (xhr.readyState === XMLHttpRequest.DONE)
                    if (xhr.status === 200)
                        successCallback(xhr);
                    else {
                        errorCallback(xhr);
                        console.log(err);
                    }
            };
        }

        function objToQuerystring(obj) {
            var str = [];
            Object.keys(obj).map(function (key, index) {
                str.push(encodeURIComponent(index) + '=' + encodeURIComponent(obj[key]));
            });
            return str.join("&");
        }

        return {
            then: then
        }
    }

})();