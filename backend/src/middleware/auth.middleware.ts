import Admin  from '../modules/auth/auth.model';
import jwt from 'jsonwebtoken';
import env from '../config/env';

const checkRole = (roles) => {
    return async (req, res, next) => {
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.split(' ')[1];
        
        if (!token) {
            return res.status(401).json({ error: "Unauthorized. Please provide a valid Bearer token." });
        }

        try {
            const decoded = jwt.verify(token, env.jwtSecret) as any;
            
            // Strict Tenant Validation
            // If the client provides a tenant-id header, it MUST match the token
            const headerTenantId = req.headers['tenant-id'];
            if (headerTenantId && headerTenantId !== decoded.tenantId) {
                return res.status(403).json({ error: "Forbidden. Tenant mismatch." });
            }

            const admin = await Admin.findByPk(decoded.adminId);
            if (!admin) {
                return res.status(401).json({ error: "Admin not found or account deactivated." });
            }

            if (!roles.includes((admin as any).role)) {
                return res.status(403).json({ error: "Forbidden. Insufficient permissions." });
            }

            (req as any).admin = admin; 
            (req as any).tenantId = decoded.tenantId; 

            // Populate global context for Sequelize hooks
            const store = require('../utils/context').context.getStore();
            if (store) {
                store.tenantId = decoded.tenantId;
                store.admin = admin;
            }

            next();
        } catch (error: any) {
            console.error("Auth Error:", error.message);
            res.status(401).json({ error: "Invalid or expired token." });
        }
    };
};

export const isSuperAdmin = checkRole(['Super Admin']);
export const isTenantAdmin = checkRole(['Super Admin', 'Tenant Admin', 'Owner']);
export const isOwner = checkRole(['Super Admin', 'Tenant Admin', 'Owner']);
export const isManager = checkRole(['Super Admin', 'Tenant Admin', 'Owner', 'Manager']);
export const isStylist = checkRole(['Super Admin', 'Tenant Admin', 'Owner', 'Stylist']);
