import express  from 'express';
const router = express.Router();
import serviceController  from './service.controller';
import { isTenantAdmin } from '../../middleware/auth.middleware';
import { auditMiddleware } from '../audit/audit.middleware';

router.post('/addService', isTenantAdmin, auditMiddleware('CREATE_SERVICE', 'Service'), serviceController.addService);
router.get('/getAllService', serviceController.getAllService);
router.get('/getTopServices', serviceController.getTopServices);
router.delete('/deleteService/:id', isTenantAdmin, auditMiddleware('DELETE_SERVICE', 'Service'), serviceController.deleteService);
router.get('/getParticularServiceById/:id', serviceController.getParticularServiceById);
router.put('/editService/:id', isTenantAdmin, auditMiddleware('EDIT_SERVICE', 'Service'), serviceController.editService);

export default router;
