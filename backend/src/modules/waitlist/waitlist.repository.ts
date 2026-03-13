import Waitlist  from './waitlist.model';
import User  from '../user/user.model';

const waitlistRepository = {
    create: async (data, tenantId) => {
        return await Waitlist.create({ ...data, tenantId });
    },
    findByDate: async (date, tenantId) => {
        return await Waitlist.findAll({ 
            where: { preferredDate: date, tenantId },
            include: [User]
        });
    }
};

export default waitlistRepository;
