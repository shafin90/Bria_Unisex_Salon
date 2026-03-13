import { Server as SocketIOServer, Socket }  from 'socket.io';
import Message  from '../modules/chat/chat.model';

let io: SocketIOServer;

export const setupSocket = (server: any) => {
    io = new SocketIOServer(server, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"]
        }
    });

    const users = new Map<string, string>();

    io.on('connection', (socket: Socket) => {
        console.log('New client connected:', socket.id);

        socket.on('join', (userId: string) => {
            users.set(userId, socket.id);
            console.log(`User ${userId} joined with socket ${socket.id}`);
        });

        socket.on('sendMessage', async (data: any) => {
            const { senderId, senderType, receiverId, receiverType, content } = data;

            try {
                const newMessage = new (Message as any)({
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

            } catch (error: any) {
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

export const getIo = () => io;
