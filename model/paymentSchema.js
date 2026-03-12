const mongoose = require("mongoose");

const paymentSchema = mongoose.Schema({
    bookingId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Booking',
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    amount: {
        type: Number,
        required: true
    },
    paymentMethod: {
        type: String,
        enum: ['Cash', 'bKash', 'Nagad', 'Card'],
        required: true
    },
    transactionId: {
        type: String
    },
    status: {
        type: String,
        enum: ['Pending', 'Completed', 'Failed', 'Refunded'],
        default: 'Completed'
    },
    commissionAmount: {
        type: Number,
        default: 0
    },
    stylistId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Stylist'
    }
}, {

    timestamps: true
});

const Payment = mongoose.model("Payment", paymentSchema);

module.exports = Payment;
