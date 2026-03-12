const Admin = require('../model/adminSchema');

// Dummy auth middleware for demonstration
// In a real app, you would verify a JWT token and set req.admin
const checkRole = (roles) => {
    return async (req, res, next) => {
        const adminId = req.headers['admin-id']; // Simplified for now
        
        if (!adminId) {
            return res.status(401).json({ error: "Unauthorized. Please provide admin-id header." });
        }

        try {
            const admin = await Admin.findById(adminId);
            if (!admin) {
                return res.status(401).json({ error: "Admin not found." });
            }

            if (!roles.includes(admin.role)) {
                return res.status(403).json({ error: "Forbidden. Insufficient permissions." });
            }

            req.admin = admin; // Attach admin object for downstream use
            next();
        } catch (error) {
            res.status(500).json({ error: "Auth verification failed." });
        }
    };
};

module.exports = {
    isOwner: checkRole(['Owner']),
    isManager: checkRole(['Owner', 'Manager']),
    isStylist: checkRole(['Owner', 'Stylist']),
};
