import Stylist  from './stylist.model';

const stylistRepository = {
    create: async (data, tenantId) => {
        return await Stylist.create({ ...data, tenantId });
    },
    findAll: async (tenantId) => {
        return await Stylist.findAll({ where: { tenantId } });
    },
    findById: async (id, tenantId) => {
        return await Stylist.findOne({ where: { id, tenantId } });
    },
    findByIdAndUpdate: async (id, data, tenantId) => {
        const stylist = await Stylist.findOne({ where: { id, tenantId } });
        if (stylist) {
            return await stylist.update(data);
        }
        return null;
    }
};

export default stylistRepository;
