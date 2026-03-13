import http  from 'http';
import app  from './app';
import { connectDB }  from './config/db';
import config  from './config/env';
import { setupSocket }  from './utils/socketHandler';

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
    } catch (error: any) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};

startServer();
