import { useState, useEffect, useRef } from 'react';
import { Send, User, MessageSquare, Loader2 } from 'lucide-react';
import { io } from 'socket.io-client';
import { chatService } from './chatService';
import { useAuth } from '../../shared/context/AuthContext';

const Chat = () => {
    const { user } = useAuth();
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(true);
    const scrollRef = useRef(null);
    const socketRef = useRef(null);

    // For this demonstration, we'll assume a support chat room
    const roomId = 'support_general';
    const currentUser = user?._id || 'admin_id';

    useEffect(() => {
        // Connect to socket
        socketRef.current = io('http://localhost:5000'); // Adjust base URL if needed

        socketRef.current.emit('joinRoom', { userId: currentUser, role: 'admin' });

        socketRef.current.on('receiveMessage', (message) => {
            setMessages(prev => [...prev, message]);
        });

        // Load history
        const fetchHistory = async () => {
            try {
                // In a real app, you'd select a user to chat with
                const history = await chatService.getChatHistory(currentUser, 'client_id');
                setMessages(Array.isArray(history) ? history : []);
            } catch (error) {
                console.error("Failed to fetch chat history:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchHistory();

        return () => {
            if (socketRef.current) socketRef.current.disconnect();
        };
    }, [currentUser]);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSend = (e) => {
        e.preventDefault();
        if (!input.trim() || !socketRef.current) return;
        
        const messageData = {
            senderId: currentUser,
            receiverId: 'client_id', // Target user
            content: input,
            timestamp: new Date()
        };

        socketRef.current.emit('sendMessage', messageData);
        
        // Optimistic update
        setMessages(prev => [...prev, { ...messageData, _id: Date.now() }]);
        setInput('');
    };

    return (
        <div className="h-[calc(100vh-12rem)] flex flex-col bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-gray-50">
                <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 font-bold">
                        <User className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-gray-900">Customer Support</h3>
                        <p className="text-xs text-green-600 font-medium">Socket Connected</p>
                    </div>
                </div>
            </div>

            <div 
                ref={scrollRef}
                className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50"
            >
                {loading ? (
                    <div className="h-full flex items-center justify-center">
                        <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
                    </div>
                ) : messages.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-gray-400">
                        <MessageSquare className="w-12 h-12 mb-2" />
                        <p>No messages yet. Start a conversation!</p>
                    </div>
                ) : (
                    messages.map((msg) => (
                        <div 
                            key={msg._id} 
                            className={`flex ${msg.senderId === currentUser ? 'justify-end' : 'justify-start'}`}
                        >
                            <div className={`max-w-[70%] p-3 rounded-2xl shadow-sm ${
                                msg.senderId === currentUser 
                                    ? 'bg-primary-600 text-white rounded-tr-none' 
                                    : 'bg-white text-gray-800 border border-gray-200 rounded-tl-none'
                            }`}>
                                <p className="text-sm">{msg.content}</p>
                                <p className={`text-[10px] mt-1 ${msg.senderId === currentUser ? 'text-primary-100' : 'text-gray-400'}`}>
                                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </p>
                            </div>
                        </div>
                    ))
                )}
            </div>

            <form onSubmit={handleSend} className="p-4 border-t border-gray-200 bg-white flex items-center space-x-3">
                <input 
                    type="text" 
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type a message..." 
                    className="flex-1 bg-gray-100 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 border border-transparent focus:border-transparent"
                />
                <button 
                    type="submit"
                    disabled={!input.trim()}
                    className="p-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <Send className="w-5 h-5" />
                </button>
            </form>
        </div>
    );
};

export default Chat;
