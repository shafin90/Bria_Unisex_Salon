const { getIo } = require('./socketHandler');

// Function to send in-app/socket notification to a user
const sendNotification = (userId, message) => {
    const io = getIo();
    if (io) {
        // We'll broadcast to the user specifically (assuming we have a mapping system in socketHandler)
        // For now, let's emit a 'notification' event
        // In a real scenario, we might want to store notifications in a DB too
        io.emit(`notification_${userId}`, {
            message,
            timestamp: new Date()
        });
        console.log(`Notification sent to ${userId}: ${message}`);
    } else {
        console.error('Socket.io not initialized');
    }
};

// Placeholder for future email or SMS integration if needed
const confirmationMessage = async (name, phoneNumber) => {
    console.log(`[Notification] Booking confirmed for ${name} (${phoneNumber})`);
    // Logic to send in-app notification can be added here
};

const reminderFunctionForToday = async (name, phoneNumber) => {
    console.log(`[Notification] Today's reminder for ${name} (${phoneNumber})`);
};

const reminderFunctionBeforeOneHour = async (name, phoneNumber) => {
    console.log(`[Notification] 1-hour reminder for ${name} (${phoneNumber})`);
};

module.exports = { confirmationMessage, reminderFunctionForToday, reminderFunctionBeforeOneHour, sendNotification };
