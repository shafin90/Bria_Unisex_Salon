const User = require('./user.model');

const userRepository = {
    findFrequentlyUsers: async () => {
        return await User.findAll({ order: [['howMuchRepeat', 'DESC']] });
    },
    findById: async (id) => {
        return await User.findByPk(id);
    },
    findByEmail: async (email) => {
        return await User.findOne({ where: { email } });
    }
};

module.exports = userRepository;

module.exports = userRepository;
