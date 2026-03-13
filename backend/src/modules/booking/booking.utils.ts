import { getIo }  from '../../utils/socketHandler';

const sendNotification = (userId, message) => {
    const io = getIo();
    if (io) {
        io.emit(`notification_${userId}`, {
            message,
            timestamp: new Date()
        });
        console.log(`Notification sent to ${userId}: ${message}`);
    } else {
        console.error('Socket.io not initialized');
    }
};

const confirmationMessage = async (name, phoneNumber) => {
    console.log(`[Notification] Booking confirmed for ${name} (${phoneNumber})`);
};

const reminderFunctionForToday = async (name, phoneNumber) => {
    console.log(`[Notification] Today's reminder for ${name} (${phoneNumber})`);
};

const reminderFunctionBeforeOneHour = async (name, phoneNumber) => {
    console.log(`[Notification] 1-hour reminder for ${name} (${phoneNumber})`);
};

export default { 
    confirmationMessage, 
    reminderFunctionForToday, 
    reminderFunctionBeforeOneHour, 
    sendNotification 
};
