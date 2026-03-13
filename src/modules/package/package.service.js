const packageRepository = require('./package.repository');

const packageService = {
    addPackage: async (data) => {
        return await packageRepository.create(data);
    },
    getActivePackages: async () => {
        return await packageRepository.findActive();
    }
};

module.exports = packageService;
