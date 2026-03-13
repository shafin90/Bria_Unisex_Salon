import { Request, Response, NextFunction } from 'express';
import AuditLog from './audit.model';
import { getAdmin, getTenantId } from '../../utils/context';

export const auditMiddleware = (action: string, model: string) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        // We wrap the original end method to log after the request is finished successfully
        const originalEnd = res.end;

        (res as any).end = async function (chunk: any, encoding: any) {
            res.end = originalEnd;
            const result = res.end(chunk, encoding);

            // Only log successful modifications (2xx)
            if (res.statusCode >= 200 && res.statusCode < 300 && ['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method)) {
                try {
                    const admin = getAdmin();
                    const tenantId = getTenantId();

                    await AuditLog.create({
                        action,
                        model,
                        targetId: req.params.id || null,
                        perfomedBy: admin?.id || null,
                        tenantId: tenantId || null,
                        details: {
                            method: req.method,
                            url: req.originalUrl,
                            body: req.method !== 'DELETE' ? req.body : null
                        }
                    });
                } catch (error) {
                    console.error("Failed to save audit log:", error);
                }
            }
            return result;
        };

        next();
    };
};
