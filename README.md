# WomXchange Rwanda: E-Commerce Platform for Women Entrepreneurs

## Description
WomXchange Rwanda is a free and easy-to-use online platform designed to help women entrepreneurs in Kigali sell their products, manage orders, and grow their businesses. It provides simple tools for both sellers and buyers, including a chatbot for support, product management, order tracking, and an integrated payment system via MoMoPay (Mobile Money). The platform supports both English and Kinyarwanda, making it more accessible to a wide range of users.
 ** Three key user roles:**
 

- **Admins**: Oversee vendors, manage users, track sales and reports
- **Vendors**: Upload and manage products and handle customer orders
- **Clients**: Browse products, add to cart, place orders, and track  purchases

## Basic Features

1. Admin Dashboard:

- Manage seller registration (approve/reject sellers).

- Monitor product listings and flagged items.

- Generate sales and performance reports.

2. Seller Dashboard:

- Add, update, and manage product listings.

- Track and manage orders (pending, fulfilled, cancelled).

- View sales performance and trends.

- Chatbot for assistance with product and order management.

- Buyer Dashboard:

- View and track orders.

- Chatbot support for order tracking, product queries, etc.

3. **Chatbot**:

- A fixed, floating component that provides product suggestions, order   tracking, and answers to frequently asked questions.

4. Payment Integration:

- Supports MoMoPay for payments through the MTN MoMo API.

5. Language Support:

- Available in both English and Kinyarwanda.

### Tech Stack

- **Backend**: Node.js, Express.js, PostgreSQL using Sequelize ORM
- **Frontend**: React with TypeScript and Vite
- **Auth**: JWT-based authentication and role-based access for `Admin`, `Vendor`, and `Client`
- **Open AI**: api for chartbort

**The app includes:**
- Full product order flow
- Admin & Vendor dashboards
- Protected routes with role restrictions
- API-integrated React frontend

---

##  GitHub Repository

https://github.com/Beritha-n12/womxchange_e_commerce.git

---

## How to Set Up the Development Environment

Follow these steps to run the full project locally:

### Prerequisites

- **Node.js** (v18+ recommended)
- **npm**
- **PostgreSQL** installed and running
- **Git** installed
- Optional: **Sequelize CLI** for DB migrations

---

###  1. Clone the Repository

```bash
git clone https://github.com/Beritha-n12/womxchange_e_commerce.git
```
```bash
cd backend
npm install

```
```bash
PORT=5000
DATABASE_URL=postgresql://username:password@localhost:5432/ecommerce_clothing
JWT_SECRET=your_super_secret_key

```
```bash
npx sequelize-cli db:migrate

```
```bash
npm run dev


```
---
### Frontend setup

```bash
cd frontend
npm install

```
```bash
npm run dev


```
---
### UI/UX Design (Figma)

The user interface and experience of WomXchange Rwanda were thoughtfully designed using Figma, a collaborative design tool that allows for fast prototyping and clear communication of interface concepts.
What’s Included in the Figma Design:
Admin Dashboard UI — showing analytics, user data, product stats, and sales performance

**Seller Portal** — for uploading products, viewing orders, and managing inventory


**Buyer Pages** — product listings, cart view, checkout interface


**Authentication Pages** — login/signup interfaces with support for English and Kinyarwanda


**Chatbot Interface** — simple, mobile-friendly chatbot window for user assistance


**Responsive Design Layouts** — optimized for both mobile and desktop views


## Design Goal

The goal of the design was to make the platform:
Simple and intuitive for both buyers and sellers

 - Culturally appropriate and bilingual (English & Kinyarwanda)


 - Easily navigable with minimal training


**Figma Link**
This is link to figma designs

https://www.figma.com/design/wYnkMmCRsebWESppOOi9Uo/WomXchange-Rwanda?node-id=0-1&t=7OiUIMFwJMCC3vBf-1

## System Architecture Overview
The WomXchange Rwanda platform is built using Node.js for the backend, React for the frontend, and PostgreSQL as the database. These components work together to deliver an interactive, responsive e-commerce experience.

## Frontend Layer (React)
The React frontend is responsible for the user interface (UI) where users (both buyers and sellers) interact with the platform. The React frontend communicates with the Node.js backend through API calls.

## Key Pages:
1. Homepage: Displays featured products, product categories, and promotions.

2. Product Listing Page: Shows products with filtering and sorting options.

3. Product Detail Page: Displays detailed information about a selected product.

4. Seller Dashboard: Sellers can manage products and track orders.

5. Buyer Dashboard: Buyers can manage their orders, profile, and wishlist.

6. Cart Page: Displays items in the cart and allows users to proceed to checkout.

