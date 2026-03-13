import serviceRepository  from './service.repository';

const serviceService = {
    addService: async (serviceData, tenantId) => {
        return await serviceRepository.create(serviceData, tenantId);
    },
    getServices: async (page, limit, tenantId) => {
        const skip = (page - 1) * limit;
        const services = await serviceRepository.findAll(skip, limit, tenantId);
        const total = await serviceRepository.count(tenantId);
        return {
            services,
            total,
            totalPages: Math.ceil(total / limit),
            currentPage: page
        };
    },
    getTopServices: async (tenantId) => {
        return await serviceRepository.findTop(tenantId);
    },
    getServiceById: async (id, tenantId) => {
        return await serviceRepository.findById(id, tenantId);
    },
    updateService: async (id, updateData, tenantId) => {
        return await serviceRepository.findByIdAndUpdate(id, updateData, tenantId);
    },
    deleteService: async (id, tenantId) => {
        return await serviceRepository.deleteById(id, tenantId);
    }
};

export default serviceService;
