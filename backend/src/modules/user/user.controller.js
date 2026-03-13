const userService = require('./user.service');

const userController = {
    getFrequentlyUser: async (req, res) => {
        try {
            const allUsers = await userService.getFrequentlyUsers();
            res.json(allUsers);
        } catch (error) {
            res.status(500).json({ errorMessage: "something went wrong", error: error.message });
        }
    }
};

module.exports = userController;
