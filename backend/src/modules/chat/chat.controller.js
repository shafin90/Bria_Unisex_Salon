const chatService = require('./chat.service');

const chatController = {
    getHistory: async (req, res) => {
        const { user1, user2 } = req.params;
        try {
            const history = await chatService.getChatHistory(user1, user2);
            res.json(history);
        } catch (error) {
            res.status(500).json({ error: 'Failed to fetch chat history' });
        }
    }
};

module.exports = chatController;
