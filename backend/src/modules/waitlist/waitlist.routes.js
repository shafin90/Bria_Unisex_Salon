const express = require('express');
const router = express.Router();
const waitlistController = require('./waitlist.controller');

router.post('/join', waitlistController.join);
router.get('/date/:date', waitlistController.getByDate);

module.exports = router;
