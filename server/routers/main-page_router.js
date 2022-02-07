const express = require('express');
const router = express.Router();
const auth_ctrl = require('../controller/account_ctrl');
const data_ctrl = require('../controller/data_ctrl');
const upload = require('../config/multer_config');

const isLogin = function (req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/account/signin');
};

router.all('/', isLogin, auth_ctrl.successAuth);
router.post('/upload',upload.single("file"), data_ctrl.upLoadFile);

module.exports = router;