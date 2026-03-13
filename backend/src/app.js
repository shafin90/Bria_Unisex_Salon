const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();

// CORS options
const corsOptions = {
    origin: function (origin, callback) {
        callback(null, true);
    },
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Import Models for associations if needed (already handled in db.js)
const { connectDB } = require('./config/db');
const authRoutes = require('./modules/auth/auth.routes');
const userRoutes = require('./modules/user/user.routes');
const bookingRoutes = require('./modules/booking/booking.routes');
const serviceRoutes = require('./modules/service/service.routes');
const inventoryRoutes = require('./modules/inventory/inventory.routes');
const portfolioRoutes = require('./modules/portfolio/portfolio.routes');
const packageRoutes = require('./modules/package/package.routes');
const waitlistRoutes = require('./modules/waitlist/waitlist.routes');
const reviewRoutes = require('./modules/review/review.routes');
const chatRoutes = require('./modules/chat/chat.routes');
const offerRoutes = require('./modules/offer/offer.routes');
const dashboardRoutes = require('./modules/dashboard/dashboard.routes');
const stylistRoutes = require('./modules/stylist/stylist.routes');
const paymentRoutes = require('./modules/payment/payment.routes');

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

module.exports = app;
