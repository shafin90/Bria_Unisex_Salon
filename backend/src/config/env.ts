require('dotenv').config();

export default {
    port: process.env.PORT || 8000,
    databaseUrl: process.env.DATABASE_URL || "postgres://postgres:postgres@localhost:5432/bria_salon",
    dbUser: process.env.POSTGRES_USER || "postgres",
    dbPassword: process.env.POSTGRES_PASSWORD || "postgres",
    dbName: process.env.POSTGRES_DB || "bria_salon",
    nodeEnv: process.env.NODE_ENV || 'development',
};
