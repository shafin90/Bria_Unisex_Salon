import dashboardService  from './dashboard.service';

const dashboardController = {
    getDashboardData: async (req, res) => {
        try {
            const data = await dashboardService.getDashboardStats();
            res.json(data);
        } catch (error: any) {
            res.status(500).json({ errorMessage: "something went wrong", error: error.message });
        }
    },
    getGraphData: async (req, res) => {
        try {
            const data = await dashboardService.getGraphData();
            res.json(data);
        } catch (error: any) {
            res.status(500).json({ success: false, message: "something went wrong", error: error.message });
        }
    }
};

export default dashboardController;
