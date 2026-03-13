const Waitlist = require('./waitlist.model');
const User = require('../user/user.model');

const waitlistRepository = {
    create: async (data) => {
        return await Waitlist.create(data);
    },
    findByDate: async (date) => {
        return await Waitlist.findAll({ 
            where: { preferredDate: date },
            include: [User]
        });
    }
};

module.exports = waitlistRepository;
