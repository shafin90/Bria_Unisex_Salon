const inventoryService = require('./inventory.service');

const inventoryController = {
    addItem: async (req, res) => {
        try {
            const item = await inventoryService.addItem(req.body);
            res.status(201).json(item);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },
    getAll: async (req, res) => {
        try {
            const items = await inventoryService.getAllItems();
            res.json(items);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    updateStock: async (req, res) => {
        try {
            const { adjustment } = req.body;
            const item = await inventoryService.updateStock(req.params.id, adjustment);
            res.json(item);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
};

module.exports = inventoryController;
