const Service = require('./service.model');

const serviceRepository = {
    create: async (data) => {
        return await Service.create(data);
    },
    findAll: async (skip, limit) => {
        return await Service.findAll({ offset: skip, limit: limit });
    },
    count: async () => {
        return await Service.count();
    },
    findTop: async () => {
        return await Service.findAll({ order: [['bookingCount', 'DESC']] });
    },
    findById: async (id) => {
        return await Service.findByPk(id);
    },
    findByIdAndUpdate: async (id, data) => {
        const service = await Service.findByPk(id);
        if (service) {
            return await service.update(data);
        }
        return null;
    },
    deleteById: async (id) => {
        return await Service.destroy({ where: { id } });
    },
    findOne: async (query) => {
        return await Service.findOne({ where: query });
    }
};

module.exports = serviceRepository;
