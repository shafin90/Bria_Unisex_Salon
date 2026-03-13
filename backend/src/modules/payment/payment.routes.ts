import express  from 'express';
const router = express.Router();
import paymentController  from './payment.controller';
import { isOwner }  from '../../middleware/auth.middleware';

router.post('/record', isOwner, paymentController.record);
router.post('/record-stripe-success', paymentController.recordStripeSuccess);
router.post('/connect', isOwner, paymentController.createConnectAccount);
router.post('/connect/verify', isOwner, paymentController.verifyConnectStatus);

export default router;
