const paymentRepository = require('./payment.repository');
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY || "sk_test_51P");
const Booking = require('../booking/booking.model');
const Stylist = require('../stylist/stylist.model');

const paymentService = {
    createPaymentIntent: async (amount, currency, bookingId, userId) => {
        return await stripe.paymentIntents.create({
            amount: Math.round(amount * 100),
            currency: currency || "usd",
            metadata: { bookingId, userId }
        });
    },
    recordStripeSuccess: async (paymentData) => {
        const { bookingId, userId, amount, paymentIntentId, paymentMethod } = paymentData;
        
        const booking = await Booking.findById(bookingId);
        let commissionAmount = 0;
        let stylistId = null;

        if (booking && booking.stylistId) {
            stylistId = booking.stylistId;
            const stylist = await Stylist.findById(stylistId);
            if (stylist) {
                commissionAmount = (amount * (stylist.commissionRate || 10)) / 100;
            }
        }

        return await paymentRepository.create({
            bookingId,
            userId,
            amount,
            paymentMethod: paymentMethod || 'Card',
            transactionId: paymentIntentId,
            status: 'Completed',
            commissionAmount,
            stylistId
        });
    }
};

module.exports = paymentService;
