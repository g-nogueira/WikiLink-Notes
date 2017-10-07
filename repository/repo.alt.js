(function () {
    'using strict';

    chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
        if (message.module === 'repository') {
            repository(message.method)(message.key)
                .then(
                response => sendResponse(response.response),
                err => sendResponse('Ocorreu algum erro ao pesquisar o termo' + message.key + '.')
                );
            return true;
        }
    });

    function repository(type) {

        const methods = {
            searchTerm: httpGet,
            get: httpGet,
            post: httpPost,
            put: httpPut,
            delete: httpDelete
        };

        function httpGet(termString) {
            return httpExecute('GET', `https://en.wikipedia.org/w/api.php?action=opensearch&format=json&search=${termString}`);
        }

        function httpPost(params) {
            return httpExecute('POST', params);
        }

        function httpPut(params) {
            return httpExecute('PUT', params);
        }

        function httpDelete(params) {
            return httpExecute('DELETE', params);
        }

        function httpExecute(method, url) {
            const xhr = new XMLHttpRequest();
            xhr.open(method, url, true);
            xhr.send();
            function then(onSuccess, onError) {
                xhr.onreadystatechange = function () {
                    if (xhr.readyState === XMLHttpRequest.DONE)
                        if (xhr.status === 200)
                            onSuccess(xhr);
                        else {
                            onError(xhr);
                            console.log(err);
                        }
                };
            }
            return { then: then };
        }

        return (methods[type] || methods['get']);
    }

})();