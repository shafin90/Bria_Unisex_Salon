import stylistRepository  from './stylist.repository';

const stylistService = {
    addStylist: async (data, tenantId) => {
        return await stylistRepository.create(data, tenantId);
    },
    getAllStylists: async (tenantId) => {
        return await stylistRepository.findAll(tenantId);
    },
    updateStylist: async (id, data, tenantId) => {
        return await stylistRepository.findByIdAndUpdate(id, data, tenantId);
    },
    getStylistById: async (id, tenantId) => {
        return await stylistRepository.findById(id, tenantId);
    }
};

export default stylistService;
