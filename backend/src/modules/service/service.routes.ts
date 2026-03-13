import express  from 'express';
const router = express.Router();
import serviceController  from './service.controller';

router.post('/addService', serviceController.addService);
router.get('/getAllService', serviceController.getAllService);
router.get('/getTopServices', serviceController.getTopServices);
router.delete('/deleteService/:id', serviceController.deleteService);
router.get('/getParticularServiceById/:id', serviceController.getParticularServiceById);
router.put('/editService/:id', serviceController.editService);

export default router;
