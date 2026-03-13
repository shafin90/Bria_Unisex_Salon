import express  from 'express';
const router = express.Router();
import bookingController  from './booking.controller';

router.post('/addBooking', bookingController.addBooking);
router.get('/getAllBooking', bookingController.getAllBooking);
router.get('/getRecentBooking', bookingController.getRecentBooking);
router.get('/getParticularBooking/:phoneNumber', bookingController.getParticularBooking);
router.get('/generateTicket/:bookingId', bookingController.generateTicket);

export default router;
