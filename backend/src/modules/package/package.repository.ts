import Package  from './package.model';

const packageRepository = {
    create: async (data, tenantId) => {
        return await Package.create({ ...data, tenantId });
    },
    findActive: async (tenantId) => {
        return await Package.findAll({ where: { status: "Active", tenantId } });
    },
    findAll: async (tenantId) => {
        return await Package.findAll({ where: { tenantId } });
    }
};

export default packageRepository;
