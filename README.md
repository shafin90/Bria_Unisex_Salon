# Bria Unisex Salon - Enterprise-Grade Management Ecosystem



**Bria Unisex Salon** is a sophisticated, high-performance management platform architected for modern salon operations. This monorepo demonstrates an industry-standard implementation of a full-stack application, prioritizing **modularity**, **scalability**, and **developer experience**.

---

## 🎨 System Design & High-Level Architecture

The system is designed using a **Feature-Based Modular Architecture**. This pattern isolates domain logic (e.g., Bookings, Inventory) into self-contained units, facilitating independent scaling and seamless transition to a Multi-Tenant SaaS model.

```mermaid
graph TD
    subgraph "Infrastructure (Docker Compose)"
        Postgres[(PostgreSQL 15)]
        API_Server[Node.js / Express API]
    end

    subgraph "Frontend Layer (Vite & React)"
        Admin_Panel[Admin Dashboard]
        Public_Portal[Public Booking Portal]
    end

    subgraph "Shared Services"
        Cloudinary[Cloudinary Image Storage]
        Stripe[Stripe Payment Gateway]
        SocketIO[Socket.IO Real-time Engine]
    end

    Admin_Panel -- REST API / JWT --> API_Server
    Public_Portal -- REST API --> API_Server
    API_Server -- Sequelize ORM --> Postgres
    API_Server -- Events --> SocketIO
    API_Server -- Media --> Cloudinary
    API_Server -- Billing --> Stripe

---

## 📊 End-to-End Application Flowchart

The following diagram details the complete operational flow of the system, from public customer interactions to backend processing and administrative management.

```mermaid
graph TD
    %% Public Flow
    Start((User Visit)) --> IsAdmin{Target: Admin?}
    
    subgraph "Customer Journey (Public)"
        IsAdmin -- No --> Home[Lading Page /]
        Home --> Browse[Browse Services]
        Browse --> Book[Book Appointment /book]
        Book --> API_Book[API: Validate & Create Booking]
        API_Book --> DB_Write[(DB: Save Booking)]
        DB_Write --> Notify[Real-time Alert to Admin]
        Notify -.-> SocketIO((Socket.IO))
    end
    
    %% Admin Flow
    subgraph "Management Workflow (Admin)"
        IsAdmin -- Yes --> Login[Admin Login /admin/login]
        Login --> Auth[API: Verify JWT & Role]
        Auth -- Success --> Dash[Admin Dashboard /admin/*]
        Auth -- Failure --> Login
        
        Dash --> Manage_Bookings[Manage Bookings]
        Dash --> Manage_Inventory[Stock Control]
        Dash --> Manage_Staff[Staff Scheduling]
        Dash --> Portfolio[Upload Portfolios]
        
        Portfolio --> Cloudinary_Up[Cloudinary: Media Storage]
        Manage_Bookings --> Payment[API: Process Payment]
        Payment --> Stripe_Pay[Stripe Gateway]
    end
    
    %% Real-time Interaction
    Dash <--> Support[Support Chat]
    Support <--> Customer[Customer Chat Window]
    Customer -.-> SocketIO
    Support -.-> SocketIO
```

---

## 🏛 Backend Engineering Patterns (bria_server_)

The backend is built with **Node.js** and **Express**, emphasizing the separation of concerns through the **Repository Pattern**.

### 1. Data Access Layer (DAL)
We abstract database interactions into **Repositories**. This ensures that the Service Layer only interacts with domain objects, making the system ORM-agnostic and easier to unit test.
- **Controllers**: Handle HTTP orchestration (parsing parameters, sending responses).
- **Services**: Contain pure business logic (e.g., calculating commissions, checking booking conflicts).
- **Repositories**: Direct interface with **Sequelize**, encapsulating complex SQL queries.

### 2. Custom RBAC (Role-Based Access Control)
A centralized authorization middleware secures the API. It utilizes high-order functions to define access gates:
- `isOwner`: Full system control.
- `isManager`: Operational management (Inventory, Staff scheduling).
- `isStylist`: Portfolio and personal schedule management.

### 3. Unified Real-time Engine
Integrated **Socket.IO** allows for real-time customer support chat and live dashboard updates without page refreshes.

---

## 💻 Frontend Excellence (Bria-Unisex-Salon-frontend)

The frontend is a premium Single Page Application (SPA) built with **React 18** and **Vite**, focusing on speed and aesthetics.

### 1. State Management & Context
Instead of heavy global stores, we use a decentralized approach:
- **AuthContext**: Manages JWT lifecycle and user permissions.
- **CartContext**: Handles dynamic service selection for bookings.
- **Custom Hooks**: Encapsulates reusable logic like API fetching, animations, and form handling.

### 2. Premium UI/UX with GSAP
The interface uses **GSAP (GreenSock Animation Platform)** to provide high-end micro-interactions and smooth layout transitions, creating a "premium salon feel" that wows both owners and customers.

### 3. Centralized API Architecture
A robust `apiClient` ensures:
- **Automatic Auth**: Attaches JWT tokens from localStorage to every outgoing request.
- **Graceful Error Handling**: Global response interceptors handle 401 (Expired token) or 500 (Server error) states consistently across the UI.

---

## 🛠 Tech Stack Selection Rationale

| Tool | Usage | Rationale |
| :--- | :--- | :--- |
| **PostgreSQL 15** | Primary Data Store | Strong ACID compliance for critical financial and booking data. |
| **Sequelize** | Object-Relational Mapping | Provides a type-safe interface for complex relational schemas and migrations. |
| **Tailwind CSS** | Design System | Enables rapid UI development with a consistent, utility-first styling approach. |
| **Lucide React** | Iconography | High-quality, customizable vector icons for a modern dashboard look. |
| **Vite** | Build Tooling | Lightning-fast HMR (Hot Module Replacement) and optimized production bundles. |

---

## 📦 Deep-Dive Feature Modules

The monorepo contains **14+ production-ready modules**, each with unified logic across frontend and backend:

- **📅 Booking Logic**: Handles complex appointment scheduling with conflict prevention and staff availability checks.
- **💬 Chat Module**: Real-time communication bridge built on WebSocket for instant customer-to-salon support.
- **📈 Dashboard Intelligence**: Data aggregation engine that transforms raw SQL data into visual business insights.
- **🛠 Service Catalog**: Dynamic management of salon services, categories, and duration-based pricing.
- **📦 Inventory Pro**: Real-time tracking of product quantities with automated low-stock notifications.
- **👩‍🎨 Stylist Excellence**: Dedicated profiles, commission calculation, and individual portfolio management.
- **📜 Smart Waitlist**: Algorithm-based system to reallocate canceled slots to waiting customers automatically.

---

## 🚀 The Roadmap: SaaS Transformation

We are currently evolving this system into a multi-tenant SaaS platform. 

### Current Progress:
- [x] **Modular Structure**: Fully refactored to support feature isolation.
- [x] **Containerization**: Standardized Docker environments for easy scaling.

### Next Steps:
1. **Logical Isolation**: Updating the Repository layer to include `tenant_id` for every query, ensuring complete data privacy for hundreds of salons on one database.
2. **Dynamic Theming**: Implementing a branding engine that injects custom colors and logos into the frontend based on the salon subdomain.
3. **Enterprise Billing**: Integrating **Stripe Subscriptions** for tiered professional plans.

---

## 📖 Explore Further
This project is built for the highest standards of code quality and documentation.
- 📘 [Backend Technical Manual](./bria_server_/documentation.MD)
- 📙 [Frontend Architecture Guide](./Bria-Unisex-Salon-frontend/documentation.MD)

---
Developed with ❤️ by a Software Engineer dedicated to high-performance system design.
