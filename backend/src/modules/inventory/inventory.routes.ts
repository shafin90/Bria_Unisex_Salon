import express  from 'express';
const router = express.Router();
import inventoryController  from './inventory.controller';
import { isManager }  from '../../middleware/auth.middleware';

router.post('/add', isManager, inventoryController.addItem);
router.get('/all', inventoryController.getAll);
router.patch('/update-stock/:id', inventoryController.updateStock);

export default router;
