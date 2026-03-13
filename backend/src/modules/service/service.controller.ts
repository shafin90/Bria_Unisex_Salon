import serviceService  from './service.service';
import upload  from './service.upload';

const serviceController = {
    addService: async (req, res) => {
        upload(req, res, async (err) => {
            if (err) return res.status(400).json({ errorMessage: err.message });
            try {
                const tenantId = req.tenantId || req.body.tenantId;
                if (!tenantId) return res.status(400).json({ error: "tenantId is required" });

                const { serviceName, serviceDescription, price, category, serviceType } = req.body;
                const imgUrl = req.file ? req.file.path : '';

                const result = await serviceService.addService({
                    serviceName,
                    serviceDescription,
                    img: imgUrl,
                    price,
                    category,
                    serviceType
                }, tenantId);

                res.json({ message: "Service added", success: true, service: result });
            } catch (error: any) {
                res.status(500).json({ errorMessage: "Something went wrong", error: error.message });
            }
        });
    },
    getAllService: async (req, res) => {
        try {
            const tenantId = req.tenantId || req.query.tenantId;
            if (!tenantId) return res.status(400).json({ error: "tenantId is required" });

            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const result = await serviceService.getServices(page, limit, tenantId);
            res.json(result);
        } catch (error: any) {
            res.status(500).json({ errorMessage: "Something went wrong", error: error.message });
        }
    },
    getTopServices: async (req, res) => {
        try {
            const tenantId = req.tenantId || req.query.tenantId;
            if (!tenantId) return res.status(400).json({ error: "tenantId is required" });

            const topServices = await serviceService.getTopServices(tenantId);
            res.json(topServices);
        } catch (error: any) {
            res.status(500).json({ errorMessage: "Something went wrong", error: error.message });
        }
    },
    deleteService: async (req, res) => {
        try {
            const tenantId = req.tenantId || req.query.tenantId;
            if (!tenantId) return res.status(400).json({ error: "tenantId is required" });

            const { id } = req.params;
            const result = await serviceService.deleteService(id, tenantId);
            if (!result) return res.status(404).json({ errorMessage: "Service not found" });
            res.json({ message: "Deleted" });
        } catch (error: any) {
            res.status(500).json({ errorMessage: "Something went wrong", error: error.message });
        }
    },
    getParticularServiceById: async (req, res) => {
        try {
            const tenantId = req.tenantId || req.query.tenantId;
            if (!tenantId) return res.status(400).json({ error: "tenantId is required" });

            const { id } = req.params;
            const service = await serviceService.getServiceById(id, tenantId);
            if (!service) return res.status(404).json({ message: "Service is missing" });
            res.json(service);
        } catch (error: any) {
            res.status(500).json({ errorMessage: "Something went wrong", error: error.message });
        }
    },
    editService: async (req, res) => {
        upload(req, res, async (err) => {
            if (err) return res.status(400).json({ errorMessage: err.message });
            try {
                const tenantId = req.tenantId || req.body.tenantId;
                if (!tenantId) return res.status(400).json({ error: "tenantId is required" });

                const { id } = req.params;
                const { serviceName, serviceDescription, price, category, serviceType } = req.body;
                const imgUrl = req.file ? req.file.path : '';
                
                const updatedFields: any = { serviceName, serviceDescription, price, category, serviceType };
                if (imgUrl) updatedFields.img = imgUrl;

                const result = await serviceService.updateService(id, updatedFields, tenantId);
                if (!result) return res.status(404).json({ message: "Service not found" });
                
                res.json({ message: "Edited", success: true, service: result });
            } catch (error: any) {
                res.status(500).json({ errorMessage: "Something went wrong", error: error.message });
            }
        });
    }
};

export default serviceController;
