import authService  from './auth.service';

const authController = {
    login: async (req, res) => {
        try {
            const { email, password, tenantId } = req.body;
            if (!tenantId) return res.status(400).json({ success: false, message: "tenantId is required" });
            
            const result = await authService.login(email, password, tenantId);
            if (result) {
                res.json(result);
            } else {
                res.status(401).json({ success: false, message: "Invalid credentials" });
            }
        } catch (error: any) {
            res.status(500).json({ success: false, message: error.message });
        }
    },
    submitForgetPassMail: async (req, res) => {
        try {
            const { forgetPasswordEmail, tenantId } = req.body;
            if (!tenantId) return res.status(400).json({ success: false, message: "tenantId is required" });
            
            req.session = req.session || {}; // Placeholder if session is used
            req.session.resetEmail = forgetPasswordEmail; // Mocking session for now
            req.session.resetTenant = tenantId;
            
            const result = await authService.generateAndSendOTP(forgetPasswordEmail, tenantId);
            res.json(result);
        } catch (error: any) {
            res.status(500).json({ success: false, error: "Something went wrong" });
        }
    },
    submitForgetPassOTP: async (req, res) => {
        try {
            const { resetOTP, forgetPasswordEmail, tenantId } = req.body;
            const email = forgetPasswordEmail || (req.session && req.session.resetEmail);
            const currentTenantId = tenantId || (req.session && req.session.resetTenant);
            
            if (!currentTenantId) return res.status(400).json({ success: false, message: "tenantId is required" });

            const result = await authService.verifyOTP(email, resetOTP, currentTenantId);
            res.json(result);
        } catch (error: any) {
            res.status(500).json({ success: false, error: "Something went wrong" });
        }
    },
    resetPass: async (req, res) => {
        try {
            const { newPass, confirmNewPass, forgetPasswordEmail, tenantId } = req.body;
            const email = forgetPasswordEmail || (req.session && req.session.resetEmail);
            const currentTenantId = tenantId || (req.session && req.session.resetTenant);

            if (!currentTenantId) return res.status(400).json({ success: false, message: "tenantId is required" });

            const result = await authService.resetPassword(email, newPass, confirmNewPass, currentTenantId);
            res.json(result);
        } catch (error: any) {
            res.status(500).json({ success: false, error: "Something went wrong" });
        }
    }
};

export default authController;
