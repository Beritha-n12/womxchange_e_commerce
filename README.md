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

 [GitHub Repo Link](https://github.com/Beritha-n12/womxchange_e_commerce.git)

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
cd ecommerce-clothing-app
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

[ WomXchange Figma Prototype](https://www.figma.com/design/wYnkMmCRsebWESppOOi9Uo/WomXchange-Rwanda?node-id=0-1&t=7OiUIMFwJMCC3vBf-1)

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

