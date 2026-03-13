const express = require('express');
const router = express.Router();
const authController = require('./auth.controller');

router.post('/login', authController.login);
router.post('/forget-password', authController.submitForgetPassMail);
router.post('/verify-otp', authController.submitForgetPassOTP);
router.post('/reset-password', authController.resetPass);

module.exports = router;
