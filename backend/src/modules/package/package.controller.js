const packageService = require('./package.service');

const packageController = {
    add: async (req, res) => {
        try {
            const pkg = await packageService.addPackage(req.body);
            res.status(201).json(pkg);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },
    getActive: async (req, res) => {
        try {
            const packages = await packageService.getActivePackages();
            res.json(packages);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
};

module.exports = packageController;
