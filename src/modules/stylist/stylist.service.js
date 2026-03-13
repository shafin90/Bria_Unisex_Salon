const stylistRepository = require('./stylist.repository');

const stylistService = {
    addStylist: async (data) => {
        return await stylistRepository.create(data);
    },
    getAllStylists: async () => {
        return await stylistRepository.findAll();
    },
    updateStylist: async (id, data) => {
        return await stylistRepository.findByIdAndUpdate(id, data);
    },
    getStylistById: async (id) => {
        return await stylistRepository.findById(id);
    }
};

module.exports = stylistService;
