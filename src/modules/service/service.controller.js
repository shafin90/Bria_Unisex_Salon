const serviceService = require('./service.service');
const upload = require('./service.upload');

const serviceController = {
    addService: async (req, res) => {
        upload(req, res, async (err) => {
            if (err) return res.status(400).json({ errorMessage: err.message });
            try {
                const { serviceName, serviceDescription, price, category, serviceType } = req.body;
                const imgUrl = req.file ? req.file.path : '';

                const result = await serviceService.addService({
                    serviceName,
                    serviceDescription,
                    img: imgUrl,
                    price,
                    category,
                    serviceType
                });

                res.json({ message: "Service added", success: true, service: result });
            } catch (error) {
                res.status(500).json({ errorMessage: "Something went wrong", error: error.message });
            }
        });
    },
    getAllService: async (req, res) => {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const result = await serviceService.getServices(page, limit);
            res.json(result);
        } catch (error) {
            res.status(500).json({ errorMessage: "Something went wrong", error: error.message });
        }
    },
    getTopServices: async (req, res) => {
        try {
            const topServices = await serviceService.getTopServices();
            res.json(topServices);
        } catch (error) {
            res.status(500).json({ errorMessage: "Something went wrong", error: error.message });
        }
    },
    deleteService: async (req, res) => {
        try {
            const { id } = req.params;
            const result = await serviceService.deleteService(id);
            if (!result.deletedCount) return res.status(404).json({ errorMessage: "Service not found" });
            res.json({ message: "Deleted" });
        } catch (error) {
            res.status(500).json({ errorMessage: "Something went wrong", error: error.message });
        }
    },
    getParticularServiceById: async (req, res) => {
        try {
            const { id } = req.params;
            const service = await serviceService.getServiceById(id);
            if (!service) return res.status(404).json({ message: "Service is missing" });
            res.json(service);
        } catch (error) {
            res.status(500).json({ errorMessage: "Something went wrong", error: error.message });
        }
    },
    editService: async (req, res) => {
        upload(req, res, async (err) => {
            if (err) return res.status(400).json({ errorMessage: err.message });
            try {
                const { id } = req.params;
                const { serviceName, serviceDescription, price, category, serviceType } = req.body;
                const imgUrl = req.file ? req.file.path : '';
                
                const updatedFields = { serviceName, serviceDescription, price, category, serviceType };
                if (imgUrl) updatedFields.img = imgUrl;

                const result = await serviceService.updateService(id, updatedFields);
                if (!result) return res.status(404).json({ message: "Service not found" });
                
                res.json({ message: "Edited", success: true, service: result });
            } catch (error) {
                res.status(500).json({ errorMessage: "Something went wrong", error: error.message });
            }
        });
    }
};

module.exports = serviceController;
