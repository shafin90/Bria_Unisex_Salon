const portfolioService = require('./portfolio.service');

const portfolioController = {
    add: async (req, res) => {
        try {
            const work = await portfolioService.addWork(req.body);
            res.status(201).json(work);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },
    getGallery: async (req, res) => {
        try {
            const gallery = await portfolioService.getGallery();
            res.json(gallery);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
};

module.exports = portfolioController;
