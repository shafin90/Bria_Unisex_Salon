import Inventory  from './inventory.model';

const inventoryRepository = {
    create: async (data, tenantId) => {
        return await Inventory.create({ ...data, tenantId });
    },
    findAll: async (tenantId) => {
        return await Inventory.findAll({ where: { tenantId } });
    },
    findByIdAndUpdate: async (id, update, tenantId) => {
        const item = await Inventory.findOne({ where: { id, tenantId } });
        if (item) {
            return await item.update(update);
        }
        return null;
    },
    findById: async (id, tenantId) => {
        return await Inventory.findOne({ where: { id, tenantId } });
    }
};

export default inventoryRepository;
