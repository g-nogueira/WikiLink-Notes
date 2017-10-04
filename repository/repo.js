(function () {
    'using strict';

    export default repo;


    function repo(method) {

        return {
            searchTerm: httpGet,
        }
        
        //// Implementation ////
        function httpGet(termString) {
            return doHTTP();
        }
        
        // 0 (uninitialized) or (request not initialized)
        // 1 (loading) or (server connection established)
        // 2 (loaded) or (request received)
        // 3 (interactive) or (processing request)
        // 4 (complete) or (request finished and response is ready)

        // document.ajax({
        //     url: '//www.wikidata.org/w/api.php',
        //     data: { action: 'wbgetentities', ids: mw.config.get('wgWikibaseItemId'), format: 'json' },
        //     dataType: 'jsonp',
        //     success: function (x) {
        //       console.log('wb label', x.entities.Q39246.labels.en.value);
        //       console.log('wb description', x.entities.Q39246.descriptions.en.value);
        //     }
        //   });

        function doHTTP(param) {
            let httpRequest = new XMLHttpRequest();
            httpRequest.onreadystatechange = () => {
                if (httpRequest.readyState === XMLHttpRequest.DONE) {
                    console.log('successful callback on repo.js');
                    if (httpRequest.status === 200) {
                        console.log('successful callback status 200 on repo.js');
                        return httpRequest.response;
                    }
                    else console.log(`failed callback status ${httpRequest.status} on repo.js`);
                }
                else if (httpRequest.readyState === 0) {
                    console.log('failed callback on -REQUEST NOT INITIALIZED- repo.js');
                }
            };
            httpRequest.open('GET', 'http://www.w3.org/pub/WWW/TheProject.html ', true);
            httpRequest.send();
        }


    }
})();