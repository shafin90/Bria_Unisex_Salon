import authRepository  from './auth.repository';
import { uid }  from 'uid';
import { sendOTPEmail }  from '../../utils/emailService'; // Need to move emailService later

let otpStore = {}; // Temporary in-memory store for OTPs, should be in Redis or DB for production

const authService = {
    login: async (email, password, tenantId) => {
        const admin = await authRepository.findByEmailAndPassword(email, password, tenantId);
        if (admin) {
            // In a real app, generate a JWT token containing admin.id and admin.tenantId here
            // e.g. return { token: '...', admin: admin }
            return { success: true, adminId: (admin as any).id, role: (admin as any).role, tenantId: (admin as any).tenantId };
        }
        return false;
    },
    generateAndSendOTP: async (email, tenantId) => {
        const admin = await authRepository.findByEmail(email, tenantId);
        if (!admin) return { success: false, error: "Email doesn't exist" };

        const otp = uid(6);
        // Scoping OTP by tenantId as well to avoid cross-tenant issues with same email
        otpStore[`${tenantId}_${email}`] = otp; 
        await sendOTPEmail(email, otp);
        return { success: true, message: "Please check your email. You will get an OTP" };
    },
    verifyOTP: async (email, resetOTP, tenantId) => {
        if (otpStore[`${tenantId}_${email}`] === resetOTP) {
            return { success: true };
        }
        return { success: false };
    },
    resetPassword: async (email, newPass, confirmNewPass, tenantId) => {
        if (newPass !== confirmNewPass) return { success: false, error: "Passwords do not match" };
        
        const passChanged = await authRepository.updatePassword(email, newPass, tenantId);
        if (passChanged) {
            delete otpStore[`${tenantId}_${email}`];
            console.log(`Password reset for ${email} on tenant ${tenantId}`);
            return { success: true, message: "Password updated" };
        }
        return { success: false, error: "Something went wrong" };
    }
};

export default authService;
