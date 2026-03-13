const inventoryRepository = require('./inventory.repository');

const inventoryService = {
    addItem: async (data) => {
        return await inventoryRepository.create(data);
    },
    getAllItems: async () => {
        return await inventoryRepository.findAll();
    },
    updateStock: async (id, adjustment) => {
        return await inventoryRepository.findByIdAndUpdate(id, { $inc: { stockQuantity: adjustment } });
    }
};

module.exports = inventoryService;
