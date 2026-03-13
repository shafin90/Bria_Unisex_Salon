import paymentService  from './payment.service';

const paymentController = {
    record: async (req, res) => {
        const tenantId = req.tenantId || req.body.tenantId;
        if (!tenantId) return res.status(400).json({ error: "tenantId is required" });

        const { amount, currency, bookingId, userId } = req.body;
        try {
            const paymentIntent = await paymentService.createPaymentIntent(amount, currency, bookingId, userId, tenantId);
            res.send({ clientSecret: paymentIntent.client_secret });
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    },
    recordStripeSuccess: async (req: any, res: any) => {
        try {
            const tenantId = req.tenantId || req.body.tenantId;
            if (!tenantId) return res.status(400).json({ error: "tenantId is required" });

            const payment = await paymentService.recordStripeSuccess(req.body, tenantId);
            res.status(201).json({ success: true, payment });
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    },
    createConnectAccount: async (req: any, res: any) => {
        try {
            const tenantId = req.tenantId || req.body.tenantId;
            if (!tenantId) return res.status(400).json({ error: "tenantId is required" });

            const { refreshUrl, returnUrl } = req.body;
            if (!refreshUrl || !returnUrl) return res.status(400).json({ error: "refreshUrl and returnUrl are required" });

            const result = await paymentService.createConnectAccount(tenantId, refreshUrl, returnUrl);
            res.json(result);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    },
    verifyConnectStatus: async (req: any, res: any) => {
        try {
            const tenantId = req.tenantId || req.body.tenantId;
            if (!tenantId) return res.status(400).json({ error: "tenantId is required" });

            const result = await paymentService.verifyConnectStatus(tenantId);
            res.json(result);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }
};

export default paymentController;
