const express = require('express');
const router = express.Router();

const data_ctrl = require('../controller/data_ctrl');
router.get('/', data_ctrl.getAllFile)
router.get('/:fileId', data_ctrl.getOneFile);

module.exports = router;