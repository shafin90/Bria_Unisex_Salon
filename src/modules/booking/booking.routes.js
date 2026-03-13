const express = require('express');
const router = express.Router();
const bookingController = require('./booking.controller');

router.post('/addBooking', bookingController.addBooking);
router.get('/getAllBooking', bookingController.getAllBooking);
router.get('/getRecentBooking', bookingController.getRecentBooking);
router.get('/getParticularBooking/:phoneNumber', bookingController.getParticularBooking);
router.get('/generateTicket/:bookingId', bookingController.generateTicket);

module.exports = router;
