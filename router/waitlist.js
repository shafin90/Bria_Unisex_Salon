const express = require("express");
const router = express.Router();
const Waitlist = require("../model/waitlistSchema");

// Join waitlist
router.post("/join", async (req, res) => {
    try {
        const entry = new Waitlist(req.body);
        await entry.save();
        res.status(201).json(entry);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Get waitlist for a date
router.get("/date/:date", async (req, res) => {
    try {
        const list = await Waitlist.find({ preferredDate: req.params.date }).populate('userId');
        res.json(list);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
