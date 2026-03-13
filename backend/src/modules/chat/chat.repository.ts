import Message  from './chat.model';
import { Op }  from 'sequelize';

const chatRepository = {
    findHistory: async (user1, user2) => {
        return await Message.findAll({
            where: {
                [Op.or]: [
                    { sender: user1, receiver: user2 },
                    { sender: user2, receiver: user1 }
                ]
            },
            order: [['timestamp', 'ASC']]
        });
    },
    create: async (data) => {
        return await Message.create(data);
    }
};

export default chatRepository;
