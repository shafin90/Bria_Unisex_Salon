const Stylist = require('./stylist.model');

const stylistRepository = {
    create: async (data) => {
        return await Stylist.create(data);
    },
    findAll: async () => {
        return await Stylist.findAll();
    },
    findById: async (id) => {
        return await Stylist.findByPk(id);
    },
    findByIdAndUpdate: async (id, data) => {
        const stylist = await Stylist.findByPk(id);
        if (stylist) {
            return await stylist.update(data);
        }
        return null;
    }
};

module.exports = stylistRepository;
