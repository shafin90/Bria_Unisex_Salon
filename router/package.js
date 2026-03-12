const express = require("express");
const router = express.Router();
const Package = require("../model/packageSchema");

// Add a new package
router.post("/add", async (req, res) => {
    try {
        const packageData = new Package(req.body);
        await packageData.save();
        res.status(201).json(packageData);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Get all active packages
router.get("/active", async (req, res) => {
    try {
        const packages = await Package.find({ status: "Active" }).populate('services');
        res.json(packages);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
