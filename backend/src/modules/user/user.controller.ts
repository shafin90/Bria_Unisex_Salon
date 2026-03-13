import userService  from './user.service';

const userController = {
    getFrequentlyUser: async (req, res) => {
        try {
            const tenantId = req.tenantId || req.query.tenantId;
            if (!tenantId) return res.status(400).json({ error: "tenantId is required" });

            const allUsers = await userService.getFrequentlyUsers(tenantId);
            res.json(allUsers);
        } catch (error: any) {
            res.status(500).json({ errorMessage: "something went wrong", error: error.message });
        }
    }
};

export default userController;
