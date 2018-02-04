(function () {
    'using strict';

    const express = require('express');
    const passport = require('passport');
    let user = require('../user');
    const authRouter = express.Router();

    let redirectRoute = '/';

    authRouter
        .route('/google/callback')
        .get(passport.authenticate('google', {
            failure: '/login',
        }),
        // Successful authentication, redirect home.
        (req, res) => {
            console.log('auth.js ln17');
            user.profile = req.user;
            res.redirect(redirectRoute);
        });


    authRouter
        .route('/google')
        .get((req, res) => {
            redirectRoute = req.query.redirect;
            console.log(redirectRoute);
            res.redirect('http://localhost:8080/auth/google/auth');
        });
    authRouter
        .route('/google/auth')
        .get(passport.authenticate('google', {
            scope: [
                'https://www.googleapis.com/auth/userinfo.profile',
                'https://www.googleapis.com/auth/userinfo.email'
            ],
        }));

    module.exports = authRouter;
})();