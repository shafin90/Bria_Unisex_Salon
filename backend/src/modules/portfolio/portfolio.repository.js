const Portfolio = require('./portfolio.model');
const Stylist = require('../stylist/stylist.model');

const portfolioRepository = {
    create: async (data) => {
        return await Portfolio.create(data);
    },
    findGallery: async () => {
        return await Portfolio.findAll({ include: [Stylist] });
    }
};

module.exports = portfolioRepository;
