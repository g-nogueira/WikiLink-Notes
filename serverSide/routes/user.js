(function () {
    'using strict';

    const express = require('express');
    const passport = require('passport');
    const user = require('../user');
    const userRouter = express.Router();


    userRouter
        .route('/google')
        .get((req, res) => {
            res.send(user.profile);
        });

    module.exports = userRouter;

})();