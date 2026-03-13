import express  from 'express';
const router = express.Router();
import chatController  from './chat.controller';

router.get('/history/:user1/:user2', chatController.getHistory);

export default router;
