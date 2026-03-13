import { Request, Response } from 'express';
import Tenant from '../tenant/tenant.model';
import AuditLog from '../audit/audit.model';

export const getAllTenants = async (req: Request, res: Response) => {
    try {
        const tenants = await Tenant.findAll();
        res.json(tenants);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export const getPlatformAuditLogs = async (req: Request, res: Response) => {
    try {
        const logs = await AuditLog.findAll({
            limit: 100,
            order: [['createdAt', 'DESC']]
        });
        res.json(logs);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export const updateTenantStatus = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { active } = req.body;
    try {
        await Tenant.update({ active }, { where: { id } });
        res.json({ success: true, message: "Tenant status updated" });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};
