(function () {
    'using strict';

    var lang = {};
    chrome.storage.sync.get('mainLanguage', obj => lang = obj.mainLanguage)
    chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
        if (message.module === 'wikiRepo') {
            wR[message.method](message.key) //wR.searchImage('term')
                .then(resp => sendResponse(resp))
                .catch(err => sendResponse('Ocorreu algum erro ao pesquisar o termo' + message.key + '.'));
            return true;
        };
    });


    class wikiRepo {
        constructor() {
            this._wikiApi = {
                image: term => `https://www.googleapis.com/customsearch/v1?cx=016244970766248583918:9b3frzu6es8&key=AIzaSyCANbzYzOf_Bkm2KLw5di6tR30aNC6mOCU&q=${term}&searchType=image&num=1`,
                article: (term) => `https://${lang || 'en'}.wikipedia.org/w/api.php?action=opensearch&format=json&search=${term}`
            };
        }

        searchTerm(term) {
            return new Promise((resolve, reject) => {
                http
                    .get(this._wikiApi.article(term))
                    .then(response => resolve(formatResponse(response, 'article')));
            });
        }
        searchImage(term) {
            return new Promise((resolve, reject) => {
                http
                    .get(this._wikiApi.image(term))
                    .then(response => resolve(formatResponse(response, 'image')))
                    .catch(response => resolve(response));
            });
        }
    }

    class httpC {
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

            return new Promise((resolve, reject) => {
                xhr.open(method, url, true);
                xhr.onload = () => resolve(xhr.responseText);
                xhr.onerror = () => reject(xhr);
                xhr.send();
            });
        }
    }

    var wR = new wikiRepo();
    var http = new httpC();

    function formatResponse(response, type) {

        let json = JSON.parse(response);
        let tp = {
            article: article,
            image: image
        };
        function image() {
            return {
                url: json.items[0].link,
                width: json.items[0].image.width,
                height: json.items[0].image.height
            }
        }
        function article() {
            return {
                title: json[1][0],
                body: json[2][0].length <= 80 ? json[2][1] : json[2][0]
            };
        }

        return tp[type]();
    }
})();