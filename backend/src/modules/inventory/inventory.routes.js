const express = require('express');
const router = express.Router();
const inventoryController = require('./inventory.controller');
const { isManager } = require('../../middleware/auth.middleware');

router.post('/add', isManager, inventoryController.addItem);
router.get('/all', inventoryController.getAll);
router.patch('/update-stock/:id', inventoryController.updateStock);

module.exports = router;
