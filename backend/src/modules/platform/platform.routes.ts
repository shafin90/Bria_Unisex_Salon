import { Router } from 'express';
import { getAllTenants, getPlatformAuditLogs, updateTenantStatus } from './platform.controller';
import { isSuperAdmin } from '../../middleware/auth.middleware';

const router = Router();

router.get('/tenants', isSuperAdmin, getAllTenants);
router.get('/audit-logs', isSuperAdmin, getPlatformAuditLogs);
router.patch('/tenant/:id/status', isSuperAdmin, updateTenantStatus);

export default router;
