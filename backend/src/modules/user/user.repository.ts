import User  from './user.model';

const userRepository = {
    findFrequentlyUsers: async (tenantId) => {
        return await User.findAll({ where: { tenantId }, order: [['howMuchRepeat', 'DESC']] });
    },
    findById: async (id, tenantId) => {
        return await User.findOne({ where: { id, tenantId } });
    },
    findByEmail: async (email, tenantId) => {
        return await User.findOne({ where: { email, tenantId } });
    }
};

export default userRepository;

