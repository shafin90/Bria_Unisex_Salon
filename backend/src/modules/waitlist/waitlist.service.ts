import waitlistRepository  from './waitlist.repository';

const waitlistService = {
    joinWaitlist: async (data, tenantId) => {
        return await waitlistRepository.create(data, tenantId);
    },
    getWaitlistByDate: async (date, tenantId) => {
        return await waitlistRepository.findByDate(date, tenantId);
    }
};

export default waitlistService;
