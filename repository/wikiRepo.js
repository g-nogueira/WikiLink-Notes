(function () {
    'using strict';

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
                image: (term) => `https://en.wikipedia.org/w/api.php?action=query&titles=${term}&prop=pageimages&format=json&pithumbsize=100`,
                article: (term) => `https://en.wikipedia.org/w/api.php?action=opensearch&format=json&search=${term}`
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
                    .then(response => resolve(formatResponse(response, 'image')));
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
            let i = flatten(json);
            return {
                url: i.source,
                width: i.width,
                height: i.height
            };

        }
        function article() {
            return {
                title: json[1][0],
                body: json[2][0].length <= 80 ? json[2][1] : json[2][0]
            };
        }

        return tp[type]();

        function flatten(object) {
            return Object.assign({}, ...function _flatten(objectBit, path = '') {  //spread the result into our return object
                return [].concat(                                                       //concat everything into one level
                    ...Object.keys(objectBit).map(                                      //iterate over object
                        key => typeof objectBit[key] === 'object' ?                       //check if there is a nested object
                            _flatten(objectBit[key], `${key}`) :              //call itself if there is
                            ({ [`${key}`]: objectBit[key] })                //append object with it’s path as key
                    )
                )
            }(object));
        };

        // function flatten1(object) {
        //     return Object.assign({}, ...function _flatten(objectBit, path = '') {  //spread the result into our return object
        //         return [].concat(                                                       //concat everything into one level
        //             ...Object.keys(objectBit).map(                                      //iterate over object
        //                 key => typeof objectBit[key] === 'object' ?                       //check if there is a nested object
        //                     _flatten(objectBit[key], `${path}.${key}`) :              //call itself if there is
        //                     ({ [`${path}.${key}`]: objectBit[key] })                //append object with it’s path as key
        //             )
        //         )
        //     }(object));
        // };
    }
})();