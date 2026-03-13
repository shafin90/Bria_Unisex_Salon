const portfolioRepository = require('./portfolio.repository');

const portfolioService = {
    addWork: async (data) => {
        return await portfolioRepository.create(data);
    },
    getGallery: async () => {
        return await portfolioRepository.findGallery();
    }
};

module.exports = portfolioService;
