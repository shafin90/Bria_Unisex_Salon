const waitlistRepository = require('./waitlist.repository');

const waitlistService = {
    joinWaitlist: async (data) => {
        return await waitlistRepository.create(data);
    },
    getWaitlistByDate: async (date) => {
        return await waitlistRepository.findByDate(date);
    }
};

module.exports = waitlistService;
