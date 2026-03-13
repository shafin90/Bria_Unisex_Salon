const express = require('express');
const router = express.Router();
const userController = require('./user.controller');

router.get('/getFrequentlyUser', userController.getFrequentlyUser);

module.exports = router;
