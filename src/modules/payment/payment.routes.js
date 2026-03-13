const express = require('express');
const router = express.Router();
const paymentController = require('./payment.controller');
const { isOwner } = require('../../middleware/auth.middleware');

router.post('/record', isOwner, paymentController.record);
router.post('/record-stripe-success', paymentController.recordStripeSuccess);

module.exports = router;
