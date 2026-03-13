const userRepository = require('./user.repository');

const userService = {
    getFrequentlyUsers: async () => {
        return await userRepository.findFrequentlyUsers();
    }
};

module.exports = userService;
