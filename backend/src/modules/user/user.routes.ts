import express  from 'express';
const router = express.Router();
import userController  from './user.controller';

router.get('/getFrequentlyUser', userController.getFrequentlyUser);

export default router;
