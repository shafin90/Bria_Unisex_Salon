import Admin  from '../modules/auth/auth.model';

// Dummy auth middleware for demonstration
// In a real app, you would verify a JWT token and set req.admin
const checkRole = (roles) => {
    return async (req, res, next) => {
        const adminId = req.headers['admin-id']; // Simplified for now
        
        if (!adminId) {
            return res.status(401).json({ error: "Unauthorized. Please provide admin-id header." });
        }

        try {
            const admin = await Admin.findByPk(adminId);
            if (!admin) {
                return res.status(401).json({ error: "Admin not found." });
            }

            if (!roles.includes((admin as any).role)) {
                return res.status(403).json({ error: "Forbidden. Insufficient permissions." });
            }

            (req as any).admin = admin; // Attach admin object for downstream use
            (req as any).tenantId = (admin as any).tenantId; // Attach tenantId for query scoping
            next();
        } catch (error: any) {
            res.status(500).json({ error: "Auth verification failed." });
        }
    };
};

export const isSuperAdmin = checkRole(['Super Admin']);
export const isTenantAdmin = checkRole(['Super Admin', 'Tenant Admin', 'Owner']);
export const isOwner = checkRole(['Super Admin', 'Tenant Admin', 'Owner']);
export const isManager = checkRole(['Super Admin', 'Tenant Admin', 'Owner', 'Manager']);
export const isStylist = checkRole(['Super Admin', 'Tenant Admin', 'Owner', 'Stylist']);
