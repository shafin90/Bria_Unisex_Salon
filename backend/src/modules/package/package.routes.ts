import express  from 'express';
const router = express.Router();
import packageController  from './package.controller';

router.post('/add', packageController.add);
router.get('/active', packageController.getActive);

export default router;
