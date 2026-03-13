const stylistService = require('./stylist.service');

const stylistController = {
    add: async (req, res) => {
        try {
            const stylist = await stylistService.addStylist(req.body);
            res.status(201).json(stylist);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },
    getAll: async (req, res) => {
        try {
            const stylists = await stylistService.getAllStylists();
            res.json(stylists);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    update: async (req, res) => {
        try {
            const stylist = await stylistService.updateStylist(req.params.id, req.body);
            if (!stylist) return res.status(404).json({ message: "Stylist not found" });
            res.json(stylist);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
};

module.exports = stylistController;
