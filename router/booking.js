const express = require("express");
const router = express.Router();
const { isStylist } = require("../utils/authMiddleware");
const Booking = require("../model/bookingSchema");


//controllers
const bookingController = require("../controller/bookingController");

router.post("/addBooking", bookingController.addBooking)
router.get("/getAllBooking", bookingController.getAllBooking);
router.get("/getRecentBooking", bookingController.getRecentBooking);
router.get("/getParticularBooking/:phoneNumber", bookingController.getParticularBooking)
router.get("/generateTicket/:bookingId", bookingController.generateTicket)

// Stylist Personal Dashboard: Get appointments assigned to currently logged-in stylist
router.get("/my-appointments", isStylist, async (req, res) => {
    try {
        const stylistId = req.admin.stylistId;
        if (!stylistId) {
            return res.status(400).json({ error: "No stylist profile linked to this account." });
        }
        const appointments = await Booking.find({ stylistId }).sort({ date: -1, time: -1 });
        res.json(appointments);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch your appointments." });
    }
});



module.exports = router;