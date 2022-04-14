const express = require('express');
const router = express.Router();
const upload = require('../config/multer_config');

const file_ctrl = require('../controller/file_ctrl');

const isLogin = function (req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/account/signin');
};


router.get('/',isLogin ,file_ctrl.getOneFile);
router.get('/delete', isLogin, file_ctrl.deleteFile)
router.get('/download/:fileId', file_ctrl.downLoadFile)
router.post('/upload/single',upload.single("file"), file_ctrl.upLoadFile);
router.post('/upload/multiple',upload.array("file"), file_ctrl.upLoadFile);
router.post('/share', file_ctrl.shareFile)
router.post('/share-link', file_ctrl.accessShareLink);


module.exports = router;