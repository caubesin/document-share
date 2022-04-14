const express = require('express');
const router = express.Router();
const user_ctrl = require('../controller/user_ctrl')

const isLogin = function (req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/account/signin');
};

router.get('/' , isLogin,user_ctrl.getUserData);
router.get('/friend', isLogin, user_ctrl.getFriendUser);
router.get('/friend/handle', isLogin, user_ctrl.handleFriend);
router.get('/friend/find', isLogin, user_ctrl.findFriend);
module.exports = router;