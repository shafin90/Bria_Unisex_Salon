import waitlistService  from './waitlist.service';

const waitlistController = {
    join: async (req, res) => {
        try {
            const tenantId = req.tenantId || req.body.tenantId;
            if (!tenantId) return res.status(400).json({ error: "tenantId is required" });

            const entry = await waitlistService.joinWaitlist(req.body, tenantId);
            res.status(201).json(entry);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    },
    getByDate: async (req, res) => {
        try {
            const tenantId = req.tenantId || req.query.tenantId;
            if (!tenantId) return res.status(400).json({ error: "tenantId is required" });

            const list = await waitlistService.getWaitlistByDate(req.params.date, tenantId);
            res.json(list);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }
};

export default waitlistController;
