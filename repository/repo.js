(function () {
    'using strict';

    chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
        if (message.module === 'repository') {
            httpGet(message.key)
                .then(function (response) {
                    var json = JSON.parse(response.response);
                    let data = {
                        module: 'popover',
                        title: json[1][0],
                        body: json[2][0]
                    };
                    sendResponse(data);
                },
                function (err) {
                    console.log(err);
                    sendResponse('Ocorreu algum erro ao pesquisar o termo' + message.key + '.');
                });
            return true;
        };
    });

    function httpGet(termString) {
        return httpExecute('GET', `https://en.wikipedia.org/w/api.php?action=opensearch&format=json&search=${termString}`);
    }

    function httpExecute(method, url, data) {
        return httpCall({
            url: url,
            method: method,
            data: data
        });
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