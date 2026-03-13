const offerService = require('./offer.service');
const upload = require('./offer.upload');

const offerController = {
    addOffer: async (req, res) => {
        upload(req, res, async (err) => {
            if (err) return res.status(400).json({ errorMessage: err.message });
            try {
                const { offerName, startDate, endDate, usageLimit } = req.body;
                const offerImgUrl = req.file ? req.file.path : '';

                await offerService.addOffer({
                    offerName,
                    offerImg: offerImgUrl,
                    startDate,
                    endDate,
                    usageLimit
                });
                res.json({ message: "Offer added", success: true });
            } catch (error) {
                res.status(500).json({ errorMessage: "Something went wrong", error: error.message });
            }
        });
    },
    getAllOffer: async (req, res) => {
        try {
            const result = await offerService.getAll();
            res.json(result);
        } catch (error) {
            res.status(500).json({ errorMessage: "Something went wrong", error: error.message });
        }
    },
    getAllActiveOffer: async (req, res) => {
        try {
            const result = await offerService.getByStatus("Active");
            res.json(result);
        } catch (error) {
            res.status(500).json({ errorMessage: "Something went wrong", error: error.message });
        }
    },
    getAllInactiveOffer: async (req, res) => {
        try {
            const result = await offerService.getByStatus("Inactive");
            res.json(result);
        } catch (error) {
            res.status(500).json({ errorMessage: "Something went wrong", error: error.message });
        }
    },
    getParticularOfferById: async (req, res) => {
        try {
            const { id } = req.params;
            const offer = await offerService.getById(id);
            if (!offer) return res.status(404).json({ message: "Offer is missing" });
            res.json(offer);
        } catch (error) {
            res.status(500).json({ errorMessage: "Something went wrong", error: error.message });
        }
    },
    editOffer: async (req, res) => {
        upload(req, res, async (err) => {
            if (err) return res.status(400).json({ errorMessage: err.message });
            try {
                const { id } = req.params;
                const { offerName, startDate, endDate, usageLimit, status } = req.body;
                const offerImgUrl = req.file ? req.file.path : '';

                const updatedFields = { offerName, startDate, endDate, usageLimit, status };
                if (offerImgUrl) updatedFields.offerImg = offerImgUrl;

                const result = await offerService.updateOffer(id, updatedFields);
                if (!result) return res.status(404).json({ message: "Something went wrong. Please try again" });
                res.json({ message: "Edited", success: true });
            } catch (error) {
                res.status(500).json({ errorMessage: "Something went wrong", error: error.message });
            }
        });
    }
};

module.exports = offerController;
