const express = require("express");
const router = express.Router();
const Stylist = require("../model/stylistSchema");

// Add a new stylist
router.post("/add", async (req, res) => {
    try {
        const stylist = new Stylist(req.body);
        await stylist.save();
        res.status(201).json(stylist);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Get all stylists
router.get("/all", async (req, res) => {
    try {
        const stylists = await Stylist.find();
        res.json(stylists);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update stylist
router.put("/update/:id", async (req, res) => {
    try {
        const stylist = await Stylist.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(stylist);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;
