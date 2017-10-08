(function () {
    'using strict';

    const url = {
        image: (term) =>`https://en.wikipedia.org/w/api.php?action=query&titles=${term}&prop=pageimages&format=json&pithumbsize=100`,
        article: (term) => `https://en.wikipedia.org/w/api.php?action=opensearch&format=json&search=${term}`
    };


    chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
        if (message.module === 'repository') {
            // repo().searchTerm(message.key)
            repo()[message.method](message.key)
                .then(
                response => sendResponse(formatReponse(response)),
                err => sendResponse('Ocorreu algum erro ao pesquisar o termo' + message.key + '.')
                );
            return true;
        };
    });


    function repo() {
        return {
            searchTerm: httpGet,
            searchImage: httpGet
        };
    }


    ////IMPLEMENTATIONS////

    function httpGet(termString) {
        return httpCall('GET', url.article(termString));
    }

    function formatReponse(response) {
        let json = JSON.parse(response.response);

        return data = {
            title: json[1][0],
            body: json[2][0].length <= 80?json[2][1]:json[2][0]
        };
    }

    /**
     * @description Performs http calls
     * @param {string} method
     * @param {string} url
     */
    function httpCall(method, url) {

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

})();