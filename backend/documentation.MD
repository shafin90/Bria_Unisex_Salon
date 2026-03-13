# Bria Unisex Salon - Backend Documentation

This document provides a comprehensive overview of the Bria Salon backend architecture, setup instructions, and environment configuration.

## 🏛 Architecture Overview

The backend is built with **Node.js** and **Express**, utilizing a **Modular Architecture** to ensure scalability, maintainability, and separation of concerns.

### Project Structure

```text
src/
 ├── modules/                # Feature-based modules
 │   ├── [feature]/
 │   │   ├── [feature].controller.js  # Handles HTTP requests/responses
 │   │   ├── [feature].service.js     # Contains business logic
 │   │   ├── [feature].repository.js  # Direct database interactions
 │   │   ├── [feature].routes.js      # Endpoint definitions
 │   │   └── [feature].model.js       # Sequelize model definition
 ├── middleware/             # Global middlewares (Auth, Errors)
 ├── config/                 # Configuration (DB, Env)
 ├── utils/                  # Shared utilities (Socket, Email, PDF)
 ├── app.js                  # Express app setup and route consolidation
 └── server.js               # Application entry point
```

### Components
1.  **Controllers**: Interface between the web layer and the service layer.
2.  **Services**: The "brain" of the application where all logic resides.
3.  **Repositories**: Abstraction layer for database queries, making it easy to swap ORMs or databases.
4.  **Models**: Definition of the database schema using **Sequelize**.

---

## 🛠 Tech Stack
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: PostgreSQL 15
- **ORM**: Sequelize
- **Containerization**: Docker & Docker Compose
- **Real-time**: Socket.IO
- **Storage**: Cloudinary (for images)
- **Payments**: Stripe

---

## 🚀 How to Run

### 1. Using Docker (Recommended)
The entire stack (App + Database) can be started with a single command. 

**Prerequisites**: Docker and Docker Compose installed.

```bash
docker-compose up --build
```

- High-level orchestration is handled via `docker-compose.yml`.
- Database data is persisted in a Docker volume.
- The app will wait for the database to be healthy before starting.

### 2. Local Development
If you prefer running without Docker:

**Prerequisites**: Node.js and a running PostgreSQL instance.

1.  Clone the repository and install dependencies:
    ```bash
    npm install
    ```
2.  Configure your environment variables (see below).
3.  Start the development server:
    ```bash
    npm run dev
    ```

---

## 🔑 Environment Variables

You need to provide the following environment variables. If using Docker, these are passed via the `docker-compose.yml` or a `.env` file.

| Variable | Description | Example |
| :--- | :--- | :--- |
| `PORT` | Port for the backend server | `5000` |
| `DATABASE_URL` | PostgreSQL Connection String | `postgres://user:pass@localhost:5432/db` |
| `POSTGRES_USER` | DB Username (for Docker) | `postgres` |
| `POSTGRES_PASSWORD` | DB Password (for Docker) | `password` |
| `POSTGRES_DB` | DB Name (for Docker) | `bria_db` |
| `NODE_ENV` | Environment mode | `development` / `production` |
| `STRIPE_SECRET_KEY` | Stripe API Secret | `sk_test_...` |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary Name | `your_cloud_name` |
| `CLOUDINARY_API_KEY` | Cloudinary API Key | `your_api_key` |
| `CLOUDINARY_API_SECRET` | Cloudinary Secret | `your_secret` |

## 🔐 Security & Authorization

The application uses a customized **Role-Based Access Control (RBAC)** middleware to secure routes and ensure that only authorized staff can access certain features.

### Role-Based Access Control (RBAC)
Located in `src/middleware/auth.middleware.js`, the authorization system defines specific gates for different staff roles:

```javascript
module.exports = {
    isOwner: checkRole(['Owner']),               // Only Owner role allowed
    isManager: checkRole(['Owner', 'Manager']),  // Owner and Manager roles allowed
    isStylist: checkRole(['Owner', 'Stylist']),  // Owner and Stylist roles allowed
};
```

1.  **`isOwner`**: This is the most restrictive permission. It is used for administrative tasks like managing stylists, viewing sensitive financial reports, or modifying core salon settings.
2.  **`isManager`**: Extends access to Managers. Managers can typically handle inventory, view full booking schedules, and manage customer reviews.
3.  **`isStylist`**: Specifically for the service providers (Stylists). They are granted access to their own schedules, portfolio uploads, and stylist-specific features, while the Owner retains override access.

### How it Works
The `checkRole` function acts as a higher-order middleware. It:
- Decodes the authorization token to identify the logged-in user.
- Compares the user's role against the array of allowed roles passed to the function.
- Grants access (calls `next()`) if a match is found, or returns a `403 Forbidden` error if the user lacks the required permission.

---

## 📊 Database Management

### Schema Synchronization
The application uses `sequelize.sync({ alter: true })` inside `src/config/db.js`. 
- **In Development**: This automatically creates/updates tables to match your models.
- **In Production**: It is recommended to use migrations for more control.

### Associations
Relationships (Foreign Keys) are centrally defined in `src/config/db.js` to avoid circular dependencies between modules.

---

## 📦 Feature Modules
The system is divided into 14 core modules:
- **Auth**: Admin & Stylist authentication.
- **User**: Customer profile management.
- **Booking**: Appointment handling.
- **Service**: Salon service catalog.
- **Stylist**: Staff management and commissions.
- **Inventory**: Salon product stock tracking.
- **Portfolio**: Stylist work showcase.
- **Package**: Combined service offers.
- **Waitlist**: Handling overflow bookings.
- **Review**: Customer feedback and ratings.
- **Chat**: Real-time communication between users and salon.
- **Offer**: Promotional banners and deals.
- **Dashboard**: Aggregated stats for the admin.
- **Payment**: Payment tracking and processing.
