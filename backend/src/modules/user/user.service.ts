import userRepository  from './user.repository';

const userService = {
    getFrequentlyUsers: async (tenantId) => {
        return await userRepository.findFrequentlyUsers(tenantId);
    }
};

export default userService;
