import packageRepository  from './package.repository';

const packageService = {
    addPackage: async (data, tenantId) => {
        return await packageRepository.create(data, tenantId);
    },
    getActivePackages: async (tenantId) => {
        return await packageRepository.findActive(tenantId);
    }
};

export default packageService;
