const express = require('express');
const router = express.Router();
const packageController = require('./package.controller');

router.post('/add', packageController.add);
router.get('/active', packageController.getActive);

module.exports = router;
