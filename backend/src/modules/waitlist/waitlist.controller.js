const waitlistService = require('./waitlist.service');

const waitlistController = {
    join: async (req, res) => {
        try {
            const entry = await waitlistService.joinWaitlist(req.body);
            res.status(201).json(entry);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },
    getByDate: async (req, res) => {
        try {
            const list = await waitlistService.getWaitlistByDate(req.params.date);
            res.json(list);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
};

module.exports = waitlistController;
