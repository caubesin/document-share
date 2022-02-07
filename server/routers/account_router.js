const express = require('express');
const router = express.Router();
const passport = require('passport');
require('../config/passport_config');

const account_ctrl = require('../controller/account_ctrl');

router.get('/signin', account_ctrl.sendLoginPage);

router.post('/signin', passport.authenticate('local', {
                            successRedirect: '/',
                            failureRedirect: '/account/fail',
                            failureFlash: false}));

router.get('/fail', account_ctrl.fail_authenticate);
router.post('/signup', account_ctrl.signUpReq);

module.exports = router;