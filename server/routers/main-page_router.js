const express = require('express');
const router = express.Router();
const auth_ctrl = require('../controller/account_ctrl');
const user_ctrl = require('../controller/user_ctrl');

const isLogin = function (req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/account/signin');
};

router.all('/', isLogin, auth_ctrl.successAuth);
router.get('/data',isLogin, user_ctrl.getCurrentFileAndFolder);

module.exports = router;