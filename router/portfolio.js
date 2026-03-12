const express = require("express");
const router = express.Router();
const Portfolio = require("../model/portfolioSchema");

// Add portfolio work
router.post("/add", async (req, res) => {
    try {
        const work = new Portfolio(req.body);
        await work.save();
        res.status(201).json(work);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Get gallery
router.get("/gallery", async (req, res) => {
    try {
        const portfolio = await Portfolio.find().populate('stylistId');
        res.json(portfolio);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
