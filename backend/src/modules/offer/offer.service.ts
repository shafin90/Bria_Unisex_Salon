import offerRepository  from './offer.repository';

const offerService = {
    addOffer: async (data, tenantId) => {
        return await offerRepository.create(data, tenantId);
    },
    getAll: async (tenantId) => {
        return await offerRepository.findAll(tenantId);
    },
    getByStatus: async (status, tenantId) => {
        return await offerRepository.findByStatus(status, tenantId);
    },
    getById: async (id, tenantId) => {
        return await offerRepository.findById(id, tenantId);
    },
    updateOffer: async (id, data, tenantId) => {
        return await offerRepository.findByIdAndUpdate(id, data, tenantId);
    }
};

export default offerService;
