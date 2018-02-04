(function () {
    'using strict';

    const express = require('express');
    const everNoteRouter = express.Router();

    everNoteRouter
        .route('/')
        .get((req, res) => {
            res.send('');
        });

    module.exports = everNoteRouter;

})();