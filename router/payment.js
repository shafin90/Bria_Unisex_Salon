const express = require("express");
const router = express.Router();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY || "sk_test_51P"); // Replace with actual key or env
const Payment = require("../model/paymentSchema");
const Booking = require("../model/bookingSchema");
const Stylist = require("../model/stylistSchema");
const { isOwner } = require("../utils/authMiddleware");


// Record payment
router.post("/record", isOwner, async (req, res) => {
    const { amount, currency, bookingId, userId } = req.body;

    try {
        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(amount * 100), // convert to cents
            currency: currency || "usd",
            metadata: { bookingId, userId }
        });

        res.send({
            clientSecret: paymentIntent.client_secret,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Record a successful stripe payment
router.post("/record-stripe-success", async (req, res) => {
    const { bookingId, userId, amount, paymentIntentId, paymentMethod } = req.body;

    try {
        // Find booking to get stylist
        const booking = await Booking.findById(bookingId);
        let commissionAmount = 0;
        let stylistId = null;

        if (booking && booking.stylistId) {
            stylistId = booking.stylistId;
            const stylist = await Stylist.findById(stylistId);
            if (stylist) {
                commissionAmount = (amount * stylist.commissionRate) / 100;
            }
        }

        const payment = new Payment({
            bookingId,
            userId,
            amount,
            paymentMethod: paymentMethod || 'Card',
            transactionId: paymentIntentId,
            status: 'Completed',
            commissionAmount,
            stylistId
        });
        await payment.save();
        res.status(201).json({ success: true, payment });
    } catch (error) {

        res.status(400).json({ error: error.message });
    }
});

module.exports = router;
