const socketIo = require('socket.io');
const Message = require('../model/messageSchema');

let io;

const setupSocket = (server) => {
    io = socketIo(server, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"]
        }
    });

    // Map to keep track of connected users and their socket IDs
    const users = new Map();

    io.on('connection', (socket) => {
        console.log('New client connected:', socket.id);

        // User/Admin joins with their ID
        socket.on('join', (userId) => {
            users.set(userId, socket.id);
            console.log(`User ${userId} joined with socket ${socket.id}`);
        });

        // Sending a message
        socket.on('sendMessage', async (data) => {
            const { senderId, senderType, receiverId, receiverType, content } = data;

            try {
                // Save message to database
                const newMessage = new Message({
                    sender: senderId,
                    senderType,
                    receiver: receiverId,
                    receiverType,
                    content
                });
                await newMessage.save();

                // Send to receiver if online
                const receiverSocketId = users.get(receiverId);
                if (receiverSocketId) {
                    io.to(receiverSocketId).emit('receiveMessage', {
                        senderId,
                        senderType,
                        content,
                        timestamp: newMessage.timestamp
                    });
                }
                
                // Confirm back to sender
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
            // Remove user from the map
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
