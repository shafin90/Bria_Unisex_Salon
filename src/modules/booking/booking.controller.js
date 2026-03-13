const bookingService = require('./booking.service');
const { generateBookingTicket } = require('../../utils/pdfGenerator');

const bookingController = {
    addBooking: async (req, res) => {
        try {
            const bookingAdded = await bookingService.createBooking(req.body);
            res.json({ message: "Booking confirmed", success: true, bookingAdded });
        } catch (error) {
            res.status(400).json({ errorMessage: "Something went wrong", error: error.message });
        }
    },
    getAllBooking: async (req, res) => {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 12;
            const result = await bookingService.getBookings(page, limit);
            res.json(result);
        } catch (error) {
            res.status(500).json({ errorMessage: "Something went wrong", error: error.message });
        }
    },
    getRecentBooking: async (req, res) => {
        try {
            const bookings = await bookingService.getRecent();
            res.json(bookings);
        } catch (error) {
            res.status(500).json({ message: "something went wrong", error: error.message });
        }
    },
    getParticularBooking: async (req, res) => {
        try {
            const { phoneNumber } = req.params;
            const booking = await bookingService.getParticular(phoneNumber);
            if (!booking) {
                return res.json({ success: false, message: "booking data is missing in database" });
            }
            res.json({ success: true, getParticularBooking: booking });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    },
    generateTicket: async (req, res) => {
        try {
            const { bookingId } = req.params;
            const booking = await bookingService.getById(bookingId);
            if (!booking) return res.status(404).json({ success: false, message: "Booking not found" });
            
            const pdfBuffer = await generateBookingTicket(booking);
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', `attachment; filename="booking-ticket-${booking.confirmationCode}.pdf"`);
            res.send(pdfBuffer);
        } catch (error) {
            res.status(500).json({ success: false, message: "Failed to generate ticket", error: error.message });
        }
    }
};

module.exports = bookingController;
