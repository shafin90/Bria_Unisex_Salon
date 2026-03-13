const Booking = require('./booking.model');

const bookingRepository = {
    create: async (bookingData) => {
        return await Booking.create(bookingData);
    },
    findAll: async (skip, limit) => {
        return await Booking.findAll({ offset: skip, limit: limit });
    },
    count: async () => {
        return await Booking.count();
    },
    findRecent: async () => {
        return await Booking.findAll({ order: [['date', 'DESC'], ['time', 'DESC']] });
    },
    findById: async (id) => {
        return await Booking.findByPk(id);
    },
    findByPhoneNumber: async (phoneNumber) => {
        return await Booking.findAll({ 
            where: { phoneNumber },
            order: [['date', 'DESC'], ['time', 'DESC']] 
        });
    }
};

module.exports = bookingRepository;

module.exports = bookingRepository;
