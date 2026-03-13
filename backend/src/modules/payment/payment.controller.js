const paymentService = require('./payment.service');

const paymentController = {
    record: async (req, res) => {
        const { amount, currency, bookingId, userId } = req.body;
        try {
            const paymentIntent = await paymentService.createPaymentIntent(amount, currency, bookingId, userId);
            res.send({ clientSecret: paymentIntent.client_secret });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    recordStripeSuccess: async (req, res) => {
        try {
            const payment = await paymentService.recordStripeSuccess(req.body);
            res.status(201).json({ success: true, payment });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
};

module.exports = paymentController;
