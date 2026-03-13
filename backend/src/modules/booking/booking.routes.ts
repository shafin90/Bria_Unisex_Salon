import express  from 'express';
const router = express.Router();
import bookingController  from './booking.controller';
import { isTenantAdmin, isStylist } from '../../middleware/auth.middleware';
import { auditMiddleware } from '../audit/audit.middleware';

router.post('/addBooking', isStylist, auditMiddleware('CREATE_BOOKING', 'Booking'), bookingController.addBooking);
router.get('/getAllBooking', isTenantAdmin, bookingController.getAllBooking);
router.get('/getRecentBooking', isTenantAdmin, bookingController.getRecentBooking);
router.get('/getParticularBooking/:phoneNumber', isTenantAdmin, bookingController.getParticularBooking);
router.get('/generateTicket/:bookingId', isTenantAdmin, bookingController.generateTicket);

export default router;
