const mongoose = require("mongoose");

const stylistSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    specialization: {
        type: [String], // e.g., ["Haircut", "Facial"]
        default: []
    },
    rating: {
        type: Number,
        default: 5
    },
    availability: {
        type: Boolean,
        default: true
    },
    img: {
        type: String,
        default: ""
    },
    commissionRate: {
        type: Number,
        default: 10 // defaults to 10%
    }
}, {

    timestamps: true
});

const Stylist = mongoose.model("Stylist", stylistSchema);

module.exports = Stylist;
