import authRepository  from './auth.repository';
import { uid }  from 'uid';
import { sendOTPEmail }  from '../../utils/emailService'; 
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import env from '../../config/env';

let otpStore = {}; 

const authService = {
    login: async (email, password, tenantId) => {
        const admin = await authRepository.findByEmail(email, tenantId);
        if (admin && await bcrypt.compare(password, (admin as any).password)) {
            const token = jwt.sign(
                { 
                    adminId: (admin as any).id, 
                    role: (admin as any).role, 
                    tenantId: (admin as any).tenantId 
                },
                env.jwtSecret,
                { expiresIn: '1d' }
            );
            return { 
                success: true, 
                token,
                admin: {
                    id: (admin as any).id,
                    role: (admin as any).role,
                    tenantId: (admin as any).tenantId
                }
            };
        }
        return false;
    },
    generateAndSendOTP: async (email, tenantId) => {
        const admin = await authRepository.findByEmail(email, tenantId);
        if (!admin) return { success: false, error: "Email doesn't exist" };

        const otp = uid(6);
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
        
        const hashedPassword = await bcrypt.hash(newPass, 10);
        const passChanged = await authRepository.updatePassword(email, hashedPassword, tenantId);
        if (passChanged) {
            delete otpStore[`${tenantId}_${email}`];
            return { success: true, message: "Password updated" };
        }
        return { success: false, error: "Something went wrong" };
    }
};

export default authService;
