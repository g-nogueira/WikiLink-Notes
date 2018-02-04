(function () {
    'using strict';

    // initEvents();
    getUser();

    function initEvents() {

        // document.getElementById('signInGoogle').onclick = googleSignin;


        function googleSignin() {
            http.get('http://localhost:8080/auth/google/?redirect=chrome-extension://lckbiclbfdooecdkjkbebanadchafmbn/optionsPage/index.html');
        }
    }

    async function getUser(){
        let user = await http.get('http://localhost:8080/user/google');
    };

})();