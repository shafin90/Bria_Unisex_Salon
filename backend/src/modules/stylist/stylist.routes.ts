import express  from 'express';
const router = express.Router();
import stylistController  from './stylist.controller';

router.post('/add', stylistController.add);
router.get('/all', stylistController.getAll);
router.put('/update/:id', stylistController.update);

export default router;
