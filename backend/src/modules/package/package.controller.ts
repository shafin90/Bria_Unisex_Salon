import packageService  from './package.service';

const packageController = {
    add: async (req, res) => {
        try {
            const tenantId = req.tenantId || req.body.tenantId;
            if (!tenantId) return res.status(400).json({ error: "tenantId is required" });

            const pkg = await packageService.addPackage(req.body, tenantId);
            res.status(201).json(pkg);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    },
    getActive: async (req, res) => {
        try {
            const tenantId = req.tenantId || req.query.tenantId;
            if (!tenantId) return res.status(400).json({ error: "tenantId is required" });

            const packages = await packageService.getActivePackages(tenantId);
            res.json(packages);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }
};

export default packageController;
