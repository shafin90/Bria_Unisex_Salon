import Service  from './service.model';

const serviceRepository = {
    create: async (data, tenantId) => {
        return await Service.create({ ...data, tenantId });
    },
    findAll: async (skip, limit, tenantId) => {
        return await Service.findAll({ where: { tenantId }, offset: skip, limit: limit });
    },
    count: async (tenantId) => {
        return await Service.count({ where: { tenantId } });
    },
    findTop: async (tenantId) => {
        return await Service.findAll({ where: { tenantId }, order: [['bookingCount', 'DESC']] });
    },
    findById: async (id, tenantId) => {
        return await Service.findOne({ where: { id, tenantId } });
    },
    findByIdAndUpdate: async (id, data, tenantId) => {
        const service = await Service.findOne({ where: { id, tenantId } });
        if (service) {
            return await service.update(data);
        }
        return null;
    },
    deleteById: async (id, tenantId) => {
        return await Service.destroy({ where: { id, tenantId } });
    },
    findOne: async (query, tenantId) => {
        return await Service.findOne({ where: { ...query, tenantId } });
    }
};

export default serviceRepository;
