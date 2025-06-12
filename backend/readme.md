# E-Commerce Backend API

This project is a backend API for an E-commerce app built with Node.js, Express, and MongoDB. It supports user authentication with JWT, role-based access control (admin, vendor, client), and product management APIs.

## Project Structure

backend/
├── controllers/
│ ├── authController.js # Handles user registration and login
│ └── productController.js # Handles product CRUD operations
├── middlewares/
│ ├── authMiddleware.js # Protects routes and handles roles
│ └── errorHandler.js # Custom error handling middleware
├── models/
│ ├── userModel.js # User schema with roles and password hashing
│ └── productModel.js # Product schema
├── routes/
│ ├── authRoutes.js # Routes for authentication
│ └── productRoutes.js # Routes for product management
├── utils/
│ └── generateToken.js # Function to generate JWT tokens
├── config/
│ └── db.js # MongoDB connection setup
├── server.js # Main server file
├── .env # Environment variables
└── package.json # NPM project metadata


## Setup Instructions

1. Make sure you have **Node.js** and **MongoDB** installed and running locally.

2. Navigate to the `backend` folder and install dependencies:


3. Create a `.env` file in the `backend` folder with the following content:


4. Start the development server:


The server will run at `http://localhost:5000`.

## API Endpoints

### Authentication

**Register a new user**


## Role-Based Access

- **Admin**: Full control on all product management
- **Vendor**: Can manage (create/update/delete) products
- **Client**: Can only view products

## Testing With Postman

1. Register a user via `/api/auth/register`.
2. Login via `/api/auth/login` and copy the JWT token from the response.
3. For all product requests, include the header:


4. Test endpoints: `GET`, `POST`, `PUT`, and `DELETE`.

## Notes

- Passwords are hashed using **bcrypt**.
- JWT tokens expire after **1 hour** (configurable in code).
- MongoDB must be running locally, or update the `.env` connection string.
- Use `npm run dev` to run the app in development mode with **nodemon**.

---

That's it — your complete backend ready for authentication and product management with role-based access!
