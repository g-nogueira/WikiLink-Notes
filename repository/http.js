(function () {
    'using strict';


    chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
        if (message.require === 'http') {
            // _http[message.method](message.url)
            // .then(
            // response => sendResponse(formatReponse(response)),
            // err => sendResponse('Ocorreu algum erro ao pesquisar o termo' + message.key + '.')
            // );
            return _http;
        };
    });



    class http {
        constructor() {
        }

        get(url) {
            return this.httpCall('GET', url);
        }
        post(url, data) {
            return this.httpCall('POST', url, data);
        }
        put(url, data) {
            return this.httpCall('PUT', url, data);
        }
        delete(url) {
            return this.httpCall('DELETE', url);
        }

        httpCall(method, url) {
            let xhr = new XMLHttpRequest();
            xhr.open(method, url, true);
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

            return {
                then: then
            }
        }
    }

    var _http = new http();
})();