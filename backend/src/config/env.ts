require('dotenv').config();

export default {
    port: process.env.PORT || 8000,
    databaseUrl: process.env.DATABASE_URL || "postgres://postgres:postgres@localhost:5432/bria_salon",
    dbUser: process.env.POSTGRES_USER || "postgres",
    dbPassword: process.env.POSTGRES_PASSWORD || "postgres",
    dbName: process.env.POSTGRES_DB || "bria_salon",
    nodeEnv: process.env.NODE_ENV || 'development',
    jwtSecret: process.env.JWT_SECRET || 'bria_unisex_salon_secret_key_123',
    stripeSecretKey: process.env.STRIPE_SECRET_KEY,
    stripePublishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
    stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET || 'whsec_test',
};
