const serviceRepository = require('./service.repository');

const serviceService = {
    addService: async (serviceData) => {
        return await serviceRepository.create(serviceData);
    },
    getServices: async (page, limit) => {
        const skip = (page - 1) * limit;
        const services = await serviceRepository.findAll(skip, limit);
        const total = await serviceRepository.count();
        return {
            services,
            total,
            totalPages: Math.ceil(total / limit),
            currentPage: page
        };
    },
    getTopServices: async () => {
        return await serviceRepository.findTop();
    },
    getServiceById: async (id) => {
        return await serviceRepository.findById(id);
    },
    updateService: async (id, updateData) => {
        return await serviceRepository.findByIdAndUpdate(id, updateData);
    },
    deleteService: async (id) => {
        return await serviceRepository.deleteById(id);
    }
};

module.exports = serviceService;
