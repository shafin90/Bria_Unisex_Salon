import Booking  from './booking.model';

const bookingRepository = {
    create: async (bookingData, tenantId) => {
        return await Booking.create({ ...bookingData, tenantId });
    },
    findAll: async (skip, limit, tenantId) => {
        return await Booking.findAll({ where: { tenantId }, offset: skip, limit: limit });
    },
    count: async (tenantId) => {
        return await Booking.count({ where: { tenantId } });
    },
    findRecent: async (tenantId) => {
        return await Booking.findAll({ where: { tenantId }, order: [['date', 'DESC'], ['time', 'DESC']] });
    },
    findById: async (id, tenantId) => {
        return await Booking.findOne({ where: { id, tenantId } });
    },
    findByPhoneNumber: async (phoneNumber, tenantId) => {
        return await Booking.findAll({ 
            where: { phoneNumber, tenantId },
            order: [['date', 'DESC'], ['time', 'DESC']] 
        });
    }
};

export default bookingRepository;

