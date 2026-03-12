const mongoose = require("mongoose");

const portfolioSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    beforeImg: {
        type: String
    },
    afterImg: {
        type: String,
        required: true
    },
    stylistId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Stylist'
    }
}, {
    timestamps: true
});

const Portfolio = mongoose.model("Portfolio", portfolioSchema);

module.exports = Portfolio;