7. Checkout Page: Collects shipping and payment information from users.

8. Order Confirmation Page: Displays a summary of the order and the order number.

9. Login/Registration Pages: Allows both buyers and sellers to sign up or log in.

## Backend Layer (Node.js + PostgreSQL)
The Node.js backend handles business logic, data management, and provides services through APIs. PostgreSQL is used as the database for storing data.

## Key APIs:
1. User Authentication API: Handles user registration, login, and profile management.

2. Product Management API: Allows sellers to add, update, and delete products.

3. Order Management API: Manages order creation, updates, and tracking.

5. Payment API: Integrates with MoMoPay for payment processing.

6. Chatbot API: Handles user queries and interactions with the chatbot.

7. Admin API: Allows admins to manage users, products, and monitor platform usage.

## System Interaction Flow
Frontend to Backend Interaction:
1. Homepage Interaction:

2. Buyer visits the Homepage to view featured products and categories.

3. The React frontend makes API calls to the Product Management API to fetch product data.

## Product Listing Page:

Buyer filters products by category, price range, and other attributes.

The React frontend sends GET requests to the Product Management API to retrieve filtered products from the PostgreSQL database.

## Product Detail Page:

When a Buyer clicks on a product, they are redirected to the Product Detail Page.

The React frontend sends a GET request to the backend to fetch detailed product information.

## Seller Dashboard:

Sellers log in to their Seller Dashboard to manage products and view order history.

POST/PUT/DELETE requests are made from the React frontend to the Product Management API to update product details.

## Buyer Dashboard:

Buyer views order history, tracks orders, and manages their profile.

GET requests are sent to the Order Management API to fetch order data.

## Chatbot Interaction:

The React frontend integrates a floating chatbot to handle user queries.

POST requests are sent to the Chatbot API in the backend to process queries and provide responses.

## Cart Page:

Buyer adds products to the cart.

POST requests are made to the Cart API to update the cart, and GET requests fetch cart data.

## Checkout Page:

After reviewing the cart, the Buyer enters shipping and payment details.

POST request sends order details to the Order API, and the Payment API (MoMoPay) processes the payment transaction.

## Order Confirmation Page:

After successful payment, the Buyer is redirected to the Order Confirmation Page where they can see the order summary.

The Order API sends the data to populate the page with details such as products, total cost, shipping information, and order number.

## Circuit Diagram
A circuit diagram representing the data flow between the Frontend, Backend, and Database:

Frontend (React App) → Backend (Node.js APIs):

User Authentication: The frontend sends login/registration data to the User Authentication API. The backend verifies the data and sends a success/error response.

Product Management: The frontend sends requests to the Product Management API to retrieve or modify product data.

Order Management: The frontend sends requests to the Order Management API for placing, tracking, or canceling orders.

Payment Processing: The frontend sends payment details to the Payment API, which processes the payment via MoMoPay.

## Backend (Node.js + PostgreSQL Database):

The Node.js backend interacts with the PostgreSQL database to store and retrieve data (e.g., user info, products, orders).

The Node.js APIs interact with the database, processing data sent from the frontend.

## Database (PostgreSQL):

The PostgreSQL database stores all data related to users, products, orders, payments, and chatbot interactions.

SQL queries are used to insert, update, delete, and retrieve data based on frontend requests through the backend APIs.

## Design Flow (Pages and Interactions)
Homepage → Product Listing Page → Product Detail Page → Add to Cart → Checkout Page → Order Confirmation Page

Seller Dashboard → Product Management → Order Tracking

Buyer Dashboard → Order Tracking → Wishlist Management

Chatbot → Backend API → Chatbot Response

## System Flow (API Interaction)

User makes a request (Frontend → Backend):

The user interacts with the UI (searching for products, adding to cart). The frontend sends necessary data (via Axios or other HTTP methods) to the backend.

Backend processes the request (Backend → Database):

The backend processes the request (fetches products, processes orders, etc.) and interacts with the PostgreSQL database.

Response sent back to the frontend (Backend → Frontend):

After processing, the backend sends the response (e.g., product list, order details) back to the frontend for display.

##  Deployment Plan

We plan to deploy this project on Render  a cloud platform used for hosting web applications and APIs.
 Why Render?
- Easy to use and developer-friendly

- Free tier suitable for student and demo projects

- Supports automatic deployment from GitHub

- Ideal for Node.js backends like this project

Deployment Plan

Platform: Render

Both Frontend and and client will be hosted on Render

App Type: Web Service (Node.js)


> 🔄 Updates to either frontend or backend trigger automatic deployments via GitHub commits.

---
## Author
Beritha Niyotwagira
nberitha12@gmail.com

