import express  from 'express';
const router = express.Router();
import dashboardController  from './dashboard.controller';

router.get('/dashboard', dashboardController.getDashboardData);
router.get('/graphData', dashboardController.getGraphData);

export default router;
