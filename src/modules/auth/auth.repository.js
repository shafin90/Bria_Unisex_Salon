const Admin = require('./auth.model');

const authRepository = {
    findByEmail: async (email) => {
        return await Admin.findOne({ where: { email } });
    },
    findByEmailAndPassword: async (email, password) => {
        return await Admin.findOne({ where: { email, password } });
    },
    updatePassword: async (email, newPassword) => {
        const admin = await Admin.findOne({ where: { email } });
        if (admin) {
            return await admin.update({ password: newPassword });
        }
        return null;
    }
};

module.exports = authRepository;

module.exports = authRepository;
