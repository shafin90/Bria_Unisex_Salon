const express = require('express');
const router = express.Router();
const chatController = require('./chat.controller');

router.get('/history/:user1/:user2', chatController.getHistory);

module.exports = router;
