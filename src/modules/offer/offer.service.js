const offerRepository = require('./offer.repository');

const offerService = {
    addOffer: async (data) => {
        return await offerRepository.create(data);
    },
    getAll: async () => {
        return await offerRepository.findAll();
    },
    getByStatus: async (status) => {
        return await offerRepository.findByStatus(status);
    },
    getById: async (id) => {
        return await offerRepository.findById(id);
    },
    updateOffer: async (id, data) => {
        return await offerRepository.findByIdAndUpdate(id, data);
    }
};

module.exports = offerService;
