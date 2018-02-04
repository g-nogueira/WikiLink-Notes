(function () {
    'using strict';

    //Node modules
    const url = require('url');

    //Self modules
    const repo = require('./repository');
    const everNoteRouter = require('./routes/everNote');
    const auth = require('./routes/auth');
    const userRoute = require('./routes/user');

    //External modules
    const express = require('express');
    const app = express();
    const session = require('express-session');
    const passport = require('passport');
    const EvernoteStrategy = require('passport-evernote');
    const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;


    initPassportMiddleware();
    initPassportStrategies();
    initRoutes();
    app.listen(8080, error => { });

    function initRoutes() {

        app.get('/', (req, res) => {
            // res.writeHead(200, {
            //     'Content-type': 'application/json',
            //     'Access-Control-Allow-Origin': '*', //The allowed origin that can make requests
            //     'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE', //The allowed http methods
            //     'Access-Control-Max-Age': 300,
            //     'Access-Control-Allow-Headers': '*'
            // });

            const q = url.parse(req.url, true).query;
            if (repo.methods[q.m]) {
                const resp = repo.methods[q.m](q.v);
                res.send(resp);
            }
            // res.send({resp: req.session.passport.user});

        });
        app.use('/auth', auth);
        app.use('/en', everNoteRouter);
        app.use('/user', userRoute);

    }

    function initPassportMiddleware() {
        app.use(session({ secret: 'testingPassport', resave: false, saveUninitialized: false }));
        app.use(passport.initialize());
        app.use(passport.session());

        passport.serializeUser((user, done) => {
            done(null, user);
        });
        passport.deserializeUser((user, done) => {
            done(null, user);
        });
    }

    function initPassportStrategies() {
        passport.use(new GoogleStrategy({
            clientID: '208273289526-oj1bldsgt0qeb5e5a63v088gm6vvhfqp.apps.googleusercontent.com',
            clientSecret: 'OOq5lT-pGWc7Ifu7ZKu_To_q',
            callbackURL: 'http://localhost:8080/auth/google/callback'
        },
            (req, accessToken, refreshToken, profile, done) => {
                done(null, profile);
            }
        ));

        passport.use(new EvernoteStrategy({
            requestTokenURL: 'https://sandbox.evernote.com/oauth',
            accessTokenURL: 'https://sandbox.evernote.com/oauth',
            userAuthorizationURL: 'https://sandbox.evernote.com/OAuth.action',
            consumerKey: 'ghdrn11',
            consumerSecret: '0437e0877391b087',
            callbackURL: "http://localhost:8080/?m=en_oauth"
        }, (token, tokebSecret, profile, done) => {
            done(null, profile);
        }));
    }
})();

