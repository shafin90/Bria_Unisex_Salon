const Payment = require('./payment.model');
const Booking = require('../booking/booking.model');
const User = require('../user/user.model');
const Stylist = require('../stylist/stylist.model');

const paymentRepository = {
    create: async (data) => {
        return await Payment.create(data);
    },
    findAll: async () => {
        return await Payment.findAll({
            include: [Booking, User, Stylist]
        });
    }
};

module.exports = paymentRepository;
