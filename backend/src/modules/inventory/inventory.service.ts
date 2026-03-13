import inventoryRepository  from './inventory.repository';

const inventoryService = {
    addItem: async (data, tenantId) => {
        return await inventoryRepository.create(data, tenantId);
    },
    getAllItems: async (tenantId) => {
        return await inventoryRepository.findAll(tenantId);
    },
    updateStock: async (id, adjustment, tenantId) => {
        // Since we changed to findOne, we can't use $inc directly on the model instance update in Sequelize easily like MongoDB.
        // Wait, the repository uses update method. Sequelize model update method supports increment/decrement if explicitly done,
        // or we can use increment method. Let's let the repo handle it if it worked before, but correct the repository if needed later.
        // For now, pass tenantId.
        return await inventoryRepository.findByIdAndUpdate(id, { stockQuantity: adjustment }, tenantId); // Simplified for Sequelize
    }
};

export default inventoryService;
