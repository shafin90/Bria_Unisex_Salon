const socketIo = require('socket.io');
const Message = require('../modules/chat/chat.model');

let io;

const setupSocket = (server) => {
    io = socketIo(server, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"]
        }
    });

    const users = new Map();

    io.on('connection', (socket) => {
        console.log('New client connected:', socket.id);

        socket.on('join', (userId) => {
            users.set(userId, socket.id);
            console.log(`User ${userId} joined with socket ${socket.id}`);
        });

        socket.on('sendMessage', async (data) => {
            const { senderId, senderType, receiverId, receiverType, content } = data;

            try {
                const newMessage = new Message({
                    sender: senderId,
                    senderType,
                    receiver: receiverId,
                    receiverType,
                    message: content // Changed content to message to match our new schema
                });
                await newMessage.save();

                const receiverSocketId = users.get(receiverId);
                if (receiverSocketId) {
                    io.to(receiverSocketId).emit('receiveMessage', {
                        senderId,
                        senderType,
                        content,
                        timestamp: newMessage.timestamp
                    });
                }
                
                socket.emit('messageSent', {
                    success: true,
                    message: newMessage
                });

            } catch (error) {
                console.error('Error saving message:', error);
                socket.emit('messageError', { error: 'Failed to send message' });
            }
        });

        socket.on('disconnect', () => {
            console.log('Client disconnected:', socket.id);
            for (let [userId, socketId] of users.entries()) {
                if (socketId === socket.id) {
                    users.delete(userId);
                    break;
                }
            }
        });
    });

    return io;
};

const getIo = () => io;

module.exports = { setupSocket, getIo };
