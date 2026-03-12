const mongoose = require("mongoose");

const inventorySchema = mongoose.Schema({
    itemName: {
        type: String,
        required: true
    },
    stockQuantity: {
        type: Number,
        required: true,
        default: 0
    },
    unit: {
        type: String, // e.g., "ml", "pcs", "kg"
        required: true
    },
    reorderLevel: {
        type: Number,
        default: 10
    }
}, {
    timestamps: true
});

const Inventory = mongoose.model("Inventory", inventorySchema);

module.exports = Inventory;
