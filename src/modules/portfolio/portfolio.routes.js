const express = require('express');
const router = express.Router();
const portfolioController = require('./portfolio.controller');

router.post('/add', portfolioController.add);
router.get('/gallery', portfolioController.getGallery);

module.exports = router;
