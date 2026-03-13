const http = require('http');
const app = require('./app');
const { connectDB } = require('./config/db');
const config = require('./config/env');
const { setupSocket } = require('./utils/socketHandler');

const startServer = async () => {
    try {
        // Connect to Database
        await connectDB();

        const server = http.createServer(app);
        
        // Setup WebSockets
        setupSocket(server);

        server.listen(config.port, () => {
            console.log(`Server listening on port ${config.port}`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};

startServer();
