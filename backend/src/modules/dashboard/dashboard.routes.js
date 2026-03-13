const express = require('express');
const router = express.Router();
const dashboardController = require('./dashboard.controller');

router.get('/dashboard', dashboardController.getDashboardData);
router.get('/graphData', dashboardController.getGraphData);

module.exports = router;
