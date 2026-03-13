const authRepository = require('./auth.repository');
const { uid } = require("uid");
const { sendOTPEmail } = require("../../utils/emailService"); // Need to move emailService later

let otpStore = {}; // Temporary in-memory store for OTPs, should be in Redis or DB for production

const authService = {
    login: async (email, password) => {
        const admin = await authRepository.findByEmailAndPassword(email, password);
        return !!admin;
    },
    generateAndSendOTP: async (email) => {
        const admin = await authRepository.findByEmail(email);
        if (!admin) return { success: false, error: "Email doesn't exist" };

        const otp = uid(6);
        otpStore[email] = otp;
        await sendOTPEmail(email, otp);
        return { success: true, message: "Please check your email. You will get an OTP" };
    },
    verifyOTP: async (email, resetOTP) => {
        if (otpStore[email] === resetOTP) {
            return { success: true };
        }
        return { success: false };
    },
    resetPassword: async (email, newPass, confirmNewPass) => {
        if (newPass !== confirmNewPass) return { success: false, error: "Passwords do not match" };
        
        const passChanged = await authRepository.updatePassword(email, newPass);
        if (passChanged) {
            delete otpStore[email];
            console.log(`Password reset for ${email}`);
            return { success: true, message: "Password updated" };
        }
        return { success: false, error: "Something went wrong" };
    }
};

module.exports = authService;
