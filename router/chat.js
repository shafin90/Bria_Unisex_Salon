const express = require('express');
const router = express.Router();
const Message = require('../model/messageSchema');

// Get chat history between two users
router.get('/history/:user1/:user2', async (req, res) => {
    const { user1, user2 } = req.params;

    try {
        const history = await Message.find({
            $or: [
                { sender: user1, receiver: user2 },
                { sender: user2, receiver: user1 }
            ]
        }).sort({ timestamp: 1 });

        res.json(history);
    } catch (error) {
        console.error('Error fetching chat history:', error);
        res.status(500).json({ error: 'Failed to fetch chat history' });
    }
});

module.exports = router;
