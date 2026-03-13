const Offer = require('./offer.model');

const offerRepository = {
    create: async (data) => {
        return await Offer.create(data);
    },
    findAll: async () => {
        return await Offer.findAll();
    },
    findByStatus: async (status) => {
        return await Offer.findAll({ where: { status } });
    },
    findById: async (id) => {
        return await Offer.findByPk(id);
    },
    findByIdAndUpdate: async (id, data) => {
        const offer = await Offer.findByPk(id);
        if (offer) {
            return await offer.update(data);
        }
        return null;
    },
    findOne: async (query) => {
        return await Offer.findOne({ where: query });
    }
};

module.exports = offerRepository;
