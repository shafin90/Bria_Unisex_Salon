const chatRepository = require('./chat.repository');

const chatService = {
    getChatHistory: async (user1, user2) => {
        return await chatRepository.findHistory(user1, user2);
    },
    saveMessage: async (data) => {
        return await chatRepository.create(data);
    }
};

module.exports = chatService;
