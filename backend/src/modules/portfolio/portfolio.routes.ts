import express  from 'express';
const router = express.Router();
import portfolioController  from './portfolio.controller';

router.post('/add', portfolioController.add);
router.get('/gallery', portfolioController.getGallery);

export default router;
