import inventoryService  from './inventory.service';

const inventoryController = {
    addItem: async (req, res) => {
        try {
            const tenantId = req.tenantId || req.body.tenantId;
            if (!tenantId) return res.status(400).json({ error: "tenantId is required" });

            const item = await inventoryService.addItem(req.body, tenantId);
            res.status(201).json(item);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    },
    getAll: async (req, res) => {
        try {
            const tenantId = req.tenantId || req.query.tenantId;
            if (!tenantId) return res.status(400).json({ error: "tenantId is required" });

            const items = await inventoryService.getAllItems(tenantId);
            res.json(items);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    },
    updateStock: async (req, res) => {
        try {
            const tenantId = req.tenantId || req.body.tenantId;
            if (!tenantId) return res.status(400).json({ error: "tenantId is required" });

            const { adjustment } = req.body;
            const item = await inventoryService.updateStock(req.params.id, adjustment, tenantId);
            res.json(item);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }
};

export default inventoryController;
