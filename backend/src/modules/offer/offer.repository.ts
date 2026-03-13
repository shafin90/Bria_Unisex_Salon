import Offer  from './offer.model';

const offerRepository = {
    create: async (data, tenantId) => {
        return await Offer.create({ ...data, tenantId });
    },
    findAll: async (tenantId) => {
        return await Offer.findAll({ where: { tenantId } });
    },
    findByStatus: async (status, tenantId) => {
        return await Offer.findAll({ where: { status, tenantId } });
    },
    findById: async (id, tenantId) => {
        return await Offer.findOne({ where: { id, tenantId } });
    },
    findByIdAndUpdate: async (id, data, tenantId) => {
        const offer = await Offer.findOne({ where: { id, tenantId } });
        if (offer) {
            return await offer.update(data);
        }
        return null;
    },
    findOne: async (query, tenantId) => {
        return await Offer.findOne({ where: { ...query, tenantId } });
    }
};

export default offerRepository;
