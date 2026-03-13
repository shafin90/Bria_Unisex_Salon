const authService = require('./auth.service');

const authController = {
    login: async (req, res) => {
        try {
            const { email, password } = req.body;
            const success = await authService.login(email, password);
            res.json({ success });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    },
    submitForgetPassMail: async (req, res) => {
        try {
            const { forgetPasswordEmail } = req.body;
            req.session = req.session || {}; // Placeholder if session is used
            req.session.resetEmail = forgetPasswordEmail; // Mocking session for now to keep track of email
            
            const result = await authService.generateAndSendOTP(forgetPasswordEmail);
            res.json(result);
        } catch (error) {
            res.status(500).json({ success: false, error: "Something went wrong" });
        }
    },
    submitForgetPassOTP: async (req, res) => {
        try {
            const { resetOTP, forgetPasswordEmail } = req.body;
            const email = forgetPasswordEmail || (req.session && req.session.resetEmail);
            
            const result = await authService.verifyOTP(email, resetOTP);
            res.json(result);
        } catch (error) {
            res.status(500).json({ success: false, error: "Something went wrong" });
        }
    },
    resetPass: async (req, res) => {
        try {
            const { newPass, confirmNewPass, forgetPasswordEmail } = req.body;
            const email = forgetPasswordEmail || (req.session && req.session.resetEmail);

            const result = await authService.resetPassword(email, newPass, confirmNewPass);
            res.json(result);
        } catch (error) {
            res.status(500).json({ success: false, error: "Something went wrong" });
        }
    }
};

module.exports = authController;
