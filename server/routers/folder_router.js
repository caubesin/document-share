const express = require('express');
const router = express.Router();

const folder_ctrl = require('../controller/folder_ctrl');

const isLogin = function (req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/account/signin');
};

router.get("/create", isLogin, folder_ctrl.createFolder)


module.exports = router;