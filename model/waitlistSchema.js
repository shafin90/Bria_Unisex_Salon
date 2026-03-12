const mongoose = require("mongoose");

const waitlistSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    preferredDate: {
        type: String, // format: "DD-MM-YYYY" to match booking
        required: true
    },
    preferredTimeRange: {
        start: String,
        end: String
    },
    status: {
        type: String,
        enum: ['Waiting', 'Notified', 'Booked', 'Cancelled'],
        default: 'Waiting'
    }
}, {
    timestamps: true
});

const Waitlist = mongoose.model("Waitlist", waitlistSchema);

module.exports = Waitlist;
