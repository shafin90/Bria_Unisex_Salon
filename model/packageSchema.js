const mongoose = require("mongoose");

const packageSchema = mongoose.Schema({
    packageName: {
        type: String,
        required: true
    },
    services: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Service'
    }],
    price: {
        type: Number,
        required: true
    },
    description: {
        type: String
    },
    img: {
        type: String
    },
    status: {
        type: String,
        default: "Active"
    }
}, {
    timestamps: true
});

const Package = mongoose.model("Package", packageSchema);

module.exports = Package;
