const express = require('express');
const router = express.Router();
const serviceController = require('./service.controller');

router.post('/addService', serviceController.addService);
router.get('/getAllService', serviceController.getAllService);
router.get('/getTopServices', serviceController.getTopServices);
router.delete('/deleteService/:id', serviceController.deleteService);
router.get('/getParticularServiceById/:id', serviceController.getParticularServiceById);
router.put('/editService/:id', serviceController.editService);

module.exports = router;
