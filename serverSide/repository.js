(function () {
    'using strict';

    const franc = require('franc-min');
    const passport = require('passport');

    class Repository {
        constructor() {
            this.methods = {
                language: this.langIdentification,
                en_oauth: this.evernote,
                en_login: this.evernoteLogin

            };
        }

        langIdentification(extract) {
            const whitelist = ['por', 'eng', 'spa', 'deu', 'fra', 'ita', 'rus'];
            const francRes = { language: franc(extract, { whitelist: whitelist }) };
            const languages = {
                por: 'pt', eng: 'en', spa: 'es', deu: 'de',
                fra: 'fr', ita: 'it', rus: 'ru'
            };


            return { language: languages[francRes.language] };
        }

        evernoteLogin() {
            let t = '';
            passport.initialize();



            return t;
        }
        evernote() {
        }
    }

    const repository = new Repository();
    module.exports = repository;
})();