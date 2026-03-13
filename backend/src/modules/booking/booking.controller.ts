import bookingService  from './booking.service';
import { generateBookingTicket }  from '../../utils/pdfGenerator';

const bookingController = {
    addBooking: async (req, res) => {
        try {
            const tenantId = req.tenantId || req.body.tenantId;
            if (!tenantId) return res.status(400).json({ error: "tenantId is required" });

            const bookingAdded = await bookingService.createBooking(req.body, tenantId);
            res.json({ message: "Booking confirmed", success: true, bookingAdded });
        } catch (error: any) {
            res.status(400).json({ errorMessage: "Something went wrong", error: error.message });
        }
    },
    getAllBooking: async (req, res) => {
        try {
            const tenantId = req.tenantId || req.query.tenantId;
            if (!tenantId) return res.status(400).json({ error: "tenantId is required" });

            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 12;
            const result = await bookingService.getBookings(page, limit, tenantId);
            res.json(result);
        } catch (error: any) {
            res.status(500).json({ errorMessage: "Something went wrong", error: error.message });
        }
    },
    getRecentBooking: async (req, res) => {
        try {
            const tenantId = req.tenantId || req.query.tenantId;
            if (!tenantId) return res.status(400).json({ error: "tenantId is required" });

            const bookings = await bookingService.getRecent(tenantId);
            res.json(bookings);
        } catch (error: any) {
            res.status(500).json({ message: "something went wrong", error: error.message });
        }
    },
    getParticularBooking: async (req, res) => {
        try {
            const tenantId = req.tenantId || req.query.tenantId;
            if (!tenantId) return res.status(400).json({ error: "tenantId is required" });

            const { phoneNumber } = req.params;
            const booking = await bookingService.getParticular(phoneNumber, tenantId);
            if (!booking) {
                return res.json({ success: false, message: "booking data is missing in database" });
            }
            res.json({ success: true, getParticularBooking: booking });
        } catch (error: any) {
            res.status(500).json({ success: false, error: error.message });
        }
    },
    generateTicket: async (req, res) => {
        try {
            const tenantId = req.tenantId || req.query.tenantId;
            if (!tenantId) return res.status(400).json({ error: "tenantId is required" });

            const { bookingId } = req.params;
            const booking = await bookingService.getById(bookingId, tenantId);
            if (!booking) return res.status(404).json({ success: false, message: "Booking not found" });
            
            const pdfBuffer = await generateBookingTicket(booking);
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', `attachment; filename="booking-ticket-${(booking as any).confirmationCode}.pdf"`);
            res.send(pdfBuffer);
        } catch (error: any) {
            res.status(500).json({ success: false, message: "Failed to generate ticket", error: error.message });
        }
    }
};

export default bookingController;
