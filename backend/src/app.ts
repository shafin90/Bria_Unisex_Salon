import express  from 'express';
import cors  from 'cors';
import path  from 'path';
const app = express();

// CORS options
const corsOptions = {
    origin: function (origin, callback) {
        callback(null, true);
    },
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
};

app.use(cors(corsOptions));

import { handleStripeWebhook } from './modules/payment/webhook.controller';
// Stripe webhook requires the raw body, so we define it before express.json()
app.post('/api/webhooks/stripe', express.raw({ type: 'application/json' }), handleStripeWebhook);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Import Models for associations if needed (already handled in db.js)
import { connectDB }  from './config/db';
import authRoutes  from './modules/auth/auth.routes';
import userRoutes  from './modules/user/user.routes';
import bookingRoutes  from './modules/booking/booking.routes';
import serviceRoutes  from './modules/service/service.routes';
import inventoryRoutes  from './modules/inventory/inventory.routes';
import portfolioRoutes  from './modules/portfolio/portfolio.routes';
import packageRoutes  from './modules/package/package.routes';
import waitlistRoutes  from './modules/waitlist/waitlist.routes';
import reviewRoutes  from './modules/review/review.routes';
import chatRoutes  from './modules/chat/chat.routes';
import offerRoutes  from './modules/offer/offer.routes';
import dashboardRoutes  from './modules/dashboard/dashboard.routes';
import stylistRoutes  from './modules/stylist/stylist.routes';
import paymentRoutes  from './modules/payment/payment.routes';

// Use Routes
app.use('/admin', authRoutes);
app.use('/user', userRoutes);
app.use('/booking', bookingRoutes);
app.use('/service', serviceRoutes);
app.use('/inventory', inventoryRoutes);
app.use('/portfolio', portfolioRoutes);
app.use('/package', packageRoutes);
app.use('/waitlist', waitlistRoutes);
app.use('/review', reviewRoutes);
app.use('/chat', chatRoutes);
app.use('/offer', offerRoutes);
app.use('/dashboard', dashboardRoutes);
app.use('/stylist', stylistRoutes);
app.use('/payment', paymentRoutes);

// Base route
app.get('/', (req, res) => {
    res.json({ message: "Welcome to Bria Salon API" });
});

export default app;
