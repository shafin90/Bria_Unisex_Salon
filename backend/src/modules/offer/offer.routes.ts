import express  from 'express';
const router = express.Router();
import offerController  from './offer.controller';

router.post('/addOffer', offerController.addOffer);
router.get('/getAllOffer', offerController.getAllOffer);
router.get('/getAllActiveOffer', offerController.getAllActiveOffer);
router.get('/getAllInactiveOffer', offerController.getAllInactiveOffer);
router.get('/getParticularOfferById/:id', offerController.getParticularOfferById);
router.put('/editOffer/:id', offerController.editOffer);

export default router;
