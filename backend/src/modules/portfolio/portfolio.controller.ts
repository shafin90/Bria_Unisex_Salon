import portfolioService  from './portfolio.service';

const portfolioController = {
    add: async (req, res) => {
        try {
            const tenantId = req.tenantId || req.body.tenantId;
            if (!tenantId) return res.status(400).json({ error: "tenantId is required" });

            const work = await portfolioService.addWork(req.body, tenantId);
            res.status(201).json(work);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    },
    getGallery: async (req, res) => {
        try {
            const tenantId = req.tenantId || req.query.tenantId;
            if (!tenantId) return res.status(400).json({ error: "tenantId is required" });

            const gallery = await portfolioService.getGallery(tenantId);
            res.json(gallery);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }
};

export default portfolioController;
