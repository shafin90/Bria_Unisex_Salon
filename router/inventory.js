const express = require("express");
const router = express.Router();
const Inventory = require("../model/inventorySchema");
const { isManager } = require("../utils/authMiddleware");

// Add inventory item
router.post("/add", isManager, async (req, res) => {

    try {
        const item = new Inventory(req.body);
        await item.save();
        res.status(201).json(item);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Get all items
router.get("/all", async (req, res) => {
    try {
        const items = await Inventory.find();
        res.json(items);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update stock
router.patch("/update-stock/:id", async (req, res) => {
    try {
        const item = await Inventory.findByIdAndUpdate(req.params.id, 
            { $inc: { stockQuantity: req.body.adjustment } }, 
            { new: true }
        );
        res.json(item);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;
