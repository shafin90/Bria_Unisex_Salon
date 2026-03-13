const Inventory = require('./inventory.model');

const inventoryRepository = {
    create: async (data) => {
        return await Inventory.create(data);
    },
    findAll: async () => {
        return await Inventory.findAll();
    },
    findByIdAndUpdate: async (id, update) => {
        const item = await Inventory.findByPk(id);
        if (item) {
            return await item.update(update);
        }
        return null;
    },
    findById: async (id) => {
        return await Inventory.findByPk(id);
    }
};

module.exports = inventoryRepository;
