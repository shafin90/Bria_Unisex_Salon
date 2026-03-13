import Admin  from './auth.model';

const authRepository = {
    findByEmail: async (email, tenantId) => {
        return await Admin.findOne({ where: { email, tenantId } });
    },
    findByEmailAndPassword: async (email, password, tenantId) => {
        return await Admin.findOne({ where: { email, password, tenantId } });
    },
    updatePassword: async (email, newPassword, tenantId) => {
        const admin = await Admin.findOne({ where: { email, tenantId } });
        if (admin) {
            return await admin.update({ password: newPassword });
        }
        return null;
    }
};

export default authRepository;

