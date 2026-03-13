import stylistService  from './stylist.service';

const stylistController = {
    add: async (req, res) => {
        try {
            const tenantId = req.tenantId || req.body.tenantId; // req.tenantId should come from middleware
            if (!tenantId) return res.status(400).json({ error: "tenantId is required" });
            
            const stylist = await stylistService.addStylist(req.body, tenantId);
            res.status(201).json(stylist);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    },
    getAll: async (req, res) => {
        try {
            const tenantId = req.tenantId || req.query.tenantId; // Fallback to query if middleware not fully strictly applied yet
            if (!tenantId) return res.status(400).json({ error: "tenantId is required" });

            const stylists = await stylistService.getAllStylists(tenantId);
            res.json(stylists);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    },
    update: async (req, res) => {
        try {
            const tenantId = req.tenantId || req.body.tenantId;
            if (!tenantId) return res.status(400).json({ error: "tenantId is required" });

            const stylist = await stylistService.updateStylist(req.params.id, req.body, tenantId);
            if (!stylist) return res.status(404).json({ message: "Stylist not found" });
            res.json(stylist);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }
};

export default stylistController;
