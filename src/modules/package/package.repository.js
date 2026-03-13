const Package = require('./package.model');

const packageRepository = {
    create: async (data) => {
        return await Package.create(data);
    },
    findActive: async () => {
        return await Package.findAll({ where: { status: "Active" } });
    },
    findAll: async () => {
        return await Package.findAll();
    }
};

module.exports = packageRepository;
