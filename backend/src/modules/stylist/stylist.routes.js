const express = require('express');
const router = express.Router();
const stylistController = require('./stylist.controller');

router.post('/add', stylistController.add);
router.get('/all', stylistController.getAll);
router.put('/update/:id', stylistController.update);

module.exports = router;
