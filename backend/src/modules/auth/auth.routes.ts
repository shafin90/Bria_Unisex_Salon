import express  from 'express';
const router = express.Router();
import authController  from './auth.controller';

router.post('/login', authController.login);
router.post('/forget-password', authController.submitForgetPassMail);
router.post('/verify-otp', authController.submitForgetPassOTP);
router.post('/reset-password', authController.resetPass);

export default router;
