import express  from 'express';
const router = express.Router();
import waitlistController  from './waitlist.controller';

router.post('/join', waitlistController.join);
router.get('/date/:date', waitlistController.getByDate);

export default router;
